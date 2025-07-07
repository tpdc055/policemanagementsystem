import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createHash, createHmac } from "crypto";

// GET /api/integration/police-system - Get cases for main system
export async function GET(request: NextRequest) {
  try {
    // Verify API key authentication
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.MAIN_SYSTEM_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since"); // ISO date string
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    if (since) {
      where.updatedAt = {
        gte: new Date(since),
      };
    }

    const cases = await db.cyberCase.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
        victims: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
            recoveredAmount: true,
          },
        },
        suspects: {
          select: {
            id: true,
            name: true,
            alias: true,
            phoneNumber: true,
            email: true,
            address: true,
          },
        },
        evidence: {
          select: {
            id: true,
            title: true,
            evidenceType: true,
            fileSize: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            evidence: true,
            investigations: true,
            socialMediaProfiles: true,
            legalRequests: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Transform data for main police system format
    const transformedCases = cases.map((case_) => ({
      externalSystemId: case_.id,
      caseNumber: case_.caseId,
      title: case_.title,
      description: case_.description,
      offenseType: case_.offenseType,
      status: case_.status,
      priority: case_.priority,
      incidentDate: case_.incidentDate,
      reportedDate: case_.reportedDate,
      location: case_.location,
      estimatedFinancialLoss: case_.estimatedLoss,
      currency: case_.currency,
      createdAt: case_.createdAt,
      updatedAt: case_.updatedAt,
      resolutionDate: case_.resolutionDate,

      // Officer information
      reportingOfficer: {
        id: case_.createdBy.id,
        name: case_.createdBy.name,
        email: case_.createdBy.email,
        rank: case_.createdBy.role,
        department: case_.createdBy.department,
      },

      assignedOfficer: case_.assignedTo ? {
        id: case_.assignedTo.id,
        name: case_.assignedTo.name,
        email: case_.assignedTo.email,
        rank: case_.assignedTo.role,
        department: case_.assignedTo.department,
      } : null,

      // People involved
      victims: case_.victims.map(victim => ({
        id: victim.id,
        name: victim.name,
        contactPhone: victim.phoneNumber,
        contactEmail: victim.email,
        financialLoss: victim.recoveredAmount,
      })),

      suspects: case_.suspects.map(suspect => ({
        id: suspect.id,
        name: suspect.name,
        alias: suspect.alias,
        contactPhone: suspect.phoneNumber,
        contactEmail: suspect.email,
        knownLocation: suspect.address,
      })),

      // Case metrics
      evidenceCount: case_._count.evidence,
      investigationCount: case_._count.investigations,
      socialMediaProfilesCount: case_._count.socialMediaProfiles,
      legalRequestsCount: case_._count.legalRequests,

      // Evidence summary
      evidenceSummary: case_.evidence.map(evidence => ({
        id: evidence.id,
        title: evidence.title,
        type: evidence.evidenceType,
        sizeBytes: evidence.fileSize,
        uploadedAt: evidence.createdAt,
      })),
    }));

    const total = await db.cyberCase.count({ where });

    return NextResponse.json({
      success: true,
      data: transformedCases,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      meta: {
        timestamp: new Date().toISOString(),
        systemVersion: "1.0.0",
        dataFormat: "png-police-v1",
      },
    });
  } catch (error) {
    console.error("Integration API error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

// POST /api/integration/police-system - Receive updates from main system
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get("x-webhook-signature");
    const body = await request.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expectedSignature = createHmac("sha256", process.env.MAIN_SYSTEM_WEBHOOK_SECRET || "")
      .update(body)
      .digest("hex");

    if (signature !== `sha256=${expectedSignature}`) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    // Process different event types
    switch (event) {
      case "case.linked":
        await handleCaseLinked(data);
        break;

      case "officer.transferred":
        await handleOfficerTransferred(data);
        break;

      case "case.priority_changed":
        await handleCasePriorityChanged(data);
        break;

      case "unit.restructure":
        await handleUnitRestructure(data);
        break;

      default:
        console.warn("Unknown webhook event:", event);
        return NextResponse.json(
          { error: "Unknown event type", success: false },
          { status: 400 }
        );
    }

    // Log the webhook event
    await db.auditLog.create({
      data: {
        userId: "system",
        action: "WEBHOOK",
        resource: "integration",
        newValues: { event, data },
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Event ${event} processed successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", success: false },
      { status: 500 }
    );
  }
}

// Handle case linking from main system
async function handleCaseLinked(data: Record<string, unknown>) {
  const { cyberCaseId, mainSystemCaseId, linkType, metadata } = data;
  const caseId = cyberCaseId as string;
  const mainCaseId = mainSystemCaseId as string;

  // Update cyber crime case with main system reference
  await db.cyberCase.update({
    where: { caseId: caseId },
    data: {
      parentCaseId: mainCaseId,
    },
  });

  // Create case update entry
  await db.caseUpdate.create({
    data: {
      caseId: caseId,
      title: "Case Linked to Main System",
      content: `This cyber crime case has been linked to main system case ${mainCaseId} (${linkType})`,
      updateType: "system_integration",
    },
  });

  // Notify assigned investigator
  const case_ = await db.cyberCase.findUnique({
    where: { caseId: caseId },
    include: { assignedTo: true },
  });

  if (case_?.assignedTo) {
    await db.notification.create({
      data: {
        userId: case_.assignedToId!,
        caseId: case_.id,
        type: "CASE_UPDATE",
        title: "Case Linked to Main System",
        message: `Your cyber crime case ${cyberCaseId} has been linked to main system case ${mainCaseId}`,
      },
    });
  }
}

// Handle officer transfer from main system
async function handleOfficerTransferred(data: Record<string, unknown>) {
  const { officerId, fromDepartment, toDepartment, transferDate, newSupervisor } = data;
  const id = officerId as string;
  const email = data.email as string;
  const toDept = toDepartment as string;
  const fromDept = fromDepartment as string;
  const transferDt = transferDate as string;

  // Find officer by email or ID
  const officer = await db.user.findFirst({
    where: {
      OR: [
        { id: id },
        { email: email },
      ],
    },
  });

  if (!officer) {
    console.warn("Officer not found for transfer:", officerId);
    return;
  }

  // Update officer department
  await db.user.update({
    where: { id: officer.id },
    data: {
      department: toDept,
    },
  });

  // Reassign cases if officer is leaving cyber crime unit
  if (fromDept === "Cyber Crime Unit" && toDept !== "Cyber Crime Unit") {
    const activeCases = await db.cyberCase.findMany({
      where: {
        assignedToId: officer.id,
        status: {
          in: ["OPEN", "IN_PROGRESS", "UNDER_INVESTIGATION"],
        },
      },
    });

    // Find new supervisor or senior investigator to reassign cases
    const newAssignee = await db.user.findFirst({
      where: {
        department: "Cyber Crime Unit",
        role: {
          in: ["SENIOR_INVESTIGATOR", "UNIT_COMMANDER"],
        },
        isActive: true,
      },
    });

    if (newAssignee && activeCases.length > 0) {
      await db.cyberCase.updateMany({
        where: {
          assignedToId: officer.id,
          status: {
            in: ["OPEN", "IN_PROGRESS", "UNDER_INVESTIGATION"],
          },
        },
        data: {
          assignedToId: newAssignee.id,
        },
      });

      // Create notifications for reassigned cases
      for (const case_ of activeCases) {
        await db.notification.create({
          data: {
            userId: newAssignee.id,
            caseId: case_.id,
            type: "CASE_ASSIGNED",
            title: "Case Reassigned Due to Transfer",
            message: `Case ${case_.caseId} has been reassigned to you due to officer transfer`,
          },
        });
      }
    }
  }

  // Log the transfer
  await db.auditLog.create({
    data: {
      userId: officer.id,
      action: "TRANSFER",
      resource: "user",
      oldValues: { department: fromDept },
      newValues: { department: toDept, transferDt },
    },
  });
}

// Handle case priority changes from main system
async function handleCasePriorityChanged(data: Record<string, unknown>) {
  const { caseId, newPriority, reason, authorizedBy } = data;
  const id = caseId as string;
  const priority = newPriority as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  const changeReason = reason as string;
  const authorizer = authorizedBy as string;

  // Update case priority
  const updatedCase = await db.cyberCase.update({
    where: { caseId: id },
    data: {
      priority: priority,
    },
    include: { assignedTo: true },
  });

  // Create case update
  await db.caseUpdate.create({
    data: {
      caseId: updatedCase.id,
      title: "Priority Changed by Main System",
      content: `Case priority changed to ${priority} by ${authorizer}. Reason: ${changeReason}`,
      updateType: "priority_change",
    },
  });

  // Notify assigned investigator
  if (updatedCase.assignedTo) {
    await db.notification.create({
      data: {
        userId: updatedCase.assignedToId!,
        caseId: updatedCase.id,
        type: "CASE_UPDATE",
        title: "Case Priority Updated",
        message: `Case ${caseId} priority has been changed to ${priority}`,
        priority: priority,
      },
    });
  }
}

// Handle unit restructuring from main system
async function handleUnitRestructure(data: { changes: Array<{ userId: string; newRole: "ADMIN" | "UNIT_COMMANDER" | "SENIOR_INVESTIGATOR" | "INVESTIGATOR" | "ANALYST" | "OFFICER"; newDepartment: string }>; effectiveDate: string; authorizedBy: string }) {
  const { changes, effectiveDate, authorizedBy } = data;

  for (const change of changes) {
    const { userId, newRole, newDepartment } = change;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      await db.user.update({
        where: { id: userId },
        data: {
          role: newRole,
          department: newDepartment,
        },
      });

      // Log the change
      await db.auditLog.create({
        data: {
          userId,
          action: "RESTRUCTURE",
          resource: "user",
          oldValues: { role: user.role, department: user.department },
          newValues: { role: newRole, department: newDepartment },
        },
      });

      // Notify the user
      await db.notification.create({
        data: {
          userId,
          type: "SYSTEM_NOTIFICATION",
          title: "Role and Department Updated",
          message: `Your role has been updated to ${newRole} in ${newDepartment} effective ${effectiveDate}`,
        },
      });
    }
  }
}

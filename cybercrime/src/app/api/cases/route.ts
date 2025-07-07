import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CaseStatus, Priority } from "@prisma/client";

// GET /api/cases - Get all cases with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as CaseStatus | null;
    const priority = searchParams.get("priority") as Priority | null;
    const assignedToId = searchParams.get("assignedToId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;

    const cases = await db.cyberCase.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        suspects: true,
        victims: true,
        evidence: {
          select: { id: true, title: true, evidenceType: true, createdAt: true },
        },
        _count: {
          select: {
            evidence: true,
            investigations: true,
            socialMediaProfiles: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await db.cyberCase.count({ where });

    return NextResponse.json({
      cases,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cases - Create a new case
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      offenseType,
      priority,
      parentCaseId,
      incidentDate,
      reportedDate,
      location,
      estimatedLoss,
      currency,
      assignedToId,
      victims,
      suspects,
    } = body;

    // Generate case ID
    const year = new Date().getFullYear();
    const lastCase = await db.cyberCase.findFirst({
      where: {
        caseId: {
          startsWith: `CYBER-${year}-`,
        },
      },
      orderBy: { caseId: "desc" },
    });

    let caseNumber = 1;
    if (lastCase) {
      const lastNumber = parseInt(lastCase.caseId.split("-")[2]);
      caseNumber = lastNumber + 1;
    }

    const caseId = `CYBER-${year}-${caseNumber.toString().padStart(3, "0")}`;

    // Create the case
    const newCase = await db.cyberCase.create({
      data: {
        caseId,
        title,
        description,
        offenseType,
        priority,
        parentCaseId,
        incidentDate: new Date(incidentDate),
        reportedDate: new Date(reportedDate),
        location,
        estimatedLoss: estimatedLoss ? parseFloat(estimatedLoss) : null,
        currency: currency || "PGK",
        createdById: session.user.id,
        assignedToId: assignedToId || session.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Create victims if provided
    if (victims && victims.length > 0) {
      await db.victim.createMany({
        data: victims.map((victim: Record<string, unknown>) => ({
          ...victim,
          cases: { connect: { id: newCase.id } },
        })),
      });
    }

    // Create suspects if provided
    if (suspects && suspects.length > 0) {
      await db.suspect.createMany({
        data: suspects.map((suspect: Record<string, unknown>) => ({
          ...suspect,
          cases: { connect: { id: newCase.id } },
        })),
      });
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        resource: "case",
        resourceId: newCase.id,
        newValues: { caseId: newCase.caseId, title: newCase.title },
      },
    });

    // Create notification for assigned user if different from creator
    if (assignedToId && assignedToId !== session.user.id) {
      await db.notification.create({
        data: {
          userId: assignedToId,
          caseId: newCase.id,
          type: "CASE_ASSIGNED",
          title: "New Case Assigned",
          message: `You have been assigned to case ${caseId}: ${title}`,
          priority: priority,
        },
      });
    }

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

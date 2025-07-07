import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/cases/[id] - Get a specific case
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const caseData = await db.cyberCase.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, role: true, department: true },
        },
        suspects: true,
        victims: true,
        evidence: {
          include: {
            uploadedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        investigations: {
          include: {
            investigator: {
              select: { id: true, name: true, email: true },
            },
            tasks: true,
          },
          orderBy: { createdAt: "desc" },
        },
        socialMediaProfiles: {
          include: {
            monitoringActivities: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        },
        legalRequests: {
          include: {
            requestedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        caseUpdates: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/cases/[id] - Update a case
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const existingCase = await db.cyberCase.findUnique({
      where: { id: (await params).id },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Store old values for audit log
    const oldValues = {
      status: existingCase.status,
      priority: existingCase.priority,
      assignedToId: existingCase.assignedToId,
      title: existingCase.title,
      description: existingCase.description,
    };

    const updatedCase = await db.cyberCase.update({
      where: { id: (await params).id },
      data: {
        ...body,
        updatedAt: new Date(),
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

    // Create case update entry
    if (body.updateNote) {
      await db.caseUpdate.create({
        data: {
          caseId: (await params).id,
          title: body.updateTitle || "Case Updated",
          content: body.updateNote,
          updateType: body.updateType || "general_update",
        },
      });
    }

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        resource: "case",
        resourceId: (await params).id,
        oldValues,
        newValues: body,
      },
    });

    // Create notifications for relevant changes
    if (body.assignedToId && body.assignedToId !== oldValues.assignedToId) {
      await db.notification.create({
        data: {
          userId: body.assignedToId,
          caseId: (await params).id,
          type: "CASE_ASSIGNED",
          title: "Case Reassigned",
          message: `You have been assigned to case ${existingCase.caseId}`,
          priority: updatedCase.priority,
        },
      });
    }

    if (body.status && body.status !== oldValues.status) {
      // Notify assigned user of status change
      if (updatedCase.assignedToId) {
        await db.notification.create({
          data: {
            userId: updatedCase.assignedToId,
            caseId: (await params).id,
            type: "CASE_UPDATE",
            title: "Case Status Updated",
            message: `Case ${existingCase.caseId} status changed to ${body.status}`,
          },
        });
      }
    }

    return NextResponse.json(updatedCase);
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cases/[id] - Delete a case (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to delete cases
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "UNIT_COMMANDER" &&
      session.user.role !== "SENIOR_INVESTIGATOR"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingCase = await db.cyberCase.findUnique({
      where: { id: (await params).id },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Archive the case instead of hard delete
    const archivedCase = await db.cyberCase.update({
      where: { id: (await params).id },
      data: {
        status: "ARCHIVED",
        updatedAt: new Date(),
      },
    });

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        resource: "case",
        resourceId: (await params).id,
        oldValues: { caseId: existingCase.caseId, status: existingCase.status },
        newValues: { status: "ARCHIVED" },
      },
    });

    return NextResponse.json({
      message: "Case archived successfully",
      case: archivedCase,
    });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

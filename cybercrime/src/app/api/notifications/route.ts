import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = { userId: session.user.id };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await db.notification.findMany({
      where,
      include: {
        case: {
          select: { id: true, caseId: true, title: true, status: true },
        },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    const unreadCount = await db.notification.count({
      where: { userId: session.user.id, isRead: false },
    });

    const total = await db.notification.count({ where });

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and commanders can create system notifications
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "UNIT_COMMANDER"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userIds, type, title, message, caseId, priority, data } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs array is required" },
        { status: 400 }
      );
    }

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    // Create notifications for multiple users
    const notifications = await Promise.all(
      userIds.map((userId: string) =>
        db.notification.create({
          data: {
            userId,
            caseId: caseId || null,
            type: type || "SYSTEM_NOTIFICATION",
            title,
            message,
            priority: priority || "MEDIUM",
            
          },
          include: {
            case: {
              select: { id: true, caseId: true, title: true },
            },
          },
        })
      )
    );

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        resource: "notifications",
        newValues: {
          title,
          message,
          userCount: userIds.length,
          type,
        },
      },
    });

    return NextResponse.json({
      message: "Notifications created successfully",
      count: notifications.length,
    });
  } catch (error) {
    console.error("Error creating notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface NotificationPreferences {
  caseAssigned: {
    email: boolean;
    realtime: boolean;
  };
  caseUpdated: {
    email: boolean;
    realtime: boolean;
  };
  evidenceUploaded: {
    email: boolean;
    realtime: boolean;
  };
  legalRequestResponse: {
    email: boolean;
    realtime: boolean;
  };
  urgentAlerts: {
    email: boolean;
    realtime: boolean;
  };
  systemNotifications: {
    email: boolean;
    realtime: boolean;
  };
  digestFrequency: "none" | "daily" | "weekly";
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

// GET /api/notifications/preferences - Get user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user preferences from database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        notificationPreferences: true // This would be a JSON field in the user table
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default preferences if none exist
    const defaultPreferences: NotificationPreferences = {
      caseAssigned: { email: true, realtime: true },
      caseUpdated: { email: true, realtime: true },
      evidenceUploaded: { email: true, realtime: true },
      legalRequestResponse: { email: true, realtime: true },
      urgentAlerts: { email: true, realtime: true },
      systemNotifications: { email: false, realtime: true },
      digestFrequency: "daily",
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "06:00",
      },
    };

    const preferences = user.notificationPreferences
      ? { ...defaultPreferences, ...(user.notificationPreferences as any) }
      : defaultPreferences;

    return NextResponse.json({
      preferences,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/preferences - Update user's notification preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences: NotificationPreferences = await request.json();

    // Validate preferences structure
    const requiredFields = [
      'caseAssigned', 'caseUpdated', 'evidenceUploaded',
      'legalRequestResponse', 'urgentAlerts', 'systemNotifications'
    ];

    for (const field of requiredFields) {
      if (!preferences[field as keyof NotificationPreferences] ||
          typeof preferences[field as keyof NotificationPreferences] !== 'object') {
        return NextResponse.json(
          { error: `Invalid preference field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate digest frequency
    const validDigestFrequencies = ["none", "daily", "weekly"];
    if (!validDigestFrequencies.includes(preferences.digestFrequency)) {
      return NextResponse.json(
        { error: "Invalid digest frequency" },
        { status: 400 }
      );
    }

    // Validate quiet hours format
    if (preferences.quietHours.enabled) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(preferences.quietHours.start) ||
          !timeRegex.test(preferences.quietHours.end)) {
        return NextResponse.json(
          { error: "Invalid quiet hours format. Use HH:MM format." },
          { status: 400 }
        );
      }
    }

    // Update user preferences
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        notificationPreferences: preferences as any,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        notificationPreferences: true,
      },
    });

    // Log the preference change
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        resource: "notification_preferences",
        resourceId: session.user.id,
        newValues: preferences as any,
      },
    });

    return NextResponse.json({
      message: "Notification preferences updated successfully",
      preferences: updatedUser.notificationPreferences,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications/preferences/test - Send test notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();

    // Validate notification type
    const validTypes = [
      "caseAssigned", "caseUpdated", "evidenceUploaded",
      "legalRequestResponse", "urgentAlerts", "systemNotifications"
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    // Create test notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: "SYSTEM_NOTIFICATION",
        title: `Test Notification - ${type}`,
        message: `This is a test notification for ${type} preferences. If you received this, your notification settings are working correctly.`,
        priority: type === "urgentAlerts" ? "URGENT" : "MEDIUM",
      },
    });

    // Log test notification
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TEST",
        resource: "notification",
        newValues: { type, testSent: true },
      },
    });

    return NextResponse.json({
      message: "Test notification sent successfully",
      type,
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

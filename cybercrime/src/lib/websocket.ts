import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { getSession } from "next-auth/react";

declare global {
  let io: SocketIOServer | undefined;
}

export function initializeWebSocket(httpServer: HTTPServer) {
  if ((global as any).io) {
    return (global as any).io;
  }

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      // You would typically validate the session here
      // For now, we'll just allow all connections
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join user to their personal room
    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join case-specific rooms
    socket.on("join_case", (caseId: string) => {
      socket.join(`case:${caseId}`);
      console.log(`User joined case room: ${caseId}`);
    });

    // Leave case room
    socket.on("leave_case", (caseId: string) => {
      socket.leave(`case:${caseId}`);
      console.log(`User left case room: ${caseId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  (global as any).io = io;
  return io;
}

export function getWebSocketInstance() {
  if (!(global as any).io) {
    throw new Error("WebSocket not initialized");
  }
  return (global as any).io;
}

// Notification types for real-time updates
export interface RealTimeNotification {
  id: string;
  type: 'CASE_ASSIGNED' | 'CASE_UPDATE' | 'EVIDENCE_UPLOADED' | 'URGENT_ALERT' | 'SYSTEM_NOTIFICATION';
  title: string;
  message: string;
  caseId?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  data?: Record<string, unknown>;
  timestamp: string;
}

// Utility functions for sending real-time notifications
export const realTimeNotifications = {
  // Send notification to specific user
  toUser: (userId: string, notification: RealTimeNotification) => {
    const io = getWebSocketInstance();
    io.to(`user:${userId}`).emit("notification", notification);
  },

  // Send notification to all users in a case
  toCase: (caseId: string, notification: RealTimeNotification) => {
    const io = getWebSocketInstance();
    io.to(`case:${caseId}`).emit("case_update", notification);
  },

  // Send notification to all connected users (system-wide)
  toAll: (notification: RealTimeNotification) => {
    const io = getWebSocketInstance();
    io.emit("system_notification", notification);
  },

  // Send urgent alert to specific users
  urgentAlert: (userIds: string[], notification: RealTimeNotification) => {
    const io = getWebSocketInstance();
    userIds.forEach(userId => {
      io.to(`user:${userId}`).emit("urgent_alert", notification);
    });
  },

  // Case-specific events
  caseEvents: {
    statusChanged: (caseId: string, status: string, updatedBy: string) => {
      const io = getWebSocketInstance();
      io.to(`case:${caseId}`).emit("case_status_changed", {
        caseId,
        status,
        updatedBy,
        timestamp: new Date().toISOString(),
      });
    },

    evidenceAdded: (caseId: string, evidence: Record<string, unknown>, uploadedBy: string) => {
      const io = getWebSocketInstance();
      io.to(`case:${caseId}`).emit("evidence_added", {
        caseId,
        evidence,
        uploadedBy,
        timestamp: new Date().toISOString(),
      });
    },

    assignmentChanged: (caseId: string, newAssignee: string, previousAssignee?: string) => {
      const io = getWebSocketInstance();
      io.to(`case:${caseId}`).emit("assignment_changed", {
        caseId,
        newAssignee,
        previousAssignee,
        timestamp: new Date().toISOString(),
      });
    },
  },
};

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { EvidenceProcessor } from "@/lib/evidence-processor-simple";
// import sharp from "sharp"; // TODO: Fix Sharp types for image processing

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/mp4",
  "video/webm",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const caseId = formData.get("caseId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const evidenceType = formData.get("evidenceType") as string;
    const source = formData.get("source") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!caseId || !title || !description || !evidenceType || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size too large. Maximum 50MB allowed." },
        { status: 400 }
      );
    }

    // Verify case exists and user has access
    const caseData = await db.cyberCase.findUnique({
      where: { id: caseId },
      include: {
        createdBy: { select: { id: true } },
        assignedTo: { select: { id: true } },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    // Check if user has access to this case
    const hasAccess =
      caseData.createdById === session.user.id ||
      caseData.assignedToId === session.user.id ||
      session.user.role === "ADMIN" ||
      session.user.role === "UNIT_COMMANDER";

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), "uploads", "evidence", caseId);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process evidence with advanced analysis
    const processor = EvidenceProcessor.getInstance();
    const evidenceAnalysis = await processor.processEvidence(buffer, file.name, file.type);

    // Use processed file if available, otherwise original
    const processedBuffer = evidenceAnalysis.processed.optimizedFile || buffer;
    const fileHash = evidenceAnalysis.forensics.sha256;

    // Save file
    await writeFile(filePath, processedBuffer);

    // Create evidence record in database with enhanced analysis
    const evidence = await db.evidence.create({
      data: {
        caseId,
        title,
        description,
        evidenceType: evidenceType as "SCREENSHOT" | "DOCUMENT" | "VIDEO" | "AUDIO" | "EMAIL" | "CHAT_LOG" | "FINANCIAL_RECORD" | "DEVICE_DATA" | "NETWORK_LOG" | "OTHER",
        filePath: `uploads/evidence/${caseId}/${fileName}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        hash: fileHash,
        source,
        collectedBy: session.user.id,
        collectedAt: new Date(),
        filename: file.name,
        type: file.type,
        size: file.size,
        chainOfCustody: [
          {
            action: "UPLOADED",
            userId: session.user.id,
            userName: session.user.name,
            timestamp: new Date().toISOString(),
            notes: "Evidence uploaded to system with advanced analysis",
            analysis: {
              securityRisk: evidenceAnalysis.analysis.securityRisk,
              extractedText: evidenceAnalysis.extractedText ? evidenceAnalysis.extractedText.substring(0, 500) : null,
              metadata: evidenceAnalysis.metadata,
              forensics: {
                md5: evidenceAnalysis.forensics.md5,
                sha1: evidenceAnalysis.forensics.sha1,
                entropy: evidenceAnalysis.forensics.entropy,
                suspiciousPatterns: evidenceAnalysis.forensics.suspiciousPatterns,
              },
            },
          },
        ],
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
        case: {
          select: { id: true, caseId: true, title: true },
        },
      },
    });

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        resource: "evidence",
        resourceId: evidence.id,
        newValues: {
          title: evidence.title,
          evidenceType: evidence.evidenceType,
          fileName: evidence.fileName,
          caseId: evidence.caseId,
        },
      },
    });

    // Create case update
    await db.caseUpdate.create({
      data: {
        caseId,
        title: "Evidence Added",
        content: `New evidence "${title}" uploaded by ${session.user.name}`,
        updateType: "evidence_added",
      },
    });

    // Notify assigned investigator if different from uploader
    if (caseData.assignedToId && caseData.assignedToId !== session.user.id) {
      await db.notification.create({
        data: {
          userId: caseData.assignedToId,
          caseId,
          type: "EVIDENCE_UPLOADED",
          title: "New Evidence Added",
          message: `New evidence "${title}" has been uploaded to case ${caseData.caseId}`,
        },
      });
    }

    return NextResponse.json({
      message: "Evidence uploaded successfully",
      evidence: {
        id: evidence.id,
        title: evidence.title,
        fileName: evidence.fileName,
        fileSize: evidence.fileSize,
        evidenceType: evidence.evidenceType,
        uploadedAt: evidence.createdAt,
        uploadedBy: evidence.uploadedBy,
      },
    });
  } catch (error) {
    console.error("Error uploading evidence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/upload/[filename] - Download/view evidence files
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This would need additional implementation for secure file serving
    // You'd typically want to:
    // 1. Verify the user has access to the specific evidence file
    // 2. Serve the file through a secure mechanism
    // 3. Log file access for audit purposes

    return NextResponse.json(
      { error: "File download endpoint not implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

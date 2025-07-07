import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { readFile, access } from "fs/promises";
import { join } from "path";
import { constants } from "fs";

// GET /api/evidence/[id]/download - Download evidence file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get evidence record
    const evidence = await db.evidence.findUnique({
      where: { id: (await params).id },
      include: {
        case: {
          include: {
            createdBy: { select: { id: true } },
            assignedTo: { select: { id: true } },
          },
        },
        uploadedBy: { select: { id: true, name: true } },
      },
    });

    if (!evidence) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }

    // Check if user has access to this evidence
    const hasAccess =
      evidence.case.createdById === session.user.id ||
      evidence.case.assignedToId === session.user.id ||
      evidence.collectedBy === session.user.id ||
      session.user.role === "ADMIN" ||
      session.user.role === "UNIT_COMMANDER";

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file exists
    if (!evidence.filePath) { return NextResponse.json({ error: "File path not found" }, { status: 404 }); }
    const filePath = join(process.cwd(), evidence.filePath);
    try {
      await access(filePath, constants.F_OK);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Log access
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DOWNLOAD",
        resource: "evidence",
        resourceId: evidence.id,
        newValues: {
          fileName: evidence.fileName,
          caseId: evidence.caseId,
          downloadedAt: new Date(),
        },
      },
    });

    // Update chain of custody
    const chainOfCustody = evidence.chainOfCustody as any[] || [];
    chainOfCustody.push({
      action: "DOWNLOADED",
      userId: session.user.id,
      userName: session.user.name,
      timestamp: new Date().toISOString(),
      notes: `File downloaded by ${session.user.name}`,
    });

    await db.evidence.update({
      where: { id: evidence.id },
      data: { chainOfCustody },
    });

    // Set appropriate headers
    const headers = new Headers();
    headers.set("Content-Type", evidence.mimeType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${evidence.fileName}"`);
    headers.set("Content-Length", fileBuffer.length.toString());
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    console.error("Evidence download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/evidence/[id]/view - View evidence file inline (for images, PDFs)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get evidence record
    const evidence = await db.evidence.findUnique({
      where: { id: (await params).id },
      include: {
        case: {
          include: {
            createdBy: { select: { id: true } },
            assignedTo: { select: { id: true } },
          },
        },
      },
    });

    if (!evidence) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }

    // Check access
    const hasAccess =
      evidence.case.createdById === session.user.id ||
      evidence.case.assignedToId === session.user.id ||
      evidence.collectedBy === session.user.id ||
      session.user.role === "ADMIN" ||
      session.user.role === "UNIT_COMMANDER";

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file is viewable
    const viewableTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "text/plain", "text/csv",
    ];

    if (!viewableTypes.includes(evidence.mimeType || "")) {
      return NextResponse.json(
        { error: "File type not viewable inline" },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!evidence.filePath) { return NextResponse.json({ error: "File path not found" }, { status: 404 }); }
    const filePath = join(process.cwd(), evidence.filePath);
    try {
      await access(filePath, constants.F_OK);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Log view access
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "VIEW",
        resource: "evidence",
        resourceId: evidence.id,
        newValues: {
          fileName: evidence.fileName,
          caseId: evidence.caseId,
          viewedAt: new Date(),
        },
      },
    });

    // Set headers for inline viewing
    const headers = new Headers();
    headers.set("Content-Type", evidence.mimeType || "application/octet-stream");
    headers.set("Content-Disposition", `inline; filename="${evidence.fileName}"`);
    headers.set("Content-Length", fileBuffer.length.toString());
    headers.set("Cache-Control", "private, max-age=300"); // 5 minutes cache
    headers.set("X-Content-Type-Options", "nosniff");

    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    console.error("Evidence view error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

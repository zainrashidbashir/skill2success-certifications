import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const p = await params;
    const { id } = p;
    
    // Check if certificates depend on this template
    const certsCount = await prisma.certificate.count({
      where: { templateId: id }
    });

    if (certsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete template. ${certsCount} certificates are using it.` },
        { status: 400 }
      );
    }

    await prisma.certificateTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

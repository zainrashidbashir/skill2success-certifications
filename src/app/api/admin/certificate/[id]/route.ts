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
    const resolvedParams = await params;
    await prisma.certificate.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Failed to delete certificate", error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}

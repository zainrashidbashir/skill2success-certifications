import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    
    // Prisma will not cascade delete automatically unless configured in schema
    // So we first delete all certificates belonging to the student
    await prisma.certificate.deleteMany({
      where: { studentId: resolvedParams.id }
    });

    // Then delete the student
    await prisma.student.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({ message: "Student and their certificates deleted successfully" });
  } catch (error) {
    console.error("Failed to delete student", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}

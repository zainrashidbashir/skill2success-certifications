import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HashService, CertificateDataPayload } from "@/services/HashService";
import { BlockchainService } from "@/services/BlockchainService";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, courseName, instructorName, issueDate, completionDate } = body;

    // Fetch student
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 400 });
    }

    // Find or create Course
    let course = await prisma.course.findFirst({ where: { name: courseName } });
    if (!course) {
      course = await prisma.course.create({ data: { name: courseName } });
    }

    // Find or create Instructor
    let instructor = await prisma.instructor.findFirst({ where: { name: instructorName } });
    if (!instructor) {
      instructor = await prisma.instructor.create({ data: { name: instructorName } });
    }

    // Generate unique Credential ID
    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    const credentialId = `S2S-${new Date().getFullYear()}-${randomSuffix}`;

    const payload: CertificateDataPayload = {
      credentialId,
      studentName: student.name,
      courseName: course.name,
      instructorName: instructor.name,
      issueDate: issueDate || new Date().toISOString(),
      completionDate
    };

    // 1. Generate cryptographic hash
    const hash = HashService.generateHash(payload);

    // 2. (Optional) Submit to blockchain
    const txHash = await BlockchainService.recordHashToBlockchain(credentialId, hash);

    // 3. Save to database
    const certificate = await prisma.certificate.create({
      data: {
        credentialId,
        studentId,
        courseId: course.id,
        instructorId: instructor.id,
        issueDate: new Date(payload.issueDate),
        completionDate: new Date(payload.completionDate),
        status: "VALID",
        hash: hash,
        qrCodeUrl: "", // Will be generated on the fly or saved here via QRService
      }
    });

    return new Response(JSON.stringify(certificate), { status: 201 });
  } catch (error) {
    console.error("Failed to issue certificate:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function GET() {
  const certificates = await prisma.certificate.findMany({
    include: {
      student: true,
      course: true,
      instructor: true
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return new Response(JSON.stringify(certificates), { status: 200 });
}

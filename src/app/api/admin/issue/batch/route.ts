import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { records, templateId } = await req.json();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "No records provided" }, { status: 400 });
    }

    if (!templateId) {
      return NextResponse.json({ error: "No template selected" }, { status: 400 });
    }

    const createdCertificates = [];

    // Process each record sequentially (or in Promise.all if independent)
    for (const record of records) {
      const { StudentName, Email, CourseName, InstructorName, IssueDate } = record;
      
      if (!StudentName || !Email || !CourseName || !InstructorName) continue; // Skip invalid rows

      // 1. Get or Create Student
      let student = await prisma.student.findUnique({ where: { email: Email } });
      if (!student) {
        student = await prisma.student.create({
          data: { name: StudentName, email: Email, password: "student123" } // Default pass
        });
      }

      // 2. Get or Create Course
      let course = await prisma.course.findFirst({ where: { name: CourseName } });
      if (!course) {
        course = await prisma.course.create({ data: { name: CourseName } });
      }

      // 3. Get or Create Instructor
      let instructor = await prisma.instructor.findFirst({ where: { name: InstructorName } });
      if (!instructor) {
        instructor = await prisma.instructor.create({ data: { name: InstructorName } });
      }

      // 4. Generate Certificate Data
      const credentialId = `S2S-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      let issueDateObj = new Date();
      if (IssueDate) {
        const parsed = new Date(IssueDate);
        if (!isNaN(parsed.getTime())) {
          issueDateObj = parsed;
        }
      }
      
      const hashPayload = JSON.stringify({
        studentName: student.name,
        courseName: course.name,
        issueDate: issueDateObj.toISOString(),
        credentialId
      });
      const hash = crypto.createHash('sha256').update(hashPayload).digest('hex');

      // 5. Create Certificate
      const cert = await prisma.certificate.create({
        data: {
          credentialId,
          studentId: student.id,
          courseId: course.id,
          instructorId: instructor.id,
          issueDate: issueDateObj,
          completionDate: issueDateObj,
          hash,
          templateId,
        },
        include: {
          student: true,
          course: true,
          instructor: true
        }
      });

      createdCertificates.push(cert);
    }

    return NextResponse.json({ certificates: createdCertificates }, { status: 200 });

  } catch (error: any) {
    console.error("Batch issue error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

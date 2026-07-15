import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const students = await prisma.student.findMany({ select: { id: true, name: true } });
    const courses = await prisma.course.findMany({ select: { id: true, name: true } });
    const instructors = await prisma.instructor.findMany({ select: { id: true, name: true } });

    return NextResponse.json({ students, courses, instructors });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

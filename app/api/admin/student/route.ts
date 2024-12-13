import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const student = await prisma.student.findMany({
      select: {
        id: true,
        studentId: true,
        fullName: true,
        department: true,
        subjects: true,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

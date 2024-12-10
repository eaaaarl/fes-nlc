import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const student = await prisma.student.findMany({
      select: {
        id: true,
        fullName: true,
        department: true,
        subjects: true,
        plaintTextPassword: true,
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

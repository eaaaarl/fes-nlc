import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const existingStudent = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        fullName: true,
        department: true,
        subjects: true,
      },
    });
    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "Student is not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(existingStudent);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

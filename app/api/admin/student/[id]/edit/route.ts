import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { studentEditSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;
    const payload = await req.json();
    const { fullName, subjectIds, department } =
      studentEditSchema.parse(payload);
    const existingStudent = await prisma.student.findUnique({
      where: {
        id,
      },
    });
    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "Student not found",
        },
        { status: 404 }
      );
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id,
      },
      data: {
        fullName,
        department,
        subjects: {
          set: subjectIds.map((id: string) => ({ id: parseInt(id, 10) })),
        },
      },
    });

    return NextResponse.json(updatedStudent);
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
        id,
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

import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { facultyEditSchema } from "@/lib/validation";
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
    const { facultyName, subjectIds, department } =
      facultyEditSchema.parse(payload);

    const existingFaculty = await prisma.faculty.findUnique({
      where: {
        id,
      },
    });
    if (!existingFaculty) {
      return NextResponse.json(
        {
          error: "Faculty not found",
        },
        { status: 404 }
      );
    }

    const updatedFaculty = await prisma.faculty.update({
      where: {
        id,
      },
      data: {
        fullName: facultyName,
        department,
        subjects: {
          set: subjectIds.map((id: string) => ({ id: parseInt(id, 10) })),
        },
      },
    });

    return NextResponse.json(updatedFaculty);
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

    const existingFaculty = await prisma.faculty.findUnique({
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
    if (!existingFaculty) {
      return NextResponse.json(
        {
          error: "Faculty is not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(existingFaculty);
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

import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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
        { status: 401 }
      );
    }
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        {
          error: "Id provider is not found.",
        },
        { status: 404 }
      );
    }

    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });
    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "Student is not found.",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.student.delete({
        where: { id },
      });

      if (existingStudent.userId) {
        await tx.user.delete({
          where: { id: existingStudent.userId },
        });
      }
    });

    return NextResponse.json({ success: true, code: 201 });
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

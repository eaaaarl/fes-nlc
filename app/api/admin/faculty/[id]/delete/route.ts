import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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

    if (!id) {
      return NextResponse.json(
        {
          error: "ID provider is not found",
        },
        { status: 404 }
      );
    }

    const existingFaculty = await prisma.faculty.findUnique({
      where: {
        id,
      },
    });

    if (!existingFaculty) {
      return NextResponse.json(
        {
          error: "Faculty is not found.",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.faculty.delete({
        where: { id },
      });

      if (existingFaculty.userId) {
        await tx.user.delete({
          where: { id: existingFaculty.userId },
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

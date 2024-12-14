import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
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

    const existingStudent = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        fullName: true,
        department: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "Student is not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ info: existingStudent });
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

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

    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        username: true,
        Role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User is not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: existingUser });
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

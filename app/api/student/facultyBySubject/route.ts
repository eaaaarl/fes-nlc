import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const subjectId = parseInt(req.nextUrl.searchParams.get("subjectId") || "");

    if (!subjectId) {
      return NextResponse.json(
        {
          error: "subjectId is not found",
        },
        { status: 404 }
      );
    }

    const faculty = await prisma.faculty.findMany({
      where: {
        subjects: {
          some: {
            id: subjectId,
          },
        },
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!faculty) {
      return NextResponse.json(
        {
          error: "No faculty is found.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ faculty });
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

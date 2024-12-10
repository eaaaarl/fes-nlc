import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const question = await prisma.question.findMany({
      include: {
        category: true,
      },
    });

    const ratingScale = await prisma.ratingScale.findMany({
      select: {
        rating: true,
        description: true,
      },
    });
    return NextResponse.json({ question, ratingScale });
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

import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const subject = await prisma.subject.findMany({
      select: {
        id: true,
        subjectName: true,
      },
    });

    return NextResponse.json(subject);
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

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
        {
          status: 401,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const selectedSubject = await tx.student.findMany({
        where: {
          userId: user.id,
        },
        include: {
          subjects: true,
          SubjectEvaluation: true,
        },
      });

      const subjectCount = selectedSubject.reduce(
        (count, ss) => count + (ss.subjects.length || 0),
        0
      );
      const totalEvaluatedCount = selectedSubject.reduce(
        (count, se) => count + (se.SubjectEvaluation.length || 0),
        0
      );

      return {
        subject: subjectCount,
        totalEvaluated: totalEvaluatedCount,
        semester: "2024-2025 1ST SEMESTER",
      };
    });

    return NextResponse.json(result);
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

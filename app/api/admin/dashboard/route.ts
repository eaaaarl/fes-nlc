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

    const result = await prisma.$transaction(async (tx) => {
      const totalUsers = await tx.user.count();

      const totalFaculty = await tx.user.count({
        where: { Role: "FACULTY" },
      });

      const totalStudents = await tx.user.count({
        where: { Role: "STUDENT" },
      });

      const totalSubjects = await tx.subject.count();
      const totalEvaluated = await tx.evaluation.count();
      const totalSession = await tx.session.count();
      return {
        totalUsers,
        totalFaculty,
        totalStudents,
        totalSubjects,
        totalEvaluated,
        currentSemester: "2024-2025 1ST SEMESTER",
        activeUsers: totalSession,
      };
    });

    return NextResponse.json(result, { status: 200 });
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

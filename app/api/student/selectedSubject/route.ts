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

    const existingStudent = await prisma.student.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "Student is not found",
        },
        {
          status: 404,
        }
      );
    }

    const unevaluatedSubjects = await prisma.subject.findMany({
      where: {
        students: {
          some: {
            id: existingStudent.id,
          },
        },
        SubjectEvaluation: {
          none: {
            studentId: existingStudent.id,
            isEvaluated: true,
          },
        },
      },
    });

    return NextResponse.json({ subjects: unevaluatedSubjects });
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

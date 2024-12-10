import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { evaluationSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
    });

    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "Student is not found",
        },
        { status: 404 }
      );
    }

    const payload = await req.json();
    const { facultyId, subject, classSchedule, comments, response } =
      evaluationSchema.parse(payload);

    const result = await prisma.$transaction(async (prisma) => {
      const evaluation = await prisma.evaluation.create({
        data: {
          facultyId: parseInt(facultyId),
          subject,
          classSchedule,
          responseId: "0",
          comments: comments || undefined,
        },
      });

      const responses = await Promise.all(
        Object.entries(response).map(([questionId, rating]) =>
          prisma.response.create({
            data: {
              evaluationId: evaluation.id,
              questionId: parseInt(questionId),
              rating: rating,
            },
          })
        )
      );

      await prisma.evaluation.update({
        where: { id: evaluation.id },
        data: {
          responseId: responses[0].id.toString(),
        },
      });

      await prisma.subjectEvaluation.upsert({
        where: {
          uniqueSubjectNameStudentId: {
            subjectName: subject,
            studentId: existingStudent.id,
          },
        },

        update: {
          isEvaluated: true,
          evaluatedAt: new Date(),
        },

        create: {
          subjectName: subject,
          studentId: existingStudent.id,
          subjectId: payload.subjectId,
          isEvaluated: true,
        },
      });

      return { evaluation, responses };
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

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
    const studentId = req.nextUrl.searchParams.get("studentId") || "";
    if (!studentId) {
      return NextResponse.json(
        {
          error: "studentId is not found.",
        },
        { status: 404 }
      );
    }
    const payload = await req.json();
    const { facultyId, subject, classSchedule, comments, response } =
      evaluationSchema.parse(payload);

    // Create evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        facultyId,
        subject,
        classSchedule,
        responseId: "0",
        comments: comments || undefined,
      },
    });

    // Create responses
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

    // Update evaluation with first response ID
    await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: {
        responseId: responses[0].id.toString(),
      },
    });

    // Upsert subject evaluation
    await prisma.subjectEvaluation.upsert({
      where: {
        uniqueSubjectNameStudentId: {
          subjectName: subject,
          studentId: studentId,
        },
      },
      update: {
        isEvaluated: true,
        evaluatedAt: new Date(),
      },
      create: {
        subjectName: subject,
        studentId: studentId,
        subjectId: payload.subjectId,
        isEvaluated: true,
      },
    });

    return NextResponse.json({ evaluation, responses });
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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface CategoryScore {
  averageRating: string;
  normalizedValue: string;
  weightedAverage: string;
  weight: string;
}
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await context.params;
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        subjects: true,
        Evaluation: {
          include: {
            Response: {
              include: {
                question: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    const categoryWeights: Record<string, number> = {
      COMMITMENT: 0.2,
      KNOWLEDGE_OF_SUBJECT: 0.2,
      TEACHING_FOR_INDEPENDENT_LEARNING: 0.3,
      MANAGEMENT_OF_LEARNING: 0.3,
    };

    // Faculty-level calculation
    const facultyCategoryData: Record<string, any> = {};
    const facultyTotalEvaluators = faculty.Evaluation.length;

    // Collect all faculty evaluations
    faculty.Evaluation.forEach((evaluation) => {
      evaluation.Response.forEach((response) => {
        const categoryName = response.question.category.categoryName;
        const questionId = response.question.id;

        if (!facultyCategoryData[categoryName]) {
          facultyCategoryData[categoryName] = {
            totalRating: 0,
            questionCount: 0,
            questions: {},
          };
        }

        const maxPerQuestion = 5;
        const normalizedValue = (response.rating / maxPerQuestion) * 100;

        facultyCategoryData[categoryName].totalRating += response.rating;
        facultyCategoryData[categoryName].questionCount += 1;
        facultyCategoryData[categoryName].questions[questionId] = {
          rating: response.rating,
          normalizedValue,
        };
      });
    });

    const facultyCategoryScores: Record<string, CategoryScore> = {};
    let facultyTotalScore = 0;

    for (const [category, data] of Object.entries(facultyCategoryData)) {
      const { totalRating, questionCount } = data;
      const maxPerQuestion = 5;

      const averageRating = totalRating / (questionCount || 1);
      const normalizedValue = (averageRating / maxPerQuestion) * 100;

      const weight = categoryWeights[category] || 0;
      const weightedAverage = (normalizedValue * weight * 100) / 100;

      facultyTotalScore += weightedAverage;

      facultyCategoryScores[category] = {
        averageRating: averageRating.toFixed(2),
        normalizedValue: normalizedValue.toFixed(2),
        weightedAverage: weightedAverage.toFixed(2),
        weight: (weight * 100).toFixed(0) + "%",
      };
    }

    // Subject-level calculation
    const subjectEvaluations = faculty.subjects.map((subject) => {
      // Filter evaluations specific to this subject
      const subjectSpecificEvaluations = faculty.Evaluation.filter(
        (evaluation) => evaluation.subject === subject.subjectName
      );

      const subjectCategoryData: Record<string, any> = {};
      const subjectTotalEvaluators = subjectSpecificEvaluations.length;

      subjectSpecificEvaluations.forEach((evaluation) => {
        evaluation.Response.forEach((response) => {
          const categoryName = response.question.category.categoryName;
          const questionId = response.question.id;

          if (!subjectCategoryData[categoryName]) {
            subjectCategoryData[categoryName] = {
              totalRating: 0,
              questionCount: 0,
              questions: {},
            };
          }

          const maxPerQuestion = 5;
          const normalizedValue = (response.rating / maxPerQuestion) * 100;

          subjectCategoryData[categoryName].totalRating += response.rating;
          subjectCategoryData[categoryName].questionCount += 1;
          subjectCategoryData[categoryName].questions[questionId] = {
            rating: response.rating,
            normalizedValue,
          };
        });
      });

      const subjectCategoryScores: Record<string, CategoryScore> = {};
      let subjectTotalScore = 0;

      for (const [category, data] of Object.entries(subjectCategoryData)) {
        const { totalRating, questionCount } = data;
        const maxPerQuestion = 5;

        const averageRating = totalRating / (questionCount || 1);
        const normalizedValue = (averageRating / maxPerQuestion) * 100;

        const weight = categoryWeights[category] || 0;
        const weightedAverage = (normalizedValue * weight * 100) / 100;

        subjectTotalScore += weightedAverage;

        subjectCategoryScores[category] = {
          averageRating: averageRating.toFixed(2),
          normalizedValue: normalizedValue.toFixed(2),
          weightedAverage: weightedAverage.toFixed(2),
          weight: (weight * 100).toFixed(0) + "%",
        };
      }

      return {
        subjectName: subject.subjectName,
        totalEvaluators: subjectTotalEvaluators,
        breakdown: subjectCategoryScores,
        totalScore: subjectTotalScore.toFixed(2),
      };
    });

    return NextResponse.json({
      facultyId: faculty.id,
      facultyName: faculty.fullName,
      facultyDepartment: faculty.department,
      facultySubjects: faculty.subjects.map((s) => s.subjectName),
      totalEvaluators: facultyTotalEvaluators,
      facultyBreakdown: facultyCategoryScores,
      facultyTotalScore: facultyTotalScore.toFixed(2),
      subjectEvaluations: subjectEvaluations,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

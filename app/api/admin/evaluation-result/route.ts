/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const evaluations = await prisma.evaluation.findMany({
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
        faculty: true,
      },
    });

    if (!evaluations.length) {
      return NextResponse.json(
        { error: "No evaluations found for this faculty." },
        { status: 404 }
      );
    }

    const categoryWeights: Record<string, number> = {
      COMMITMENT: 0.2,
      KNOWLEDGE_OF_SUBJECT: 0.2,
      TEACHING_FOR_INDEPENDENT_LEARNING: 0.3,
      MANAGEMENT_OF_LEARNING: 0.3,
    };

    const categoryData: Record<
      string,
      {
        totalRating: number;
        questionCount: number;
        questions: Record<number, { rating: number; normalizedValue: number }>;
      }
    > = {};
    const totalEvaluators = evaluations.length; // Total evaluators

    evaluations.forEach((evaluation) => {
      evaluation.Response.forEach((response) => {
        const categoryName = response.question.category.categoryName;
        const questionId = response.question.id; // Get the question ID

        if (!categoryData[categoryName]) {
          categoryData[categoryName] = {
            totalRating: 0,
            questionCount: 0,
            questions: {},
          };
        }

        const maxPerQuestion = 5;
        const normalizedValue = (response.rating / maxPerQuestion) * 100;

        categoryData[categoryName].totalRating += response.rating;
        categoryData[categoryName].questionCount += 1;

        categoryData[categoryName].questions[questionId] = {
          rating: response.rating,
          normalizedValue,
        };
      });
    });

    const categoryScores: Record<string, any> = {};
    let totalScore = 0;
    for (const [category, data] of Object.entries(categoryData)) {
      const { totalRating, questionCount } = data;
      const maxPerQuestion = 5; // Max score per question

      const averageRating = totalRating / (questionCount || 1);

      const normalizedValue = (averageRating / maxPerQuestion) * 100;

      const weight = categoryWeights[category] || 0;
      const weightedAverage = (normalizedValue * weight * 100) / 100;

      totalScore += weightedAverage;

      categoryScores[category] = {
        averageRating: averageRating.toFixed(2),
        normalizedValue: normalizedValue.toFixed(2),
        weightedAverage: weightedAverage.toFixed(2),
        weight: weight * 100 + "%",
      };
    }

    const result = {
      facultyName: evaluations[0].faculty.fullName,
      subject: evaluations[0].subject,
      totalEvaluators,
      breakdown: categoryScores,
      totalScore: totalScore.toFixed(2),
    };

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

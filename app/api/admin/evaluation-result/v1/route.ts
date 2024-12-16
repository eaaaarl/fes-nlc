import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface CategoryData {
  totalRating: number;
  questionCount: number;
  questions: Record<number, { rating: number; normalizedValue: number }>;
}

interface CategoryScore {
  averageRating: string;
  normalizedValue: string;
  weightedAverage: string;
  weight: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const faculties = await prisma.faculty.findMany({
      include: {
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
        subjects: true,
      },
    });

    const facultyResults = faculties.map((faculty) => {
      const categoryWeights: Record<string, number> = {
        COMMITMENT: 0.2,
        "KNOWLEDGE OF SUBJECT": 0.2,
        "TEACHING FOR INDEPENDENT LEARNING": 0.3,
        "MANAGEMENT OF LEARNING": 0.3,
      };

      // Group responses by category across all evaluators
      const categoryData: Record<string, CategoryData> = {};

      const totalEvaluators = faculty.Evaluation.length;

      faculty.Evaluation.forEach((evaluation) => {
        evaluation.Response.forEach((response) => {
          const categoryName = response.question.category.categoryName;
          const questionId = response.question.id;

          // Initialize category data if not present
          if (!categoryData[categoryName]) {
            categoryData[categoryName] = {
              totalRating: 0,
              questionCount: 0,
              questions: {},
            };
          }

          // Calculate the normalized value for this question
          const maxPerQuestion = 5;
          const normalizedValue = (response.rating / maxPerQuestion) * 100;

          // Add the rating to the total and increment the question count
          categoryData[categoryName].totalRating += response.rating;
          categoryData[categoryName].questionCount += 1;

          // Store the normalized value for the question
          categoryData[categoryName].questions[questionId] = {
            rating: response.rating,
            normalizedValue,
          };
        });
      });

      const categoryScores: Record<string, CategoryScore> = {};
      let totalScore = 0;

      for (const [category, data] of Object.entries(categoryData)) {
        const { totalRating, questionCount } = data;
        const maxPerQuestion = 5;

        // Calculate the average rating for this category
        const averageRating = totalRating / (questionCount || 1);

        // Calculate the normalized average (out of 100)
        const normalizedValue = (averageRating / maxPerQuestion) * 100;

        // Apply the category weight
        const weight = categoryWeights[category] || 0;
        const weightedAverage = (normalizedValue * weight * 100) / 100;

        // Accumulate total score
        totalScore += weightedAverage;

        // Store results for the category
        categoryScores[category] = {
          averageRating: averageRating.toFixed(2),
          normalizedValue: normalizedValue.toFixed(2),
          weightedAverage: weightedAverage.toFixed(2),
          weight: (weight * 100).toFixed(0) + "%",
        };
      }

      return {
        facultyId: faculty.id,
        facultyName: faculty.fullName,
        facultyDepartment: faculty.department,
        facultySubject: faculty.subjects,
        totalEvaluators,
        breakdown: categoryScores,
        totalScore: totalScore.toFixed(2),
      };
    });

    return NextResponse.json(facultyResults);
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

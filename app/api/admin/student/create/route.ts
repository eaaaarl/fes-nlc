import prisma from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { studentSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { fullName, department, subjectIds, studentId } =
      studentSchema.parse(payload);

    const username = fullName.toLowerCase().replace(/\s+/g, "");

    const hashPass = await hashPassword(username);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: studentId,
          password: hashPass,
          Role: "STUDENT",
        },
      });

      const student = await tx.student.create({
        data: {
          studentId,
          fullName,
          userId: user.id,
          department,
          subjects: {
            connect: subjectIds.map((id: string) => ({ id: parseInt(id, 10) })),
          },
        },
      });

      return { student, user };
    });

    return NextResponse.json({
      success: true,
      faculty: result.student,
      user: result.user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Serer Error",
      },
      { status: 500 }
    );
  }
}

import prisma from "@/lib/db";
import { studentSchema } from "@/lib/validation";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { fullName, department, subjectIds } = studentSchema.parse(payload);

    const plainTextPassword = randomBytes(8).toString("hex");
    const hashPassword = await bcrypt.hash(plainTextPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const username = fullName.toLowerCase().replace(/\s+/g, "");
      const user = await tx.user.create({
        data: {
          username,
          password: hashPassword,
          Role: "STUDENT",
        },
      });

      const plainTextPasswordId = await tx.plainTextPassword.create({
        data: {
          plainTextPassword,
        },
      });

      const student = await tx.student.create({
        data: {
          fullName,
          userId: user.id,
          plainTextPasswordId: plainTextPasswordId.id,
          department,
          subjects: {
            connect: subjectIds.map((id: string) => ({ id: parseInt(id, 10) })),
          },
        },
      });

      return { student, user, plainTextPasswordId };
    });

    return NextResponse.json({
      success: true,
      faculty: result.student,
      user: result.user,
      plainTextPassword: result.plainTextPasswordId,
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

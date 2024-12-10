import prisma from "@/lib/db";
import { facultySchema } from "@/lib/validation";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { facultyName, department, subjectIds } =
      facultySchema.parse(payload);

    const plainTextPassword = randomBytes(8).toString("hex");
    const hashPassword = await bcrypt.hash(plainTextPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const username = facultyName.toLowerCase().replace(/\s+/g, "");
      const user = await tx.user.create({
        data: {
          username: username,
          password: hashPassword,
          Role: "FACULTY",
        },
      });

      const passwordPlainText = await tx.plainTextPassword.create({
        data: {
          plainTextPassword,
        },
      });

      const faculty = await tx.faculty.create({
        data: {
          fullName: facultyName,
          department,
          subjects: {
            connect: subjectIds.map((id: string) => ({ id: parseInt(id, 10) })),
          },
          plainTextPasswordId: passwordPlainText.id,
          userId: user.id,
        },
      });
      return { faculty, user, passwordPlainText };
    });

    return NextResponse.json({
      success: true,
      faculty: result.faculty,
      user: result.user,
      plainTextPassword: result.passwordPlainText,
    });
  } catch (error) {
    console.error("Error in POST /api/faculty:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

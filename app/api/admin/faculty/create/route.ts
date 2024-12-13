import prisma from "@/lib/db";
import { facultySchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { facultyName, department, subjectIds } =
      facultySchema.parse(payload);
    const username = facultyName.toLowerCase().replace(/\s+/g, "");
    const hashPassword = await bcrypt.hash(username, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: username,
          password: hashPassword,
          Role: "FACULTY",
        },
      });

      const faculty = await tx.faculty.create({
        data: {
          fullName: facultyName,
          department,
          subjects: {
            connect: subjectIds.map((id: string) => ({ id: parseInt(id, 10) })),
          },
          userId: user.id,
        },
      });
      return { faculty, user };
    });

    return NextResponse.json({
      success: true,
      faculty: result.faculty,
      user: result.user,
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

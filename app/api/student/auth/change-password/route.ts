import prisma from "@/lib/db";
import { hashPassword, verifyPasswordHash } from "@/lib/password";
import { getCurrentSession } from "@/lib/session";
import { ChangePasswordSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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
    const payload = await req.json();
    const { currentPassword, newPassword } =
      ChangePasswordSchema.parse(payload);

    const existingStudent = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        {
          error: "The provider ID of the student is not found!",
        },
        {
          status: 404,
        }
      );
    }

    const validPassword = await verifyPasswordHash(
      existingStudent.password,
      currentPassword
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Current Password Incorrect",
        },
        { status: 401 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    const student = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      student,
    });
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

import prisma from "@/lib/db";
import { hashPassword, verifyPasswordHash } from "@/lib/password";
import { getCurrentSession } from "@/lib/session";
import { ChangePasswordAdminSchema } from "@/lib/validation";
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
      ChangePasswordAdminSchema.parse(payload);

    const existingAdmin = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        {
          error: "The provider ID of the admin is not found!",
        },
        {
          status: 404,
        }
      );
    }

    const validPassword = await verifyPasswordHash(
      existingAdmin.password,
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
    const admin = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      admin,
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

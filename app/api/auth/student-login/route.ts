import prisma from "@/lib/db";
import { loginStudentSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";
import { verifyPasswordHash } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { studentId, password } = loginStudentSchema.parse(payload);

    const existingUser = await prisma.user.findUnique({
      where: { username: studentId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const validPassword = await verifyPasswordHash(
      existingUser.password,
      password
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    const token = generateSessionToken();

    await createSession(token, existingUser.id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const response = NextResponse.json(
      {
        user: { id: existingUser.id, username: existingUser.username },
      },
      { status: 200 }
    );

    await setSessionTokenCookie(token, expiresAt);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

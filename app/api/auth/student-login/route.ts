import prisma from "@/lib/db";
import { loginStudentSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { username, password } = loginStudentSchema.parse(payload);

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

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

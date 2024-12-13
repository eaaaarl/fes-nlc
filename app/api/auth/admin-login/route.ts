import prisma from "@/lib/db";
import { verifyPasswordHash } from "@/lib/password";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";
import { loginAdminSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const paylod = await req.json();

    const { username, password } = loginAdminSchema.parse(paylod);
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "Invalid username and password",
        },
        { status: 401 }
      );
    }
    const validPassword = await verifyPasswordHash(
      existingUser.password,
      password
    );
    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Invalid username and password",
        },
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
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

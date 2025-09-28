import { NextResponse } from "next/server";
import { UserService } from "@/lib/users";
import { AuthResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Verify user credentials
    const user = await UserService.verifyUserCredentials(email.trim(), password);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    console.log("User logged in successfully:", user.email);

    const response: AuthResponse = {
      user
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
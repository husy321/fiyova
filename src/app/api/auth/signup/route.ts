import { NextResponse } from "next/server";
import { UserService } from "@/lib/users";
import { SignupRequest, AuthResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const { name, email, password }: SignupRequest = await request.json();

    // Validate input
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Create user
    const user = await UserService.createUser({
      name: name.trim(),
      email: email.trim(),
      password
    });

    console.log("User created successfully:", user.email);

    const response: AuthResponse = {
      user
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("Signup error:", error);

    if (error instanceof Error) {
      if (error.message === "User already exists with this email") {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken?.value) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    try {
      const userData = JSON.parse(authToken.value);
      return NextResponse.json({ user: userData });
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
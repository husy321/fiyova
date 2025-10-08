import { NextRequest, NextResponse } from "next/server";
import { getCreditBalance } from "@/lib/credits";

// GET /api/credits/balance - Get user's credit balance
export async function GET(req: NextRequest) {
  try {
    // Get userId from query params or session
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const balance = getCreditBalance(userId);

    return NextResponse.json({
      success: true,
      balance: {
        amount: balance.balance,
        formatted: `$${(balance.balance / 100).toFixed(2)}`,
        currency: balance.currency,
        lastUpdated: balance.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Error fetching credit balance:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit balance" },
      { status: 500 }
    );
  }
}

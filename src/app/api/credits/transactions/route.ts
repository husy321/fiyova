import { NextRequest, NextResponse } from "next/server";
import { getTransactionHistory } from "@/lib/credits";

// GET /api/credits/transactions - Get user's transaction history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const transactions = getTransactionHistory(
      userId,
      limit ? parseInt(limit) : undefined
    );

    // Format transactions for frontend
    const formattedTransactions = transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      amount: txn.amount,
      balanceAfter: txn.balance_after,
      description: txn.description,
      createdAt: txn.createdAt,
      metadata: txn.metadata,
      formatted: {
        amount: `${txn.amount >= 0 ? "+" : ""}$${Math.abs(txn.amount / 100).toFixed(2)}`,
        balanceAfter: `$${(txn.balance_after / 100).toFixed(2)}`,
        date: new Date(txn.createdAt).toLocaleDateString(),
        time: new Date(txn.createdAt).toLocaleTimeString(),
      },
    }));

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createOrder, deductCredits, completeOrder, getCreditBalance } from "@/lib/credits";

// POST /api/orders/create - Create order and pay with credits
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items } = body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "userId and items are required" },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);

    // Check if user has sufficient credits
    const balance = getCreditBalance(userId);
    if (balance.balance < total) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient credits",
          required: total,
          available: balance.balance,
          shortfall: total - balance.balance,
        },
        { status: 400 }
      );
    }

    // Create order
    const order = createOrder(userId, items);

    // Deduct credits
    const deductResult = deductCredits(
      userId,
      total,
      `Order ${order.id}`,
      {
        orderId: order.id,
        items: items.map((item: {
          productId: string;
          productName: string;
          quantity: number;
          pricePerUnit: number;
        }) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
        })),
      }
    );

    if (!deductResult.success) {
      return NextResponse.json(
        { success: false, error: deductResult.error },
        { status: 400 }
      );
    }

    // Complete order
    const completedOrder = completeOrder(order.id);

    return NextResponse.json({
      success: true,
      order: completedOrder,
      transaction: deductResult.transaction,
      newBalance: deductResult.transaction?.balance_after || 0,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

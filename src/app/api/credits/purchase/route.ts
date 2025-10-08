import { NextRequest, NextResponse } from "next/server";
import { getCreditPackageById } from "@/lib/credits";
import { whopSdk } from "@/lib/whop";

// POST /api/credits/purchase - Create Whop checkout for credit package
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageId, userId, userEmail, userName } = body;

    if (!packageId || !userId) {
      return NextResponse.json(
        { success: false, error: "packageId and userId are required" },
        { status: 400 }
      );
    }

    // Get the credit package
    const creditPackage = getCreditPackageById(packageId);
    if (!creditPackage) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID" },
        { status: 404 }
      );
    }

    if (!creditPackage.enabled) {
      return NextResponse.json(
        { success: false, error: "This package is not available" },
        { status: 400 }
      );
    }

    // Check if Whop plan ID is configured
    if (creditPackage.whopPlanId.includes('REPLACE_WITH')) {
      return NextResponse.json(
        {
          success: false,
          error: "Whop plan not configured. Please set up Whop plans in src/lib/credits.ts",
          mode: 'development'
        },
        { status: 400 }
      );
    }

    try {
      // Create checkout session with Whop
      const session = await whopSdk.payments.createCheckoutSession({
        planId: creditPackage.whopPlanId,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/credits/purchase-complete`,
        metadata: {
          type: "credit_purchase",
          packageId: creditPackage.id,
          userId,
          userEmail,
          userName,
          creditAmount: creditPackage.amount,
          bonusAmount: creditPackage.bonus || 0,
          totalCredits: creditPackage.amount + (creditPackage.bonus || 0),
        },
      });

      // Construct checkout URL
      const checkoutUrl = `https://whop.com/checkout/${session.id}`;

      return NextResponse.json({
        success: true,
        checkoutUrl,
        sessionId: session.id,
        package: {
          id: creditPackage.id,
          name: creditPackage.name,
          amount: creditPackage.amount,
          bonus: creditPackage.bonus,
          totalCredits: creditPackage.amount + (creditPackage.bonus || 0),
        },
      });

    } catch (whopError) {
      console.error('Whop checkout error:', whopError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create Whop checkout session. Please check your Whop configuration.',
          details: whopError instanceof Error ? whopError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error creating credit purchase:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create credit purchase"
      },
      { status: 500 }
    );
  }
}

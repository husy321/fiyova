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
      console.log('Creating Whop checkout with plan:', {
        planId: creditPackage.whopPlanId,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/credits/purchase-complete`,
        hasApiKey: !!process.env.WHOP_API_KEY,
        hasAppId: !!process.env.NEXT_PUBLIC_WHOP_APP_ID,
      });

      // If the plan ID starts with "plan_", it's a checkout link
      // We can use it directly without creating a session
      const checkoutUrl = `https://whop.com/checkout/${creditPackage.whopPlanId}`;

      console.log('Using direct checkout URL:', checkoutUrl);

      return NextResponse.json({
        success: true,
        checkoutUrl,
        sessionId: creditPackage.whopPlanId,
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
          details: whopError instanceof Error ? whopError.message : 'Unknown error',
          planId: creditPackage.whopPlanId,
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

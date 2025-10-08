import { NextResponse } from "next/server";
import { getCreditPackages } from "@/lib/credits";

// GET /api/credits/packages - Get all available credit packages
export async function GET() {
  try {
    const packages = getCreditPackages();

    // Format packages for frontend
    const formattedPackages = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      amount: pkg.amount,
      price: pkg.price,
      bonus: pkg.bonus || 0,
      totalCredits: pkg.amount + (pkg.bonus || 0),
      description: pkg.description,
      whopPlanId: pkg.whopPlanId,
      popular: pkg.popular || false,
      formatted: {
        amount: `$${(pkg.amount / 100).toFixed(2)}`,
        price: `$${(pkg.price / 100).toFixed(2)}`,
        bonus: pkg.bonus ? `$${(pkg.bonus / 100).toFixed(2)}` : null,
        totalCredits: `$${((pkg.amount + (pkg.bonus || 0)) / 100).toFixed(2)}`,
      },
    }));

    return NextResponse.json({
      success: true,
      packages: formattedPackages,
    });
  } catch (error) {
    console.error("Error fetching credit packages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit packages" },
      { status: 500 }
    );
  }
}

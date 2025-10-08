"use client";

import { useCreditPackages, useCredits, usePurchaseCredits } from "@/hooks/useCredits";
import { Button } from "@heroui/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@heroui/react";
import { CheckCircle2, Sparkles, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export default function CreditsPage() {
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const { packages, loading: packagesLoading } = useCreditPackages();
  const { balance } = useCredits(userId);
  const { purchaseCredits, loading: purchaseLoading, error: purchaseError } = usePurchaseCredits();

  // Get user info from localStorage (or your auth system)
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.email); // Using email as userId for now
      setUserEmail(userData.email);
      setUserName(userData.name);
    }
  }, []);

  const handlePurchase = async (packageId: string) => {
    if (!userId) {
      alert("Please log in to purchase credits");
      return;
    }

    try {
      const result = await purchaseCredits(packageId, userId, userEmail, userName);

      if (result.checkoutUrl) {
        // Redirect to Whop payment gateway
        window.location.href = result.checkoutUrl;
      } else {
        alert("Payment session created successfully");
      }
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Buy Store Credits</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Choose a package and load credits to your account
        </p>

        {/* Current Balance */}
        {userId && balance && (
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-lg">
            <Wallet className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Your Balance</div>
              <div className="text-2xl font-bold text-primary">{balance.formatted}</div>
            </div>
          </div>
        )}
      </div>

      {/* Credit Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {packagesLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        ) : (
          packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${
                pkg.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <Chip color="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Chip>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-center py-4">
                  <div className="text-4xl font-bold">{pkg.formatted.price}</div>
                  <div className="text-sm text-muted-foreground mt-1">One-time payment</div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {pkg.formatted.amount} in credits
                    </span>
                  </div>

                  {pkg.bonus > 0 && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-yellow-600">
                        +{pkg.formatted.bonus} bonus credits!
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold">
                      Total: {pkg.formatted.totalCredits}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onPress={() => handlePurchase(pkg.id)}
                  isDisabled={purchaseLoading || !userId}
                  color={pkg.popular ? "primary" : "default"}
                  variant={pkg.popular ? "shadow" : "bordered"}
                >
                  {purchaseLoading ? "Processing..." : "Purchase"}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Error Display */}
      {purchaseError && (
        <div className="mt-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {purchaseError}
        </div>
      )}

      {/* Login Prompt */}
      {!userId && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Please <a href="/login" className="text-primary underline">log in</a> to purchase credits
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>How Store Credits Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Choose a Package</h3>
                <p className="text-sm text-muted-foreground">
                  Select the credit package that best fits your needs
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Complete payment through our secure Whop payment gateway
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Credits Added Instantly</h3>
                <p className="text-sm text-muted-foreground">
                  Your credits are automatically added to your account after successful payment
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shop with Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Use your credits to purchase any products in our store - no additional checkout needed!
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Credits never expire and can be used for any product in our store. Larger packages include bonus credits for better value!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

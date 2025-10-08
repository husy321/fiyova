"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function CreditPurchaseCompletePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {

    // For Whop payments, they'll redirect back with session_id
    // The webhook handles adding credits, so we just need to confirm
    if (sessionId) {
      // Give webhook a moment to process
      setTimeout(() => {
        setStatus("success");
      }, 2000);
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
            <CardTitle>Processing Your Purchase</CardTitle>
            <CardDescription>
              Please wait while we confirm your payment and add credits to your account...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-red-600">Purchase Failed</CardTitle>
            <CardDescription>
              There was an issue processing your credit purchase. No charges were made.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact support.
            </p>
            <div className="flex gap-3 justify-center">
              <Button as={Link} href="/credits" variant="bordered">
                Try Again
              </Button>
              <Button as={Link} href="/" color="primary" variant="shadow">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-green-600">Credits Added Successfully!</CardTitle>
          <CardDescription>
            Your store credits have been added to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">What&apos;s Next?</p>
            <p className="text-sm text-muted-foreground">
              You can now use your credits to purchase any products in our store. No additional checkout required!
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button as={Link} href="/products" color="primary" variant="shadow" size="lg">
              Browse Products
            </Button>
            <Button as={Link} href="/account/transactions" variant="bordered" size="lg">
              View Transaction History
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-muted-foreground">
              Transaction ID: {sessionId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

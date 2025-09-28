"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Suspense } from "react";

function CheckoutCompleteContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const status = params.get("status");
  const amount = params.get("amount");
  const currency = params.get("currency");

  const isSuccess = status === "succeeded" || status === "completed" || !status;
  const isFailed = status === "failed" || status === "cancelled";
  const isPending = status === "pending" || status === "processing";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        {isSuccess && <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />}
        {isFailed && <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />}
        {isPending && <Clock className="mx-auto h-16 w-16 text-yellow-500 mb-4" />}

        <h1 className="text-2xl font-semibold mb-2">
          {isSuccess && "Payment Successful!"}
          {isFailed && "Payment Failed"}
          {isPending && "Payment Processing"}
        </h1>

        <p className="text-foreground/70 mb-4">
          {isSuccess && "Thank you for your purchase! Your payment has been processed successfully."}
          {isFailed && "Unfortunately, your payment could not be processed. Please try again."}
          {isPending && "Your payment is being processed. You will receive an email once it's complete."}
        </p>

        {paymentId && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground/70">Payment ID: {paymentId}</p>
            {amount && currency && (
              <p className="text-sm text-foreground/70">Amount: {currency.toUpperCase()} ${(parseFloat(amount) / 100).toFixed(2)}</p>
            )}
          </div>
        )}

        {isSuccess && (
          <p className="text-sm text-foreground/70 mb-6">
            You will receive an email receipt shortly with your download links.
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <Button as={Link} href="/products" color="primary" variant="shadow">
            Browse More Products
          </Button>
          <Button as={Link} href="/" variant="flat">
            Back to Home
          </Button>
        </div>

        {isFailed && (
          <div className="mt-6">
            <Button as={Link} href="/checkout" color="primary" variant="shadow">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 animate-pulse mb-4" />
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-4" />
          </div>
        </div>
      }>
        <CheckoutCompleteContent />
      </Suspense>
      <Footer />
    </>
  );
}



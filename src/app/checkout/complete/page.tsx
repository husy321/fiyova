"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { CheckCircle, XCircle, Clock, Package, ShoppingBag } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Order } from "@/types";

function Confetti() {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 3,
    backgroundColor: [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            backgroundColor: piece.backgroundColor,
            animationDelay: `${piece.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

function CheckoutCompleteContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const statusParam = params.get("status");
  const amountParam = params.get("amount");
  const currencyParam = params.get("currency");

  const [showContent, setShowContent] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch order data from API if payment_id is available
  useEffect(() => {
    async function fetchOrderData() {
      if (paymentId) {
        try {
          const response = await fetch(`/api/orders/${paymentId}`);
          if (response.ok) {
            const data = await response.json();
            setOrderData(data);
          }
        } catch (error) {
          console.error("Failed to fetch order data:", error);
        }
      }
      setLoading(false);
    }

    fetchOrderData();
    setShowContent(true);
  }, [paymentId]);

  // Use order data from API if available, otherwise fall back to URL params
  const status = orderData?.status || statusParam;
  const amount = orderData?.amount || amountParam;
  const currency = orderData?.currency || currencyParam;
  const productName = orderData?.product_name;
  const customerEmail = orderData?.customer_email;

  // Default to success if we're on the complete page and have order data or payment_id
  // This handles cases where status might not be explicitly set
  const isSuccess = status === "succeeded" || status === "completed" || (!status && (orderData || paymentId));
  const isFailed = status === "failed" || status === "cancelled";
  const isPending = status === "pending" || status === "processing";

  // Show loading state
  if (loading && paymentId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isSuccess && <Confetti />}

      <div className="mx-auto max-w-2xl px-4 py-16 min-h-[70vh] flex items-center justify-center">
        <div className={`w-full text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Success State */}
          {isSuccess && (
            <>
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-6 shadow-2xl animate-bounce-slow">
                  <CheckCircle className="h-20 w-20 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Order Successful!
              </h1>

              <p className="text-lg text-foreground/80 mb-8 max-w-md mx-auto">
                Thank you for your purchase! Your order has been confirmed and is being processed.
              </p>

              {paymentId && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800 shadow-lg">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">Order Details</p>
                  </div>
                  {productName && (
                    <p className="text-lg font-semibold text-foreground mb-3">{productName}</p>
                  )}
                  <p className="text-sm text-foreground/70 mb-2">Order ID: <span className="font-mono font-semibold">{paymentId}</span></p>
                  {customerEmail && (
                    <p className="text-sm text-foreground/70 mb-2">Email: <span className="font-semibold">{customerEmail}</span></p>
                  )}
                  {amount && currency && (
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-3">
                      {currency.toUpperCase()} ${(parseFloat(String(amount)) / 100).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 mb-8 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-foreground/70 flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  You will receive an email confirmation with your order details and download links shortly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  href="/products"
                  color="primary"
                  size="lg"
                  variant="shadow"
                  className="font-semibold"
                >
                  Continue Shopping
                </Button>
                <Button
                  as={Link}
                  href="/"
                  variant="bordered"
                  size="lg"
                  className="font-semibold"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}

          {/* Failed State */}
          {isFailed && (
            <>
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-6 shadow-2xl">
                  <XCircle className="h-20 w-20 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent">
                Payment Failed
              </h1>

              <p className="text-lg text-foreground/80 mb-8 max-w-md mx-auto">
                Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
              </p>

              {paymentId && (
                <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-6 mb-8 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-foreground/70">Transaction ID: <span className="font-mono">{paymentId}</span></p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  href="/products"
                  color="primary"
                  size="lg"
                  variant="shadow"
                  className="font-semibold"
                >
                  Try Again
                </Button>
                <Button
                  as={Link}
                  href="/"
                  variant="bordered"
                  size="lg"
                  className="font-semibold"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}

          {/* Pending State */}
          {isPending && (
            <>
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6 shadow-2xl animate-pulse">
                  <Clock className="h-20 w-20 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Payment Processing
              </h1>

              <p className="text-lg text-foreground/80 mb-8 max-w-md mx-auto">
                Your payment is being processed. You will receive an email confirmation once it&apos;s complete.
              </p>

              {paymentId && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-2xl p-6 mb-8 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-foreground/70">Transaction ID: <span className="font-mono">{paymentId}</span></p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  href="/products"
                  color="primary"
                  size="lg"
                  variant="shadow"
                  className="font-semibold"
                >
                  Continue Shopping
                </Button>
                <Button
                  as={Link}
                  href="/"
                  variant="bordered"
                  size="lg"
                  className="font-semibold"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}

          {/* Default/Unknown State - Show success by default if on complete page */}
          {!isSuccess && !isFailed && !isPending && (
            <>
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-6 shadow-2xl animate-bounce-slow">
                  <CheckCircle className="h-20 w-20 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Order Complete
              </h1>

              <p className="text-lg text-foreground/80 mb-8 max-w-md mx-auto">
                Thank you for your purchase! If you have any questions, please contact our support team.
              </p>

              {paymentId && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800 shadow-lg">
                  <p className="text-sm text-foreground/70">Order ID: <span className="font-mono font-semibold">{paymentId}</span></p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  href="/products"
                  color="primary"
                  size="lg"
                  variant="shadow"
                  className="font-semibold"
                >
                  Continue Shopping
                </Button>
                <Button
                  as={Link}
                  href="/"
                  variant="bordered"
                  size="lg"
                  className="font-semibold"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
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



"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useCredits } from "@/hooks/useCredits";
import { Wallet, Loader2 } from "lucide-react";
import Link from "next/link";

interface ProductBuyWithCreditsProps {
  productId: string;
  productName: string;
  price: number; // in cents
  onSuccess?: () => void;
}

export function ProductBuyWithCredits({
  productId,
  productName,
  price,
  onSuccess,
}: ProductBuyWithCreditsProps) {
  const [userId, setUserId] = useState<string>("");
  const [purchasing, setPurchasing] = useState(false);
  const { balance, refetch } = useCredits(userId);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.email);
    }
  }, []);

  const handlePurchase = async () => {
    if (!userId) {
      alert("Please log in to purchase");
      return;
    }

    if (!balance || balance.amount < price) {
      alert("Insufficient credits. Please purchase more credits first.");
      return;
    }

    setPurchasing(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: [
            {
              productId,
              productName,
              quantity: 1,
              pricePerUnit: price,
              total: price,
            },
          ],
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create order");
      }

      // Refresh balance
      await refetch();

      // Show success message
      alert(`Successfully purchased ${productName}!`);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const hasEnoughCredits = balance && balance.amount >= price;

  if (!userId) {
    return (
      <Button as={Link} href="/login" color="primary" variant="shadow" size="sm">
        Login to Buy
      </Button>
    );
  }

  if (!balance) {
    return (
      <Button color="primary" variant="shadow" size="sm" isDisabled>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (!hasEnoughCredits) {
    return (
      <Button as={Link} href="/credits" color="warning" variant="shadow" size="sm">
        <Wallet className="w-4 h-4 mr-2" />
        Buy Credits
      </Button>
    );
  }

  return (
    <Button
      onPress={handlePurchase}
      color="primary"
      variant="shadow"
      size="sm"
      isLoading={purchasing}
      isDisabled={purchasing}
    >
      <Wallet className="w-4 h-4 mr-2" />
      Buy with Credits
    </Button>
  );
}

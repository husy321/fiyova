"use client";

import { useState, useEffect } from "react";

interface CreditBalance {
  amount: number;
  formatted: string;
  currency: string;
  lastUpdated: string;
}

interface CreditPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  bonus: number;
  totalCredits: number;
  description?: string;
  whopPlanId: string;
  popular: boolean;
  formatted: {
    amount: string;
    price: string;
    bonus: string | null;
    totalCredits: string;
  };
}

export function useCredits(userId?: string) {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/credits/balance?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setBalance(data.balance);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to fetch credit balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { balance, loading, error, refetch: fetchBalance };
}

export function useCreditPackages() {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/credits/packages");
        const data = await response.json();

        if (data.success) {
          setPackages(data.packages);
        } else {
          setError(data.error);
        }
      } catch {
        setError("Failed to fetch credit packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, loading, error };
}

export function usePurchaseCredits() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseCredits = async (
    packageId: string,
    userId: string,
    userEmail: string,
    userName: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId,
          userId,
          userEmail,
          userName,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create credit purchase");
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { purchaseCredits, loading, error };
}

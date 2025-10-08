"use client";

import { useEffect, useState } from "react";
import { useCredits } from "@/hooks/useCredits";
import { Wallet } from "lucide-react";
import Link from "next/link";

export function CreditBalanceBadge() {
  const [userId, setUserId] = useState<string>("");
  const { balance } = useCredits(userId);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.email);
    }
  }, []);

  if (!userId || !balance) {
    return null;
  }

  return (
    <Link
      href="/credits"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
    >
      <Wallet className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold text-primary">{balance.formatted}</span>
    </Link>
  );
}

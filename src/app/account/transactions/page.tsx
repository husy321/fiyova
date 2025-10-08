"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@heroui/react";
import { Loader2, TrendingUp, TrendingDown, RefreshCcw, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";

interface Transaction {
  id: string;
  type: "purchase" | "debit" | "refund" | "admin_adjustment";
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  formatted: {
    amount: string;
    balanceAfter: string;
    date: string;
    time: string;
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [balance, setBalance] = useState<string>("$0.00");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.email);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const txnResponse = await fetch(`/api/credits/transactions?userId=${userId}`);
        const txnData = await txnResponse.json();

        if (txnData.success) {
          setTransactions(txnData.transactions);
        }

        // Fetch current balance
        const balanceResponse = await fetch(`/api/credits/balance?userId=${userId}`);
        const balanceData = await balanceResponse.json();

        if (balanceData.success) {
          setBalance(balanceData.balance.formatted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "debit":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "refund":
        return <RefreshCcw className="h-5 w-5 text-blue-500" />;
      case "admin_adjustment":
        return <Settings className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTransactionChipColor = (type: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    switch (type) {
      case "purchase":
        return "success";
      case "debit":
        return "danger";
      case "refund":
        return "primary";
      case "admin_adjustment":
        return "warning";
      default:
        return "default";
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="mb-6 text-muted-foreground">You need to be logged in to view your transactions</p>
        <Button as={Link} href="/login" color="primary" variant="shadow">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">View all your credit transactions</p>
      </div>

      {/* Current Balance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available store credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-primary">{balance}</div>
            <Button as={Link} href="/credits" color="primary" variant="shadow">
              Buy More Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete history of your credit activity</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Button as={Link} href="/credits" color="primary" variant="shadow">
                Purchase Your First Credits
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Left side - Icon and Description */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(txn.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold truncate">{txn.description}</p>
                        <Chip color={getTransactionChipColor(txn.type)} size="sm">
                          {txn.type}
                        </Chip>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {txn.formatted.date} at {txn.formatted.time}
                      </p>
                      {txn.metadata?.orderId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Order ID: {txn.metadata.orderId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side - Amount and Balance */}
                  <div className="text-right flex-shrink-0 ml-4">
                    <p
                      className={`text-lg font-bold ${
                        txn.amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {txn.formatted.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Balance: {txn.formatted.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

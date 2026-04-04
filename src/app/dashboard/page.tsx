"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Chip, Tabs, Tab } from "@heroui/react";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Copy,
  Download,
  DollarSign,
  Check,
  Key,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Footer } from "@/components/site/sections";
import { useAuth } from "@/contexts/auth-context";
import type { Order } from "@/types";

interface Purchase {
  payment_id: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  download_url: string | null;
  license_key: string | null;
}

interface DashboardPurchase extends Purchase {
  resolved_download_url: string | null;
}

function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-default-200/70 bg-background/80 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <Surface className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-foreground/60">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={18} />
        </div>
      </div>
    </Surface>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Surface className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-default-100 text-foreground/55">
        <Icon size={24} />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">{description}</p>
      <Button as={Link} href="/products" color="primary" variant="shadow" className="mt-6">
        Browse products
      </Button>
    </Surface>
  );
}

function LoadingCard() {
  return (
    <Surface className="animate-pulse p-6">
      <div className="h-4 w-40 rounded-full bg-default-200" />
      <div className="mt-4 h-3 w-28 rounded-full bg-default-100" />
      <div className="mt-2 h-3 w-20 rounded-full bg-default-100" />
    </Surface>
  );
}

function PurchaseCard({
  purchase,
  copiedKey,
  onCopy,
}: {
  purchase: DashboardPurchase;
  copiedKey: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const isCompleted = purchase.status === "succeeded" || purchase.status === "completed";
  const statusColor =
    isCompleted ? "success" : purchase.status === "pending" || purchase.status === "processing" ? "warning" : "danger";

  return (
    <Surface className="p-6 transition-colors duration-200 hover:border-default-300">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="truncate text-lg font-semibold tracking-tight">{purchase.product_name}</h3>
            <Chip color={statusColor} size="sm" variant="flat" className="capitalize">
              {purchase.status}
            </Chip>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/60">
            <span className="font-medium text-foreground">
              {purchase.currency.toUpperCase()} ${(purchase.amount / 100).toFixed(2)}
            </span>
            <span>{new Date(purchase.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            <span className="font-mono text-xs uppercase tracking-wide">#{purchase.payment_id.slice(-10)}</span>
          </div>

          {purchase.license_key ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <Key size={14} />
                <code className="text-xs font-medium">{purchase.license_key}</code>
              </div>
              <Button
                size="sm"
                variant="flat"
                color="warning"
                isIconOnly
                onClick={() => onCopy(purchase.license_key!, purchase.payment_id)}
                aria-label="Copy license key"
              >
                {copiedKey === purchase.payment_id ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="shrink-0">
          {purchase.resolved_download_url ? (
            <Button
              as="a"
              href={purchase.resolved_download_url}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              variant="shadow"
              startContent={<Download size={16} />}
            >
              Download
            </Button>
          ) : isCompleted ? (
            <Chip color="success" variant="flat" startContent={<Check size={12} />}>
              Delivered by email
            </Chip>
          ) : null}
        </div>
      </div>
    </Surface>
  );
}

function OrderCard({ order }: { order: Order }) {
  const statusColor =
    order.status === "completed" ? "success" : order.status === "pending" ? "warning" : "danger";

  return (
    <Surface className="p-6 transition-colors duration-200 hover:border-default-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="truncate text-lg font-semibold tracking-tight">{order.product_name}</h3>
            <Chip color={statusColor} size="sm" variant="flat" className="capitalize">
              {order.status}
            </Chip>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/60">
            <span className="font-mono text-xs uppercase tracking-wide">#{order.id.slice(-10)}</span>
            <span className="font-medium text-foreground">${(order.amount / 100).toFixed(2)}</span>
            <span>{new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
          </div>
        </div>

        {order.status === "completed" && order.download_url ? (
          <Button
            as="a"
            href={order.download_url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="flat"
            startContent={<Download size={16} />}
          >
            Download
          </Button>
        ) : null}
      </div>
    </Surface>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [purchasesError, setPurchasesError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoadingOrders(true);
      setOrdersError(null);
      const res = await fetch(`/api/orders?customer_email=${encodeURIComponent(user.email)}&limit=50&page=1`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.email]);

  const fetchPurchases = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoadingPurchases(true);
      setPurchasesError(null);
      const res = await fetch(`/api/purchases?email=${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setPurchases(data.purchases || []);
    } catch (error) {
      setPurchasesError(error instanceof Error ? error.message : "Failed to load purchases");
      setPurchases([]);
    } finally {
      setLoadingPurchases(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchOrders();
      fetchPurchases();
    }
  }, [user, isLoading, router, fetchOrders, fetchPurchases]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            <p className="mt-3 text-sm text-foreground/55">Loading your workspace...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";
  const completedPurchases = purchases.filter((purchase) => purchase.status === "succeeded" || purchase.status === "completed");
  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const purchasesWithDownloads: DashboardPurchase[] = purchases.map((purchase) => {
    const matchingOrder = orders.find((order) => order.payment_id === purchase.payment_id || order.id === purchase.payment_id);
    return {
      ...purchase,
      resolved_download_url: purchase.download_url ?? matchingOrder?.download_url ?? null,
    };
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.12),transparent_55%)]" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button as={Link} href="/" variant="flat" startContent={<ArrowLeft size={16} />}>
              Back to home
            </Button>
          </div>
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
            <Surface className="relative overflow-hidden p-7 sm:p-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/75">Dashboard</p>
              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {firstName}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65 sm:text-base">
                Track your purchases, access downloads, and keep your account details in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  color="primary"
                  variant="shadow"
                  startContent={<RefreshCw size={16} />}
                  onClick={() => {
                    fetchOrders();
                    fetchPurchases();
                  }}
                >
                  Refresh data
                </Button>
                <Button as={Link} href="/products" variant="flat" endContent={<ArrowRight size={16} />}>
                  Explore products
                </Button>
              </div>
            </Surface>

            <Surface className="p-6 sm:p-7">
              <p className="text-sm font-medium text-foreground/55">Account</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Name</p>
                  <p className="mt-1 text-base font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Email</p>
                  <p className="mt-1 break-all text-sm text-foreground/70">{user.email}</p>
                </div>
                <div className="rounded-2xl bg-default-100 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Access</p>
                  <p className="mt-2 text-sm text-foreground/65">
                    Downloads appear here after successful purchases. License keys are shown only when a product requires one.
                  </p>
                </div>
              </div>
            </Surface>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Package} label="Total orders" value={orders.length} tone="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300" />
            <StatCard
              icon={DollarSign}
              label="Total spent"
              value={`$${(totalSpent / 100).toFixed(2)}`}
              tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            />
            <StatCard
              icon={Download}
              label="Ready downloads"
              value={completedPurchases.length}
              tone="bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
            />
            <StatCard
              icon={Calendar}
              label="Pending orders"
              value={pendingOrders}
              tone="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
            />
          </section>

          <section className="mt-8">
            <Tabs
              aria-label="Dashboard tabs"
              color="primary"
              variant="underlined"
              size="lg"
              classNames={{
                tabList: "gap-6 border-b border-default-200 px-1",
                cursor: "bg-primary",
                tab: "px-0 h-12",
                tabContent: "text-sm font-medium group-data-[selected=true]:text-foreground",
              }}
            >
              <Tab
                key="purchases"
                title={
                  <div className="flex items-center gap-2">
                    <Download size={16} />
                    <span>Purchases</span>
                    {completedPurchases.length > 0 ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {completedPurchases.length}
                      </span>
                    ) : null}
                  </div>
                }
              >
                <div className="mt-6 space-y-4">
                  {loadingPurchases ? (
                    [1, 2, 3].map((item) => <LoadingCard key={item} />)
                  ) : purchasesError ? (
                    <Surface className="px-6 py-14 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                        <Package size={24} />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">Failed to load purchases</h3>
                      <p className="mt-2 text-sm text-foreground/60">{purchasesError}</p>
                      <Button onClick={fetchPurchases} color="danger" variant="flat" className="mt-6">
                        Retry
                      </Button>
                    </Surface>
                  ) : purchasesWithDownloads.length === 0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No purchases yet"
                      description="Once you buy a product, your downloads and license details will show up here."
                    />
                  ) : (
                    purchasesWithDownloads.map((purchase) => (
                      <PurchaseCard
                        key={purchase.payment_id}
                        purchase={purchase}
                        copiedKey={copiedKey}
                        onCopy={copyToClipboard}
                      />
                    ))
                  )}
                </div>
              </Tab>

              <Tab
                key="orders"
                title={
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Order history</span>
                  </div>
                }
              >
                <div className="mt-6 space-y-4">
                  {loadingOrders ? (
                    [1, 2, 3].map((item) => <LoadingCard key={item} />)
                  ) : ordersError ? (
                    <Surface className="px-6 py-14 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                        <Package size={24} />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">Failed to load orders</h3>
                      <p className="mt-2 text-sm text-foreground/60">{ordersError}</p>
                      <Button onClick={fetchOrders} color="danger" variant="flat" className="mt-6">
                        Retry
                      </Button>
                    </Surface>
                  ) : orders.length === 0 ? (
                    <EmptyState
                      icon={Package}
                      title="No orders yet"
                      description="Your completed and pending orders will appear here once you place them."
                    />
                  ) : (
                    orders.map((order) => <OrderCard key={order.id} order={order} />)
                  )}
                </div>
              </Tab>
            </Tabs>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

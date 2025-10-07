"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/sections";
import { useAuth } from "@/contexts/auth-context";
import { Package, Calendar, DollarSign, Download } from "lucide-react";
import { Order } from "@/types";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoadingOrders(true);
      setOrdersError(null);

      const response = await fetch(`/api/orders?customer_email=${encodeURIComponent(user.email)}&limit=50&page=1`);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrdersError(error instanceof Error ? error.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, isLoading, router, fetchOrders]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed": return "success";
      case "pending": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-default-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-foreground/70">
              Manage your orders and downloads
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Stats Cards */}
            <Card>
              <CardBody className="text-center p-6">
                <Package className="mx-auto mb-2 text-primary" size={24} />
                <p className="text-2xl font-semibold">{orders.length}</p>
                <p className="text-sm text-default-500">Total Orders</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-6">
                <DollarSign className="mx-auto mb-2 text-success" size={24} />
                <p className="text-2xl font-semibold">
                  ${(orders.reduce((sum, order) => sum + order.amount, 0) / 100).toFixed(2)}
                </p>
                <p className="text-sm text-default-500">Total Spent</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-6">
                <Download className="mx-auto mb-2 text-secondary" size={24} />
                <p className="text-2xl font-semibold">
                  {orders.filter(o => o.status === "completed").length}
                </p>
                <p className="text-sm text-default-500">Available Downloads</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center p-6">
                <Calendar className="mx-auto mb-2 text-warning" size={24} />
                <p className="text-2xl font-semibold">
                  {orders.filter(o => o.status === "pending").length}
                </p>
                <p className="text-sm text-default-500">Pending Orders</p>
              </CardBody>
            </Card>
          </div>

          {/* Order History */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Order History</h2>
            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardBody className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-default-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-default-200 rounded w-1/6 mb-4"></div>
                        <div className="h-3 bg-default-200 rounded w-1/8"></div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : ordersError ? (
              <Card>
                <CardBody className="text-center p-12">
                  <Package className="mx-auto mb-4 text-danger" size={48} />
                  <h3 className="text-lg font-medium mb-2">Failed to load orders</h3>
                  <p className="text-default-500 mb-4">{ordersError}</p>
                  <Button onClick={fetchOrders} color="primary" variant="flat">
                    Try Again
                  </Button>
                </CardBody>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardBody className="text-center p-12">
                  <Package className="mx-auto mb-4 text-default-300" size={48} />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-default-500 mb-4">Start shopping to see your orders here</p>
                  <Button as="a" href="/products" color="primary">
                    Browse Products
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardBody className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{order.product_name}</h3>
                            <Chip
                              color={getStatusColor(order.status)}
                              size="sm"
                              variant="flat"
                            >
                              {order.status}
                            </Chip>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-default-500">
                            <span>Order #{order.id}</span>
                            <span>${(order.amount / 100).toFixed(2)}</span>
                            <span>{formatDate(order.date)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.status === "completed" && order.download_url && (
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              startContent={<Download size={16} />}
                            >
                              Download
                            </Button>
                          )}
                          <Button size="sm" variant="light">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
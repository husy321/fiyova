// Store Credit System Types

export interface CreditBalance {
  userId: string;
  balance: number; // in cents
  currency: string;
  lastUpdated: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: "purchase" | "debit" | "refund" | "admin_adjustment";
  amount: number; // in cents (positive for credits added, negative for credits spent)
  balance_after: number; // Balance after this transaction
  currency: string;
  description: string;
  metadata?: {
    whopSessionId?: string;
    whopPaymentId?: string;
    productId?: string;
    productName?: string;
    orderId?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}

export interface CreditPurchasePackage {
  id: string;
  name: string;
  amount: number; // Credit amount in cents
  price: number; // Price in cents
  bonus?: number; // Bonus credits in cents
  description?: string;
  whopPlanId: string; // Whop plan ID for this package
  popular?: boolean;
  enabled: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number; // in cents
  paymentMethod: "credits";
  status: "pending" | "completed" | "cancelled" | "refunded";
  createdAt: string;
  completedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number; // in cents
  total: number; // in cents
}

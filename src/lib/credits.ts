// Store Credit Management Service
import fs from "fs";
import path from "path";
import {
  CreditBalance,
  CreditTransaction,
  Order,
  CreditPurchasePackage,
} from "@/types/credits";

const CREDIT_BALANCES_FILE = path.join(process.cwd(), "data", "credit-balances.json");
const CREDIT_TRANSACTIONS_FILE = path.join(process.cwd(), "data", "credit-transactions.json");
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize files if they don't exist
const initializeFile = (filePath: string, defaultContent: any = []) => {
  ensureDataDirectory();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  }
};

// Read data from file
const readData = <T>(filePath: string): T[] => {
  initializeFile(filePath);
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Write data to file
const writeData = <T>(filePath: string, data: T[]) => {
  ensureDataDirectory();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

interface TransactionMetadata {
  [key: string]: unknown;
}

// Credit Balance Operations
export const getCreditBalance = (userId: string): CreditBalance => {
  const balances = readData<CreditBalance>(CREDIT_BALANCES_FILE);
  const userBalance = balances.find((b) => b.userId === userId);

  if (!userBalance) {
    // Create new balance record
    const newBalance: CreditBalance = {
      userId,
      balance: 0,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
    };
    balances.push(newBalance);
    writeData(CREDIT_BALANCES_FILE, balances);
    return newBalance;
  }

  return userBalance;
};

// Add credits to user account
export const addCredits = (
  userId: string,
  amount: number,
  description: string,
  metadata?: TransactionMetadata
): CreditTransaction => {
  const balances = readData<CreditBalance>(CREDIT_BALANCES_FILE);
  const transactions = readData<CreditTransaction>(CREDIT_TRANSACTIONS_FILE);

  // Find or create user balance
  let userBalance = balances.find((b) => b.userId === userId);
  if (!userBalance) {
    userBalance = {
      userId,
      balance: 0,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
    };
    balances.push(userBalance);
  }

  // Update balance
  userBalance.balance += amount;
  userBalance.lastUpdated = new Date().toISOString();

  // Create transaction record
  const transaction: CreditTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: "purchase",
    amount,
    balance_after: userBalance.balance,
    currency: "USD",
    description,
    metadata,
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);

  // Save data
  writeData(CREDIT_BALANCES_FILE, balances);
  writeData(CREDIT_TRANSACTIONS_FILE, transactions);

  return transaction;
};

// Deduct credits from user account
export const deductCredits = (
  userId: string,
  amount: number,
  description: string,
  metadata?: TransactionMetadata
): { success: boolean; transaction?: CreditTransaction; error?: string } => {
  const balances = readData<CreditBalance>(CREDIT_BALANCES_FILE);
  const transactions = readData<CreditTransaction>(CREDIT_TRANSACTIONS_FILE);

  const userBalance = balances.find((b) => b.userId === userId);

  if (!userBalance) {
    return { success: false, error: "User balance not found" };
  }

  if (userBalance.balance < amount) {
    return { success: false, error: "Insufficient credits" };
  }

  // Update balance
  userBalance.balance -= amount;
  userBalance.lastUpdated = new Date().toISOString();

  // Create transaction record
  const transaction: CreditTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: "debit",
    amount: -amount, // Negative for deduction
    balance_after: userBalance.balance,
    currency: "USD",
    description,
    metadata,
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);

  // Save data
  writeData(CREDIT_BALANCES_FILE, balances);
  writeData(CREDIT_TRANSACTIONS_FILE, transactions);

  return { success: true, transaction };
};

// Get user's transaction history
export const getTransactionHistory = (
  userId: string,
  limit?: number
): CreditTransaction[] => {
  const transactions = readData<CreditTransaction>(CREDIT_TRANSACTIONS_FILE);
  const userTransactions = transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return limit ? userTransactions.slice(0, limit) : userTransactions;
};

// Refund credits
export const refundCredits = (
  userId: string,
  amount: number,
  description: string,
  metadata?: TransactionMetadata
): CreditTransaction => {
  const balances = readData<CreditBalance>(CREDIT_BALANCES_FILE);
  const transactions = readData<CreditTransaction>(CREDIT_TRANSACTIONS_FILE);

  let userBalance = balances.find((b) => b.userId === userId);
  if (!userBalance) {
    userBalance = {
      userId,
      balance: 0,
      currency: "USD",
      lastUpdated: new Date().toISOString(),
    };
    balances.push(userBalance);
  }

  userBalance.balance += amount;
  userBalance.lastUpdated = new Date().toISOString();

  const transaction: CreditTransaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: "refund",
    amount,
    balance_after: userBalance.balance,
    currency: "USD",
    description,
    metadata,
    createdAt: new Date().toISOString(),
  };

  transactions.push(transaction);

  writeData(CREDIT_BALANCES_FILE, balances);
  writeData(CREDIT_TRANSACTIONS_FILE, transactions);

  return transaction;
};

// Order Operations
export const createOrder = (
  userId: string,
  items: Order["items"]
): Order => {
  const orders = readData<Order>(ORDERS_FILE);

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const order: Order = {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    items,
    total,
    paymentMethod: "credits",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  writeData(ORDERS_FILE, orders);

  return order;
};

export const completeOrder = (orderId: string): Order | null => {
  const orders = readData<Order>(ORDERS_FILE);
  const order = orders.find((o) => o.id === orderId);

  if (!order) return null;

  order.status = "completed";
  order.completedAt = new Date().toISOString();

  writeData(ORDERS_FILE, orders);
  return order;
};

export const getUserOrders = (userId: string): Order[] => {
  const orders = readData<Order>(ORDERS_FILE);
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Credit Purchase Packages
// TODO: Replace whopPlanId values with actual Whop plan IDs from your dashboard
export const CREDIT_PACKAGES: CreditPurchasePackage[] = [
  {
    id: "pkg_10",
    name: "$10 Credits",
    amount: 1000, // $10.00 in credits
    price: 1000, // $10.00 price
    description: "Perfect for getting started",
    whopPlanId: "plan_REPLACE_WITH_YOUR_10_DOLLAR_PLAN_ID", // ← Replace this
    enabled: true,
  },
  {
    id: "pkg_25",
    name: "$25 Credits",
    amount: 2500, // $25.00 in credits
    price: 2500, // $25.00 price
    description: "Popular choice for regular shoppers",
    whopPlanId: "plan_REPLACE_WITH_YOUR_25_DOLLAR_PLAN_ID", // ← Replace this
    popular: true,
    enabled: true,
  },
  {
    id: "pkg_50",
    name: "$50 Credits",
    amount: 5000, // $50.00 in credits
    price: 5000, // $50.00 price
    bonus: 500, // $5.00 bonus - 10% extra
    description: "Great value - get 10% bonus!",
    whopPlanId: "plan_REPLACE_WITH_YOUR_50_DOLLAR_PLAN_ID", // ← Replace this
    enabled: true,
  },
  {
    id: "pkg_100",
    name: "$100 Credits",
    amount: 10000, // $100.00 in credits
    price: 10000, // $100.00 price
    bonus: 2000, // $20.00 bonus - 20% extra
    description: "Best value - get 20% bonus!",
    whopPlanId: "plan_REPLACE_WITH_YOUR_100_DOLLAR_PLAN_ID", // ← Replace this
    enabled: true,
  },
];

export const getCreditPackages = (): CreditPurchasePackage[] => {
  return CREDIT_PACKAGES.filter((pkg) => pkg.enabled);
};

export const getCreditPackageById = (id: string): CreditPurchasePackage | undefined => {
  return CREDIT_PACKAGES.find((pkg) => pkg.id === id);
};

import { Order } from "@/types";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Persistent order storage for development
const ORDERS_FILE = join(process.cwd(), 'orders.json');

function loadOrders(): Order[] {
  try {
    if (existsSync(ORDERS_FILE)) {
      const data = readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
  return [];
}

function saveOrders(orders: Order[]): void {
  try {
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
}

export class OrderService {
  static createOrUpdateOrder(order: Order): Order {
    const orders = loadOrders();

    // Check if order already exists
    const existingIndex = orders.findIndex(o => o.payment_id === order.payment_id);

    if (existingIndex >= 0) {
      // Update existing order
      orders[existingIndex] = order;
    } else {
      // Add new order
      orders.push(order);
    }

    saveOrders(orders);
    return order;
  }

  static getOrdersByEmail(email: string, limit = 50, page = 1): { orders: Order[]; total: number } {
    const orders = loadOrders();

    // Filter by email
    const customerOrders = orders.filter(o => o.customer_email.toLowerCase() === email.toLowerCase());

    // Sort by date (newest first)
    customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = customerOrders.slice(start, end);

    return {
      orders: paginatedOrders,
      total: customerOrders.length
    };
  }

  static getOrderByPaymentId(paymentId: string): Order | null {
    const orders = loadOrders();
    return orders.find(o => o.payment_id === paymentId) || null;
  }

  static getAllOrders(): Order[] {
    return loadOrders();
  }

  static deleteOrder(paymentId: string): boolean {
    const orders = loadOrders();
    const filteredOrders = orders.filter(o => o.payment_id !== paymentId);

    if (filteredOrders.length < orders.length) {
      saveOrders(filteredOrders);
      return true;
    }

    return false;
  }
}

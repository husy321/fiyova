export interface Product {
  id: string;
  product_id?: string;
  name: string;
  description: string;
  price: number;
  default_price?: number;
  image?: string;
  slug?: string;
}

export interface ProductsApiResponse {
  products: Product[];
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role?: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token?: string;
}

export interface PaymentRequest {
  product_id: string;
  customer_email: string;
  customer_name?: string;
  billing: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface PaymentResponse {
  payment_link_url?: string;
  payment_link?: string;
  checkout_url?: string;
  url?: string;
  link?: string;
}

export interface PaymentCreateParams {
  payment_link: boolean;
  product_cart: Array<{ product_id: string; quantity: number }>;
  customer?: { email: string; name?: string };
  redirect_url?: string;
  billing: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  };
}

export interface Order {
  id: string;
  product_name: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  customer_email: string;
  payment_id: string;
  currency: string;
  items?: Record<string, unknown>[];
  download_url?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
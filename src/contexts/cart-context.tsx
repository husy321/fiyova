"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to safely access localStorage
function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

// Helper function to safely set localStorage
function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedCart = getLocalStorageItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate that parsedCart is an array
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        } else {
          console.warn("Invalid cart data in localStorage, resetting cart");
          setLocalStorageItem("cart", JSON.stringify([]));
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Clear corrupted cart data
      try {
        setLocalStorageItem("cart", JSON.stringify([]));
      } catch (clearError) {
        console.error("Error clearing corrupted cart:", clearError);
      }
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Don't save until we've loaded initial state
    
    try {
      setLocalStorageItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product) => {
    if (!product) {
      console.error("Cannot add null or undefined product to cart");
      return;
    }

    const productId = product.product_id || product.id;
    if (!productId) {
      console.error("Product missing ID, cannot add to cart:", product);
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => {
          const itemId = item.product.product_id || item.product.id;
          return itemId === productId;
        }
      );

      if (existingItem) {
        // Digital products are typically one-time purchases, so we don't increase quantity
        // Just show a message or update timestamp instead
        return currentItems;
      } else {
        return [...currentItems, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    if (!productId) {
      console.error("Cannot remove item: productId is required");
      return;
    }

    setItems(currentItems =>
      currentItems.filter(item => {
        const itemId = item.product.product_id || item.product.id;
        return itemId !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!productId) {
      console.error("Cannot update quantity: productId is required");
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        const itemId = item.product.product_id || item.product.id;
        return itemId === productId
          ? { ...item, quantity }
          : item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    if (!isLoaded || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
      if (!item || !item.product) return total;
      const price = item.product.price || item.product.default_price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    if (!isLoaded || !Array.isArray(items)) return 0;
    
    return items.reduce((count, item) => {
      if (!item) return count;
      return count + (item.quantity || 1);
    }, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isLoaded,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
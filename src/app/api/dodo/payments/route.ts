import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";
import { PaymentCreateParams } from "@/types";

export async function POST(request: Request) {
  try {
    const { product_id, quantity = 1, product_cart, customer, redirect_url, billing } = await request.json();

    // Handle both single product and multiple products (cart)
    let finalProductCart;
    if (product_cart) {
      // Multiple products from cart
      console.log("Creating payment for cart with", product_cart.length, "items:", product_cart);
      finalProductCart = product_cart;
    } else if (product_id) {
      // Single product
      console.log("Creating payment for single product_id:", product_id);
      finalProductCart = [{ product_id, quantity }];
    } else {
      return NextResponse.json({ error: "Missing product_id or product_cart" }, { status: 400 });
    }

    // Use provided billing info or defaults
    const billingAddress = billing || {
      city: "Unknown",
      country: "US",
      state: "Unknown",
      street: "Unknown",
      zipcode: "00000"
    };

    console.log("API Key length:", process.env.DODO_PAYMENTS_API_KEY?.length);
    console.log("Billing address:", billingAddress);
    
    // Try SDK first, fallback to REST
    try {
      const client = getDodoClient();
      console.log("Client created, attempting payment creation with SDK...");
      
      const paymentParams: PaymentCreateParams = {
        payment_link: true,
        product_cart: finalProductCart,
        customer,
        redirect_url: redirect_url || `${process.env.DODO_REDIRECT_URL}?payment_id={payment_id}&status={status}&amount={amount}&currency={currency}`,
        billing: billingAddress
      };

      // Use checkoutSessions.create as per Dodo SDK documentation
      const checkoutSession = await client.checkoutSessions.create({
        product_cart: finalProductCart,
        customer,
        return_url: redirect_url || `${process.env.DODO_REDIRECT_URL}?payment_id={payment_id}&status={status}&amount={amount}&currency={currency}`,
        billing_address: billingAddress
      });

      console.log("Checkout session created successfully with SDK:", checkoutSession);
      return NextResponse.json({ payment: checkoutSession }, { status: 200 });
    } catch (sdkError) {
      console.log("SDK failed, trying REST API:", sdkError);
      
      // Fallback to REST API
      const mode = process.env.DODO_MODE === "live" ? "live" : "test";
      const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");
      
      const paymentData = {
        product_cart: finalProductCart,
        customer,
        return_url: redirect_url || `${process.env.DODO_REDIRECT_URL}?payment_id={payment_id}&status={status}&amount={amount}&currency={currency}`,
        billing_address: billingAddress
      };
      
      console.log("REST checkout session data:", paymentData);
      console.log("REST URL:", `${base}/checkout-sessions`);

      const res = await fetch(`${base}/checkout-sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      console.log("REST response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        console.log("REST error response:", text);
        return NextResponse.json({ error: `Checkout session creation failed: ${res.status} ${text}` }, { status: 500 });
      }
      
      const checkoutSession = await res.json();
      console.log("Checkout session created successfully with REST:", checkoutSession);
      console.log("Checkout session keys:", Object.keys(checkoutSession));
      return NextResponse.json({ payment: checkoutSession }, { status: 200 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.log("Payment creation error:", message);
    console.log("Error details:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";
import { PaymentCreateParams } from "@/types";

export async function POST(request: Request) {
  try {
    const { product_id, quantity = 1, customer, redirect_url } = await request.json();
    if (!product_id) return NextResponse.json({ error: "Missing product_id" }, { status: 400 });

    console.log("Creating payment for product_id:", product_id);
    console.log("API Key length:", process.env.DODO_PAYMENTS_API_KEY?.length);
    
    // Try SDK first, fallback to REST
    try {
      const client = getDodoClient();
      console.log("Client created, attempting payment creation with SDK...");
      
      const paymentParams: PaymentCreateParams = {
        payment_link: true,
        product_cart: [{ product_id, quantity }],
        customer,
        redirect_url: redirect_url || `${process.env.DODO_REDIRECT_URL}?payment_id={payment_id}&status={status}&amount={amount}&currency={currency}`,
        billing: {
          city: "Unknown",
          country: "US",
          state: "Unknown",
          street: "Unknown",
          zipcode: "00000"
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payment = await client.payments.create(paymentParams as any);

      console.log("Payment created successfully with SDK:", payment);
      return NextResponse.json({ payment }, { status: 200 });
    } catch (sdkError) {
      console.log("SDK failed, trying REST API:", sdkError);
      
      // Fallback to REST API
      const mode = process.env.DODO_MODE === "live" ? "live" : "test";
      const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");
      
      const paymentData: PaymentCreateParams = {
        payment_link: true,
        product_cart: [{ product_id, quantity }],
        customer,
        redirect_url: redirect_url || `${process.env.DODO_REDIRECT_URL}?payment_id={payment_id}&status={status}&amount={amount}&currency={currency}`,
        billing: {
          city: "Unknown",
          country: "US",
          state: "Unknown",
          street: "Unknown",
          zipcode: "00000"
        }
      };
      
      console.log("REST payment data:", paymentData);
      console.log("REST URL:", `${base}/payments`);
      
      const res = await fetch(`${base}/payments`, {
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
        return NextResponse.json({ error: `Payment creation failed: ${res.status} ${text}` }, { status: 500 });
      }
      
      const payment = await res.json();
      console.log("Payment created successfully with REST:", payment);
      console.log("Payment keys:", Object.keys(payment));
      return NextResponse.json({ payment }, { status: 200 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.log("Payment creation error:", message);
    console.log("Error details:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



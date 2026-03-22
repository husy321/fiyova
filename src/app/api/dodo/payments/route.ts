import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";

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
    console.log("Customer info:", customer);

    // Create or use customer with billing address
    let customerData = customer;

    // If customer info is provided, create customer first with billing address
    if (customer?.email && customer?.name) {
      try {
        const mode = process.env.DODO_MODE === "live" ? "live" : "test";
        const base = process.env.DODO_API_BASE || (mode === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com");

        const customerPayload = {
          email: customer.email,
          name: customer.name,
          default_billing_address: billingAddress
        };

        console.log("Creating customer with billing address:", customerPayload);

        const customerRes = await fetch(`${base}/customers`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customerPayload)
        });

        if (customerRes.ok) {
          const createdCustomer = await customerRes.json();
          console.log("Customer created successfully:", createdCustomer);
          // Use the customer_id instead of email/name
          customerData = { customer_id: createdCustomer.customer_id || createdCustomer.id };
        } else {
          console.log("Customer creation failed, continuing with inline customer data");
        }
      } catch (customerError) {
        console.log("Customer creation error, continuing with inline customer data:", customerError);
      }
    }

    // Try SDK first
    try {
      const client = getDodoClient();
      console.log("Client created, attempting payment creation with SDK...");

      // Use checkoutSessions.create as per Dodo SDK documentation
      const checkoutSession = await client.checkoutSessions.create({
        product_cart: finalProductCart,
        customer: customerData,
        return_url: redirect_url || process.env.DODO_REDIRECT_URL,
        billing_address: billingAddress,
        confirm: true,
        feature_flags: {
          allow_phone_number_collection: false,
          allow_tax_id: false
        }
      });

      console.log("Checkout session created successfully with SDK:", checkoutSession);
      return NextResponse.json({ payment: checkoutSession }, { status: 200 });
    } catch (sdkError: any) {
      console.log("SDK failed:", sdkError);
      return NextResponse.json({ error: sdkError.message || "Failed to create checkout session" }, { status: sdkError.status || 500 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.log("Payment creation error:", message);
    console.log("Error details:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



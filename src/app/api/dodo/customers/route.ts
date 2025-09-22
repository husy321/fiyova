import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";

export async function POST(request: Request) {
  try {
    const { email, name, phone_number } = await request.json();
    if (!email || !name) return NextResponse.json({ error: "Missing email or name" }, { status: 400 });

    const client = getDodoClient();
    const customer = await client.customers.create({ email, name, phone_number });
    return NextResponse.json(customer, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



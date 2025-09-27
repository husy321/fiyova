import { NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const client = getDodoClient();
    const product = await client.products.get({ product_id: params.id });
    return NextResponse.json({ product }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



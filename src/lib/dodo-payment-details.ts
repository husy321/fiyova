import { getDodoClient } from "@/lib/dodo";

interface ProductCartItem {
  product_id?: string | null;
  quantity?: number | null;
}

interface ProductFile {
  url?: string | null;
}

interface ProductResponse {
  name?: string | null;
  digital_product_delivery?: {
    external_url?: string | null;
    files?: ProductFile[] | null;
  } | null;
}

interface LineItemResponse {
  name?: string | null;
  description?: string | null;
}

interface PaymentLike {
  payment_id?: string | null;
  product_cart?: ProductCartItem[] | null;
}

function getDownloadUrlFromProduct(product: ProductResponse | null | undefined): string | undefined {
  if (!product?.digital_product_delivery) return undefined;

  return (
    product.digital_product_delivery.external_url ??
    product.digital_product_delivery.files?.find((file) => Boolean(file?.url))?.url ??
    undefined
  );
}

export async function resolvePaymentDetails(payment: PaymentLike) {
  const client = getDodoClient();
  const paymentId = payment.payment_id ?? "";
  const productIds = (payment.product_cart ?? [])
    .map((item) => item.product_id ?? undefined)
    .filter((value): value is string => Boolean(value));

  const [lineItemsResult, products] = await Promise.all([
    paymentId
      ? client.payments
          .retrieveLineItems(paymentId)
          .then((response) => response.items ?? [])
          .catch(() => [] as LineItemResponse[])
      : Promise.resolve([] as LineItemResponse[]),
    productIds.length > 0
      ? Promise.all(
          productIds.map((productId) =>
            client.products
              .retrieve(productId)
              .then((product) => product as ProductResponse)
              .catch(() => null),
          ),
        )
      : Promise.resolve([] as Array<ProductResponse | null>),
  ]);

  const lineItemNames = lineItemsResult
    .map((item) => item.name?.trim() || item.description?.trim() || "")
    .filter(Boolean);

  const productNames = products.map((product) => product?.name?.trim() || "").filter(Boolean);

  const productName =
    lineItemNames.join(", ") ||
    productNames.join(", ") ||
    "Digital Product";

  const downloadUrl = products.map((product) => getDownloadUrlFromProduct(product)).find(Boolean) ?? undefined;

  const items = lineItemsResult.map((item) => ({
    name: item.name ?? undefined,
    description: item.description ?? undefined,
  }));

  return {
    productName,
    downloadUrl,
    items,
  };
}

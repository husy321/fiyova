export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildSlugMap(products: Array<any>) {
  const slugToId = new Map<string, string>();
  const idToSlug = new Map<string, string>();
  for (const p of products) {
    const id = p.product_id || p.id;
    const base = p.slug || p.name || id;
    const slug = toSlug(String(base));
    if (id) {
      slugToId.set(slug, id);
      idToSlug.set(id, slug);
    }
  }
  return { slugToId, idToSlug };
}



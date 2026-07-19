import { uploadToR2 } from "@/lib/r2";

const PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search";

interface PexelsPhoto {
  id: number;
  src: { large: string };
}

async function searchPexels(query: string, perPage: number): Promise<PexelsPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "PEXELS_API_KEY is not set — get a free key at https://www.pexels.com/api/ and add it to .env before seeding",
    );
  }

  const url = new URL(PEXELS_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));

  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) {
    throw new Error(`Pexels search for "${query}" failed with HTTP ${res.status}`);
  }

  const data = (await res.json()) as { photos: PexelsPhoto[] };
  return data.photos;
}

/**
 * Fetches a pool of images for one category's search term and uploads each
 * ONCE to R2 (not per-product) — see CLAUDE.md "Seed product images (fake catalog)".
 * Returns the resulting public R2 URLs; a single bad image is skipped rather
 * than failing the whole seed run.
 */
export async function buildImagePool(categorySlug: string, searchTerm: string, poolSize: number): Promise<string[]> {
  const photos = await searchPexels(searchTerm, poolSize);
  const urls: string[] = [];

  for (const photo of photos) {
    const imageRes = await fetch(photo.src.large);
    if (!imageRes.ok) continue;
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    const key = `seed/${categorySlug}/${photo.id}.jpg`;
    urls.push(await uploadToR2(key, buffer, "image/jpeg"));
  }

  if (urls.length === 0) {
    throw new Error(`No images could be fetched/uploaded for category "${categorySlug}" (search: "${searchTerm}")`);
  }

  return urls;
}

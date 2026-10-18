import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  available: boolean;
  image: string | null;
  description: string | null;
  sort_order: number;
};

/** Uploaded photos are stored privately and served through the site itself. */
export function imageSrc(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("storage:")) {
    return `/api/public/product-image/${image.slice("storage:".length)}`;
  }
  return image;
}

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, price, unit, available, image, description, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((p) => ({ ...p, price: Number(p.price) }));
  },
  staleTime: 30 * 1000,
};

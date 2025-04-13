"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SwipeCard from "@/components/SwipeCard";

type ProductFromDB = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type SwipeItem = {
  id: string;
  title: string;
  description: string;
  value: number;
  image: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SwipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [items, setItems] = useState<SwipeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch the product by ID
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (productError) {
          console.error(
            "[Supabase] Error fetching product:",
            productError.message
          );
          setLoading(false);
          return;
        }

        if (!product) {
          console.error("[Supabase] Product not found.");
          setLoading(false);
          return;
        }

        // Calculate the price range (10% above and below the product's price)
        const minPrice = product.price * 0.5;
        const maxPrice = product.price * 1.5;

        // Fetch products within the price range
        const { data: similarProducts, error: rangeError } = await supabase
          .from("products")
          .select("*")
          .gte("price", minPrice)
          .lte("price", maxPrice)
          .neq("id", id); // Exclude the current product

        if (rangeError) {
          console.error(
            "[Supabase] Error fetching similar products:",
            rangeError.message
          );
        } else if (similarProducts) {
          const mapped: SwipeItem[] = similarProducts.map(
            (item: ProductFromDB) => ({
              id: item.id.toString(),
              title: item.name,
              description: item.description,
              value: item.price,
              image: item.image,
            })
          );
          setItems(mapped);
        }
      } catch (error) {
        console.error("[Supabase] Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#f6d5f7] to-[#fbe9d7]">
      <h1 className="text-3xl font-bold mb-6">Swiper</h1>
      {loading ? (
        <p className="text-gray-500">Loading items from Supabase...</p>
      ) : items.length > 0 ? (
        <SwipeCard items={items} />
      ) : (
        <p className="text-red-500">No items found in Supabase.</p>
      )}
    </main>
  );
}

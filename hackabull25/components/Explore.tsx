"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";

import { Button } from "./ui/button";
import { HeartIcon, ShareIcon, XIcon } from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  description?: string;
  additionalInfo?: string[];
  condition: string;
}

interface Filters {
  search: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  condition: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Explore() {
  const { user } = useUser();
  const userId = user?.id;

  const [filters, setFilters] = useState<Filters>({
    search: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    condition: "",
  });

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // 🟢 Fetch from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error.message);
        return;
      }

      const mapped: MarketplaceItem[] = data.map((product: any) => ({
        id: product.id.toString(),
        title: product.name,
        price: product.price,
        location: product.location || "Unknown",
        imageUrl: product.image || "/next.svg",
        description: product.description,
        condition: product.condition || "Unknown",
        additionalInfo: [], // if you add tags later
      }));

      setItems(mapped);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error loading wishlist:", error.message);
        return;
      }

      setWishlist(new Set(data.map((entry) => entry.product_id)));
    };

    fetchWishlist();
  }, [userId]);

  // 🔍 Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = filters.search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.additionalInfo?.some((info) =>
          info.toLowerCase().includes(search)
        );

      const matchesMin =
        !filters.minPrice || item.price >= parseFloat(filters.minPrice);
      const matchesMax =
        !filters.maxPrice || item.price <= parseFloat(filters.maxPrice);
      const matchesLocation =
        !filters.location || item.location === filters.location;
      const matchesCondition =
        !filters.condition || item.condition === filters.condition;

      return (
        matchesSearch &&
        matchesMin &&
        matchesMax &&
        matchesLocation &&
        matchesCondition
      );
    });
  }, [items, filters]);

  // Unique filter options

  const toggleWishlist = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!userId) return alert("You must be logged in to use wishlist");

    const alreadyInWishlist = wishlist.has(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      alreadyInWishlist ? next.delete(id) : next.add(id);
      return next;
    });

    const { error } = alreadyInWishlist
      ? await supabase
          .from("wishlists")
          .delete()
          .match({ user_id: userId, product_id: id })
      : await supabase
          .from("wishlists")
          .insert({ user_id: userId, product_id: id });

    if (error) console.error("Wishlist update failed:", error.message);
  };

  return (
    <div className="w-full columns-2 gap-6 px-6 pb-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="relative mb-6">
          <Link href={`/product/${item.id}`}>
            <div className="border-2 flex rounded-lg overflow-hidden">
              <div className="relative h-48 w-2/5 bg-gray-100">
                <Image
                  src={item.imageUrl}
                  alt="product-img"
                  fill={true}
                  objectFit="cover"
                  className="select-none"
                />
              </div>
              <div className="p-4 w-3/5 flex flex-col space-y-2">
                <p className="text-3xl truncate w-full">{item.title}</p>
                <h2 className="text-lg bg-green-50 text-green-500 w-fit px-2 py-1 rounded-xl">
                  $ {item.price.toLocaleString()}
                </h2>
                <p className="line-clamp-2 text-gray-600 text-sm">
                  {item.description}
                </p>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={(e) => toggleWishlist(e, item.id)}
                    title={
                      wishlist.has(item.id)
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"
                    }
                    className="bg-red-50 text-red-500 cursor-pointer hover:bg-red-100 focus:outline-0"
                  >
                    {wishlist.has(item.id) ? (
                      <XIcon className="h-6 w-6" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                    <p>
                      {wishlist.has(item.id)
                        ? "Remove from WishList"
                        : "Add to Wishlist"}
                    </p>
                  </Button>
                  <Button className="bg-blue-50 text-blue-500 cursor-pointer hover:bg-blue-100 focus:outline-0">
                    <ShareIcon className="h-6 w-6" />
                    <p>Share</p>
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

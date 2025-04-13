"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";

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
  const locations = useMemo(
    () => [...new Set(items.map((i) => i.location))],
    [items]
  );
  const conditions = useMemo(
    () => [...new Set(items.map((i) => i.condition))],
    [items]
  );

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

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      condition: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">
          Marketplace Items
        </h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Search
              </label>
              <input
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-2 border rounded-lg "
                placeholder="Search items..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Condition
              </label>
              <select
                value={filters.condition}
                onChange={(e) =>
                  handleFilterChange("condition", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Conditions</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-gray-600 mb-4">{filteredItems.length} items found</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={(e) => toggleWishlist(e, item.id)}
                className="absolute right-2 top-2 z-10 p-2"
                title={
                  wishlist.has(item.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <svg
                  className={`w-6 h-6 ${
                    wishlist.has(item.id)
                      ? "text-red-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  fill={wishlist.has(item.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                    2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09
                    3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0
                    3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>

              <Link href={`/product/${item.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden">
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-contain p-4"
                      priority={item.id === "1"}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-black">
                      ${item.price.toLocaleString()}
                    </h2>
                    <h3 className="text-lg text-black">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.location}</p>
                    {item.condition && (
                      <div className="mt-2">
                        <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                          {item.condition}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No items found matching your filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

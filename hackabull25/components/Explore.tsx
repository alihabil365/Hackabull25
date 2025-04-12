"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import Link from "next/link";

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

export default function Explore() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    condition: "",
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Handle wishlist toggle
  const toggleWishlist = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault(); // Prevent navigation to product page
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(itemId)) {
        newWishlist.delete(itemId);
      } else {
        newWishlist.add(itemId);
      }
      return newWishlist;
    });
  };

  // This would typically come from your database/API
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: "1",
      title: "Gaming Laptop",
      price: 899.99,
      location: "Tampa, FL",
      imageUrl: "/next.svg",
      condition: "Like new",
      additionalInfo: ["Like new", "Original packaging"],
    },
    {
      id: "2",
      title: "Vintage Camera",
      price: 299.99,
      location: "Wesley Chapel, FL",
      imageUrl: "/next.svg",
      condition: "Used",
      additionalInfo: ["Collector's item"],
    },
    {
      id: "3",
      title: "Mountain Bike",
      price: 450.0,
      location: "St Petersburg, FL",
      imageUrl: "/next.svg",
      condition: "Barely used",
      additionalInfo: ["Barely used", "All accessories included"],
    },
    {
      id: "4",
      title: "Smart Watch",
      price: 199.99,
      location: "Tampa, FL",
      imageUrl: "/next.svg",
      condition: "New",
      additionalInfo: ["Latest model"],
    },
    {
      id: "5",
      title: "Designer Bag",
      price: 599.99,
      location: "Largo, FL",
      imageUrl: "/next.svg",
      condition: "New",
      additionalInfo: ["Authentic", "New with tags"],
    },
    {
      id: "6",
      title: "Electric Guitar",
      price: 750.0,
      location: "Spring Hill, FL",
      imageUrl: "/next.svg",
      condition: "Used",
      additionalInfo: ["Professional grade"],
    },
  ]);

  // Get unique locations and conditions for filter options
  const locations = useMemo(
    () => [...new Set(items.map((item) => item.location))],
    [items]
  );
  const conditions = useMemo(
    () => [...new Set(items.map((item) => item.condition))],
    [items]
  );

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        item.additionalInfo?.some((info) =>
          info.toLowerCase().includes(filters.search.toLowerCase())
        );

      const matchesMinPrice =
        !filters.minPrice || item.price >= parseFloat(filters.minPrice);
      const matchesMaxPrice =
        !filters.maxPrice || item.price <= parseFloat(filters.maxPrice);
      const matchesLocation =
        !filters.location || item.location === filters.location;
      const matchesCondition =
        !filters.condition || item.condition === filters.condition;

      return (
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesLocation &&
        matchesCondition
      );
    });
  }, [items, filters]);

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

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search items..."
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="Min"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="Max"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
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

        {/* Results count */}
        <p className="text-gray-600 mb-4">{filteredItems.length} items found</p>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={(e) => toggleWishlist(e, item.id)}
                className="absolute right-2 top-2 z-10 p-2 transition-colors duration-200"
                aria-label={
                  wishlist.has(item.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
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
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>

              <Link
                href={`/product/${item.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 block"
              >
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
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-black">
                      ${item.price.toLocaleString()}
                    </h2>
                  </div>

                  <h3 className="text-lg mb-1 text-black">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.location}</p>

                  {item.additionalInfo && (
                    <div className="mt-2">
                      {item.additionalInfo.map((info, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 mr-2 mb-2"
                        >
                          {info}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* No results message */}
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

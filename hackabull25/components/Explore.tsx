"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  description?: string;
  additionalInfo?: string[];
}

export default function Explore() {
  // This would typically come from your database/API
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: "1",
      title: "Gaming Laptop",
      price: 899.99,
      location: "Tampa, FL",
      imageUrl: "/next.svg",
      additionalInfo: ["Like new", "Original packaging"],
    },
    {
      id: "2",
      title: "Vintage Camera",
      price: 299.99,
      location: "Wesley Chapel, FL",
      imageUrl: "/next.svg",
      additionalInfo: ["Collector's item"],
    },
    {
      id: "3",
      title: "Mountain Bike",
      price: 450.0,
      location: "St Petersburg, FL",
      imageUrl: "/next.svg",
      additionalInfo: ["Barely used", "All accessories included"],
    },
    {
      id: "4",
      title: "Smart Watch",
      price: 199.99,
      location: "Tampa, FL",
      imageUrl: "/next.svg",
      additionalInfo: ["Latest model"],
    },
    {
      id: "5",
      title: "Designer Bag",
      price: 599.99,
      location: "Largo, FL",
      imageUrl: "/next.svg",
      additionalInfo: ["Authentic", "New with tags"],
    },
    {
      id: "6",
      title: "Electric Guitar",
      price: 750.0,
      location: "Spring Hill, FL",
      imageUrl: "/next.svg",
      additionalInfo: ["Professional grade"],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">
          Marketplace Items
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link
              href={`/product/${item.id}`}
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
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
          ))}
        </div>
      </div>
    </div>
  );
}

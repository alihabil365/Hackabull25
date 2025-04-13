"use client";

// React
import { useState } from "react";

// Next
import Image from "next/image";

// Types
interface Seller {
  name: string;
  profileImage: string;
  rating?: number;
}

interface ProductDetailProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  location: string;
  description: string;
  images: string[];
  condition: string;
  seller: Seller;
  inStock?: boolean;
}

export default function ProductDetail({
  title,
  price,
  originalPrice,
  location,
  description,
  images,
  condition,
  seller,
  inStock = true,
}: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="min-h-screen flex">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Image Gallery */}
        <div className="relative h-[400px] md:h-[600px] bg-black rounded-lg overflow-hidden">
          <Image
            src={images[currentImageIndex] || "/next.svg"}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right side - Product Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-black mb-2">{title}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-black">
                    ${price.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Save to wishlist"
                >
                  🔖
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Share"
                >
                  ↗️
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="More options"
                >
                  ⋮
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span>📍</span>
                <span>{location}</span>
                {inStock && (
                  <span className="text-green-600 ml-2">• In stock</span>
                )}
              </div>

              <div className="border-t pt-4">
                <h2 className="font-semibold text-black mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Condition</span>
                    <p className="text-black">{condition}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="font-semibold text-black mb-2">Description</h2>
                <p className="text-gray-800 whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-black mb-4">
              Seller Information
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={seller.profileImage}
                  alt={seller.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-black">{seller.name}</h3>
                {seller.rating && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <span>★</span>
                    <span>{seller.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <button className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

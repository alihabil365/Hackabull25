"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Interface defining the structure of the form data
 * This ensures type safety across the component
 */
interface AddItemFormData {
  title: string; // Name of the item being traded
  description: string; // Detailed description of the item
  lookingFor: string; // What items the user wants in exchange
  price: string; // User's estimated price of the item
  image: File | null; // The item's image file
}

/**
 * AddItem Component
 *
 * A form component for users to upload new items for trading.
 * Features:
 * - Image upload with preview
 * - Item details input
 * - Price estimation
 * - AI-powered value estimation (to be implemented)
 *
 * @returns {JSX.Element} The rendered form component
 */
export default function AddItem() {
  // Main form state containing all input values
  const [formData, setFormData] = useState<AddItemFormData>({
    title: "",
    description: "",
    lookingFor: "",
    price: "",
    image: null,
  });

  // State for image preview URL
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // State for AI-estimated value (to be implemented with Gemini)
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  /**
   * Handles image file upload
   * Creates a preview URL for the uploaded image
   * TODO: Will trigger AI value estimation when implemented
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  /**
   * Handles form submission
   * TODO: Implement submission logic to:
   * - Upload image to Supabase storage
   * - Save item data to database
   * - Handle any errors
   * - Redirect user after successful upload
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">Add New Item</h1>

      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block mb-1">Click to upload an image</label>
          <div className="border border-gray-300 p-4 text-center">
            {previewUrl ? (
              <div className="relative h-48">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div>
                <p>SVG, PNG, JPG or GIF (max. 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter item title"
              className="w-full border p-1"
            />
          </div>

          <div>
            <label htmlFor="description" className="block">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your item"
              className="w-full border p-1"
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="price" className="block">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="0.00"
              className="w-full border p-1"
            />
          </div>

          <div>
            <label htmlFor="category" className="block">
              Category
            </label>
            <select id="category" className="w-full border p-1" defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-1 border"
              onClick={() => {
                /* Add cancel handler */
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 border"
              onClick={handleSubmit}
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

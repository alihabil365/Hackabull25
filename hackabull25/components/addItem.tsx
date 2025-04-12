"use client";

// React
import { useState } from "react";

// Next
import Image from "next/image";

// Types
interface AddItemFormData {
  title: string;
  description: string;
  lookingFor: string;
  price: string;
  image: File | null;
}

// ShadCn
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

export default function AddItem() {
  // States
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddItemFormData>({
    title: "",
    description: "",
    lookingFor: "",
    price: "",
    image: null,
  });

  // Functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
  };

  return (
    <div className="">
      <div className="space-y-4">
        {/* Form Fields */}
        <div className="space-y-4 w-full">
          <div className="grid w-full items-center gap-1.5">
            <Input
              type="text"
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your item"
              rows={4}
            />
          </div>

          <div className="flex space-x-2 w-full items-center gap-1.5">
            <Input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price: 0.00"
            />

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 w-full items-center gap-1.5">
            {previewUrl ? (
              <div>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="grid w-full items-center gap-1.5">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <Button className="bg-purple-500 cursor-pointer">Add Item</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

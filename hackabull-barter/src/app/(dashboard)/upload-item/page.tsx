"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { estimateItemValue } from "@/lib/gemini";

export default function UploadItem() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [desiredItems, setDesiredItems] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload image to Supabase Storage if provided
      let imageUrl = "";
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("item-images")
          .upload(fileName, image);

        if (error) {
          throw new Error("Error uploading image: " + error.message);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("item-images").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Use Gemini AI to estimate the value of the item
      const estimatedValue = await estimateItemValue(
        title,
        description,
        imageUrl || undefined
      );

      // Parse desired items as an array
      const desiredItemsArray = desiredItems
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      // Insert item into Supabase database
      const { data, error } = await supabase.from("items").insert([
        {
          user_id: user.id,
          title,
          description,
          image_url: imageUrl,
          estimated_value: estimatedValue,
          desired_items: desiredItemsArray,
        },
      ]);

      if (error) {
        throw new Error("Error creating item: " + error.message);
      }

      toast.success("Item added successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error uploading item:", error);
      toast.error("Failed to upload item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload New Item</h1>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Item Title
          </label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you offering?"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item: condition, age, features, etc."
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="form-label">
            Item Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-600
              hover:file:bg-primary-100
              cursor-pointer"
          />

          {preview && (
            <div className="mt-4 relative h-48 w-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-md"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="desiredItems" className="form-label">
            Desired Items (comma-separated)
          </label>
          <input
            id="desiredItems"
            type="text"
            className="form-input"
            value={desiredItems}
            onChange={(e) => setDesiredItems(e.target.value)}
            placeholder="e.g. Headphones, Camera, Watch"
          />
          <p className="text-sm text-gray-500 mt-1">
            List items you&apos;d be interested in trading for (optional)
          </p>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

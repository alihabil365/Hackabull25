"use client";

// React
import { useState, useTransition } from "react";

// ShadCn
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Components
import LoadingCircleSpinner from "@/components/Spinner";

// Actions
import createItem from "@/actions/createItem";
import uploadImageToSupabase from "@/actions/uploadImageToSupabase";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Clerk
import { useUser } from "@clerk/nextjs";

interface AddItemProps {
  onItemCreated?: (itemId: string) => void;
}

export default function AddItem({ onItemCreated }: AddItemProps) {
  const { user } = useUser(); // Get the current user from Clerk

  // States
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAiSuggested, setIsAiSuggested] = useState(false);

  // Transitions
  const [isPending, startTransition] = useTransition();

  // Functions
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();

      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      reader.readAsDataURL(file);

      const base64Image = await base64Promise;

      if (!base64Image || typeof base64Image !== "string") {
        throw new Error("Failed to convert image to base64");
      }

      console.log("Sending image for analysis...");

      // Call the analyze-product API endpoint
      const response = await fetch("/api/analyze-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const analysis = await response.json();
      console.log("=== Analysis Result ===");
      console.log(JSON.stringify(analysis, null, 2));
      console.log("=====================");

      if (
        typeof analysis.min !== "number" ||
        typeof analysis.max !== "number"
      ) {
        throw new Error("Invalid price estimate received from API");
      }

      // Use the average of min and max as the suggested price
      const suggestedPrice = ((analysis.min + analysis.max) / 2).toFixed(2);

      setPrice(suggestedPrice);
      setIsAiSuggested(true);
      toast("AI has suggested a price based on the image!");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast(
        error instanceof Error
          ? error.message
          : "Failed to analyze image. You can still set the price manually."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      await analyzeImage(file);
    }
  };

  const handleItemAdd = () => {
    if (!selectedFile) {
      toast("Please select an image to upload.");
      return;
    }

    if (!user) {
      toast("User not authenticated.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();

      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { error } = await supabase.storage
        .from("productimages")
        .upload(fileName, selectedFile);
      if (error) {
        console.log(error);
        toast("Failed to upload image.");
        return;
      }

      // Get Image URL
      const result = supabase.storage
        .from("productimages")
        .getPublicUrl(fileName);

      if (!result.data.publicUrl) {
        toast("Failed to retrieve image URL.");
        return;
      }

      // Pass userId to createItem
      const created = await createItem(
        name,
        description,
        price,
        result.data.publicUrl
      );

      if (created && onItemCreated) {
        onItemCreated(created[0].id); // ✅ Pass the new item's ID back to BidModal
      }

      toast("Item has been created successfully.");
    });
  };

  return (
    <div className="">
      <div className="space-y-4">
        {/* Form Fields */}
        <div className="space-y-4 w-full">
          <div className="grid w-full items-center gap-1.5">
            <Input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item"
              rows={4}
            />
          </div>

          <div className="flex space-x-2 w-full items-center gap-1.5">
            <div className="relative flex-grow">
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setIsAiSuggested(false);
                }}
                placeholder="Price: 0.00"
                className={isAnalyzing ? "opacity-50" : ""}
                disabled={isAnalyzing}
              />
              {isAiSuggested && (
                <Badge
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-[#f89b29] to-[#ff0f7b]"
                  variant="secondary"
                >
                  AI Suggested
                </Badge>
              )}
              {isAnalyzing && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <LoadingCircleSpinner />
                </div>
              )}
            </div>

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
            <div className="grid w-full items-center gap-1.5">
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <Button
              onClick={handleItemAdd}
              className="cursor-pointer bg-gradient-to-r from-[#f89b29] to-[#ff0f7b] active:scale-99 px-4 py-2 rounded-lg text-white text-sm duration-100 ease-in-out z-50"
              disabled={isPending}
            >
              {!isPending ? <p> Create Quiz Set</p> : <LoadingCircleSpinner />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

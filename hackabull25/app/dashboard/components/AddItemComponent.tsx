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

// Components
import LoadingCircleSpinner from "@/components/Spinner";

// Actions
import createItem from "@/actions/createItem";
import uploadImageToSupabase from "@/actions/uploadImageToSupabase";

// Supabase
import { createClient } from "@/utils/supabase/client";

export default function AddItem() {
  // States
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Transitions
  const [isPending, startTransition] = useTransition();

  // Functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleItemAdd = () => {
    if (!selectedFile) {
      toast("Please select an image to upload.");
      return;
    }

    startTransition(async () => {
      // Upload Image
      const supabase = createClient();

      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { error } = await supabase.storage
        .from("productimages")
        .upload(fileName, selectedFile);
      if (error) console.log(error);

      // Get Image URL
      const result = supabase.storage
        .from("productimages")
        .getPublicUrl(fileName);

      // Upload to database
      const databaseRef = await createItem(
        name,
        description,
        price,
        result.data.publicUrl
      );

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
            <Input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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

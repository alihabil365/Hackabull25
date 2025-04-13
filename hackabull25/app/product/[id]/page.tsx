"use client";

import { use, useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getItem from "@/actions/getItem";
import { WandSparkles } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<any>(undefined);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const { user } = useUser();
  const { id } = use(params);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getItem(id);
      setProduct(data);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserProducts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setUserProducts(data || []);
      }
    };

    fetchUserProducts();
  }, [user]);

  if (!product) return null;

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-screen w-1/2 relative overflow-hidden">
        <Image
          src={product.image}
          alt="product-img"
          fill
          objectFit="cover"
          className="select-none"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center h-screen p-6 space-y-2">
        <p className="text-3xl font-bold">{product.name}</p>
        <p className="text-xl font-medium">
          Seller valuation: ${product.price}
        </p>
        <Badge variant="outline" className="text-md">
          <WandSparkles className="h-6 w-6" />
          Actual market valuation according to AI: $
          {product.ai_valuation ? product.ai_valuation.toFixed(2) : "N/A"}
        </Badge>

        <div className="flex space-x-2 items-center bg-gray-50 p-4 rounded-xl">
          <Avatar>
            <AvatarImage src={product.user.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            {product.user.firstName} {product.user.lastName}
          </div>
        </div>

        <p>{product.description}</p>

        <Drawer>
          <DrawerTrigger className="bg-pink-500 w-full p-2 text-white rounded-xl">
            Place Bid
          </DrawerTrigger>

          <DrawerContent className="p-6 max-h-[80vh] overflow-y-auto rounded-t-xl border-t">
            <DrawerHeader>
              <DrawerTitle>Choose item(s) to offer</DrawerTitle>
              <DrawerDescription>
                You may select one or more items to offer for trade.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex overflow-x-auto gap-4 py-4 px-2">
              {userProducts.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItemIds((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      );
                    }}
                    className={`min-w-[200px] cursor-pointer border-2 ${
                      isSelected ? "border-green-500" : "border-transparent"
                    } bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex-shrink-0`}
                  >
                    <div className="relative h-40 w-full bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div
                onClick={() => console.log("TODO: Add item flow")}
                className="min-w-[200px] bg-gray-100 border-dashed border-2 border-gray-400 flex flex-col justify-center items-center rounded-lg p-4 cursor-pointer hover:bg-gray-200 flex-shrink-0"
              >
                <p className="text-2xl font-bold text-gray-600">＋</p>
                <p className="text-sm text-gray-500">Add Item</p>
              </div>
            </div>

            <DrawerFooter>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={selectedItemIds.length === 0}
                onClick={async () => {
                  if (!user?.id) {
                    toast.error("You must be signed in to place a bid.");
                    return;
                  }

                  const supabase = createClient();

                  // Check for existing bids
                  const { data: existing, error: checkError } = await supabase
                    .from("bids")
                    .select("id")
                    .eq("bidder_id", user.id)
                    .eq("target_item_id", product.id)
                    .in("offered_item_id", selectedItemIds);

                  if (checkError) {
                    console.error(
                      "Error checking for existing bids:",
                      checkError.message
                    );
                    toast.error("Failed to check for existing bids.");
                    return; // stop further execution
                  }

                  if (existing && existing.length > 0) {
                    toast.warning(
                      "Some of your bids already exist. We'll update them."
                    );
                  }

                  const inserts = selectedItemIds.map((itemId) => ({
                    bidder_id: user.id,
                    offered_item_id: itemId,
                    target_item_id: product.id,
                    status: "pending",
                  }));
<<<<<<< HEAD

                  const { error: insertError } = await supabase
                    .from("bids")
                    .upsert(inserts, {
                      onConflict: "bidder_id,offered_item_id,target_item_id",
                    });

=======
                
                  const { error: insertError } = await supabase
                    .from("bids")
                    .upsert(inserts, {
                    onConflict: "bidder_id,offered_item_id,target_item_id",
                  });
                
>>>>>>> ali
                  if (insertError) {
                    console.error("Bid failed:", insertError.message);
                    toast.error("Failed to place bid.");
                    return; // 🛑 make sure we stop here
                  }

                  // ✅ Success
                  toast.success("Your bid(s) have been submitted!");
                  setSelectedItemIds([]);
                }}
              >
                Submit {selectedItemIds.length} Bid
                {selectedItemIds.length > 1 ? "s" : ""}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

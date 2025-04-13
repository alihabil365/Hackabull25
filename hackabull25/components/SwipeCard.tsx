"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { CheckIcon, XIcon } from "lucide-react";

import { toast } from "sonner";
import Link from "next/link";

type Item = {
  id: string;
  image: string;
  title: string;
  value: number;
  description: string;
};

interface SwipeCardProps {
  items: Item[];
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SwipeCard({ items }: SwipeCardProps) {
  const { user } = useUser();
  const userId = user?.id;

  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<Item[]>([]);
  const [showMatch, setShowMatch] = useState(false);

  // Wishlist state: a set of product ids
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Fetch wishlist for the current user
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
      setWishlist(
        new Set(data.map((entry: { product_id: string }) => entry.product_id))
      );
    };

    fetchWishlist();
  }, [userId]);

  // Toggle wishlist status for a given product id (used automatically on match)
  const toggleWishlist = async (id: string) => {
    if (!userId) return;
    // Only add if not already added
    if (!wishlist.has(id)) {
      setWishlist((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: userId, product_id: id });
      if (error) console.error("Wishlist update failed:", error.message);
    }
  };

  const currentItem = items[index];

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentItem) return;

    if (direction === "right") {
      // Add the match and automatically add to wishlist
      setMatches((prev) => [...prev, currentItem]);
      toggleWishlist(currentItem.id);
      setShowMatch(true);
      setTimeout(() => setShowMatch(false), 1500);
      toast("Item has been added to wishlist");
    }

    setIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-sm h-[520px] flex flex-col items-center justify-center gap-6 relative">
      {/* Swipeable Card */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            drag="x"
            onDragEnd={(event, info) => {
              if (info.offset.x > 100) handleSwipe("right");
              else if (info.offset.x < -100) handleSwipe("left");
            }}
            className="relative w-full h-[420px] rounded-xl overflow-hidden group shadow-2xl"
          >
            {/* Background image */}
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-full object-cover"
            />

            {/* Always visible: title + value */}
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm backdrop-brightness-75 text-white p-4">
              <h2 className="text-lg font-bold">{currentItem.title}</h2>
              <p className="text-green-300 font-semibold">
                ${currentItem.value}
              </p>
            </div>

            {/* Hover-only: description */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm px-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p>{currentItem.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Buttons */}
      {currentItem && (
        <div className="flex space-x-4 justify-center z-10 w-full">
          <Button
            onClick={() => handleSwipe("left")}
            className="px-6 py-2  rounded-xl bg-red-50 text-red-500 hover:bg-red-500 font-semibold"
          >
            <XIcon className="h-6 w-6" />
            Skip
          </Button>
          <Button
            onClick={() => handleSwipe("right")}
            className="px-6 py-2  rounded-xl bg-green-50 text-green-500 font-semibold"
          >
            <CheckIcon className="h-6 w-6" />
            Match
          </Button>
        </div>
      )}

      {/* Display Matches */}
      {matches.length > 0 && (
        <div className="text-sm mt-2 text-center bg-white px-4 py-2 border-2 rounded-xl">
          <Link href={"/dashboard/wishlist"}>Go to wishlist</Link>
        </div>
      )}
    </div>
  );
}

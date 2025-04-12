"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase, Item } from "@/lib/supabase";
import SwipeCard from "@/components/SwipeCard";

export default function TradePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [userItem, setUserItem] = useState<Item | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<Item[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchUserItem = async () => {
      try {
        setLoading(true);

        // Fetch the most recent item added by the user
        const { data: userItems, error: userItemsError } = await supabase
          .from("items")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (userItemsError) {
          throw new Error(userItemsError.message);
        }

        if (!userItems || userItems.length === 0) {
          // User has no items to trade
          setLoading(false);
          return;
        }

        const selectedUserItem = userItems[0];
        setUserItem(selectedUserItem);

        // Calculate value range for matching (±10%)
        const minValue = selectedUserItem.estimated_value * 0.9;
        const maxValue = selectedUserItem.estimated_value * 1.1;

        // Fetch potential matches within the value range and not owned by the user
        const { data: matches, error: matchesError } = await supabase
          .from("items")
          .select("*")
          .not("user_id", "eq", user.id)
          .gte("estimated_value", minValue)
          .lte("estimated_value", maxValue)
          .order("created_at", { ascending: false });

        if (matchesError) {
          throw new Error(matchesError.message);
        }

        setPotentialMatches(matches || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trade items:", error);
        toast.error("Failed to load items for trading");
        setLoading(false);
      }
    };

    fetchUserItem();
  }, [user]);

  const handleSwipeLeft = () => {
    // Reject the item, just move to the next one
    setCurrentItemIndex((currentIndex) => currentIndex + 1);
  };

  const handleSwipeRight = async () => {
    // User likes the item, create a match record
    if (!user || !userItem || currentItemIndex >= potentialMatches.length)
      return;

    const currentMatch = potentialMatches[currentItemIndex];

    try {
      // Check if a match already exists in either direction
      const { data: existingMatches, error: matchCheckError } = await supabase
        .from("matches")
        .select("*")
        .or(
          `and(item_a_id.eq.${userItem.id},item_b_id.eq.${currentMatch.id}),` +
            `and(item_a_id.eq.${currentMatch.id},item_b_id.eq.${userItem.id})`
        );

      if (matchCheckError) {
        throw new Error(matchCheckError.message);
      }

      if (!existingMatches || existingMatches.length === 0) {
        // Create a new match
        const { error: insertError } = await supabase.from("matches").insert([
          {
            item_a_id: userItem.id,
            item_b_id: currentMatch.id,
            status: "pending",
            matched_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          throw new Error(insertError.message);
        }

        toast.success(
          "Match created! Check your matches to see if they accept."
        );
      } else {
        toast.info("You already have a match with this item.");
      }
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Failed to create match. Please try again.");
    }

    // Move to the next item
    setCurrentItemIndex((currentIndex) => currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!userItem) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Items to Trade</h2>
        <p className="text-gray-600 mb-6">
          You need to upload at least one item before you can start trading.
        </p>
        <button
          className="btn-primary"
          onClick={() => router.push("/upload-item")}
        >
          Upload an Item
        </button>
      </div>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Matches Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find any items within your value range (±10%). Check
          back later or try adding another item.
        </p>
        <button
          className="btn-primary"
          onClick={() => router.push("/upload-item")}
        >
          Upload Another Item
        </button>
      </div>
    );
  }

  if (currentItemIndex >= potentialMatches.length) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No More Items</h2>
        <p className="text-gray-600 mb-6">
          You&apos;ve viewed all available items in your value range. Check back
          later for new items.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="btn-primary"
            onClick={() => router.push("/matches")}
          >
            View Matches
          </button>
          <button
            className="btn-outline"
            onClick={() => router.push("/upload-item")}
          >
            Upload Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Trades</h1>
        <p className="text-gray-600">
          Swipe right on items you want to trade for, left to skip.
        </p>
      </div>

      <div className="flex-grow relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-md">
            <SwipeCard
              item={potentialMatches[currentItemIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

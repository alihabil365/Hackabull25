"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { supabase, Match, Item } from "@/lib/supabase";

export default function MatchesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      try {
        setLoading(true);

        // First, get all user items
        const { data: userItems, error: itemsError } = await supabase
          .from("items")
          .select("id")
          .eq("user_id", user.id);

        if (itemsError) {
          throw new Error(itemsError.message);
        }

        if (!userItems || userItems.length === 0) {
          setLoading(false);
          return;
        }

        const userItemIds = userItems.map((item: { id: string }) => item.id);

        // Then fetch all matches involving user items
        const { data: matchesData, error: matchesError } = await supabase
          .from("matches")
          .select(
            `
            *,
            item_a:item_a_id(*),
            item_b:item_b_id(*)
          `
          )
          .or(
            `item_a_id.in.(${userItemIds.join(
              ","
            )}),item_b_id.in.(${userItemIds.join(",")})`
          )
          .order("matched_at", { ascending: false });

        if (matchesError) {
          throw new Error(matchesError.message);
        }

        setMatches(matchesData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast.error("Failed to load matches");
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  const handleAcceptMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from("matches")
        .update({ status: "accepted" })
        .eq("id", matchId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          match.id === matchId ? { ...match, status: "accepted" } : match
        )
      );

      toast.success("Trade accepted! You can now coordinate the exchange.");
    } catch (error) {
      console.error("Error accepting match:", error);
      toast.error("Failed to accept match");
    }
  };

  const handleDeclineMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from("matches")
        .update({ status: "declined" })
        .eq("id", matchId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          match.id === matchId ? { ...match, status: "declined" } : match
        )
      );

      toast.success("Trade declined.");
    } catch (error) {
      console.error("Error declining match:", error);
      toast.error("Failed to decline match");
    }
  };

  const isUserItem = (itemId: string, userItems: Item[]): boolean => {
    return userItems.some((item) => item.id === itemId);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading your matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-2xl mx-auto card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No Matches Yet</h2>
        <p className="text-gray-600 mb-6">
          Start swiping on items to find potential trades!
        </p>
        <button className="btn-primary" onClick={() => router.push("/trade")}>
          Find Trades
        </button>
      </div>
    );
  }

  // Group matches by status
  const pendingMatches = matches.filter((match) => match.status === "pending");
  const acceptedMatches = matches.filter(
    (match) => match.status === "accepted"
  );
  const declinedMatches = matches.filter(
    (match) => match.status === "declined"
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      {pendingMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Pending Trades</h2>
          <div className="space-y-4">
            {pendingMatches.map((match) => {
              const isMine = user && match.item_a?.user_id === user.id;
              const myItem = isMine ? match.item_a : match.item_b;
              const theirItem = isMine ? match.item_b : match.item_a;

              return (
                <div key={match.id} className="card overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Potential Trade</h3>
                      <span className="py-1 px-3 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <div className="p-4 w-full md:w-1/2 border-b md:border-b-0 md:border-r">
                      <p className="text-sm text-gray-500 mb-2">Your Item</p>
                      <div className="flex items-start space-x-3">
                        {myItem?.image_url && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={myItem.image_url}
                              alt={myItem.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{myItem?.title}</h4>
                          <p className="text-sm text-primary-600">
                            ${myItem?.estimated_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 w-full md:w-1/2">
                      <p className="text-sm text-gray-500 mb-2">Their Item</p>
                      <div className="flex items-start space-x-3">
                        {theirItem?.image_url && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={theirItem.image_url}
                              alt={theirItem.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{theirItem?.title}</h4>
                          <p className="text-sm text-primary-600">
                            ${theirItem?.estimated_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Only show accept/decline buttons if it's not our match request */}
                  {!isMine && (
                    <div className="p-4 flex justify-end space-x-3 bg-gray-50">
                      <button
                        onClick={() => handleAcceptMatch(match.id)}
                        className="btn-primary py-1 px-4"
                      >
                        Accept Trade
                      </button>
                      <button
                        onClick={() => handleDeclineMatch(match.id)}
                        className="btn-outline py-1 px-4"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {/* Show waiting message if it's our match request */}
                  {isMine && (
                    <div className="p-4 bg-gray-50 text-right text-sm text-gray-600">
                      Waiting for the other party to respond...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {acceptedMatches.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Accepted Trades</h2>
          <div className="space-y-4">
            {acceptedMatches.map((match) => {
              const isMine = user && match.item_a?.user_id === user.id;
              const myItem = isMine ? match.item_a : match.item_b;
              const theirItem = isMine ? match.item_b : match.item_a;

              return (
                <div key={match.id} className="card overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Accepted Trade</h3>
                      <span className="py-1 px-3 bg-green-100 text-green-800 rounded-full text-sm">
                        Accepted
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <div className="p-4 w-full md:w-1/2 border-b md:border-b-0 md:border-r">
                      <p className="text-sm text-gray-500 mb-2">Your Item</p>
                      <div className="flex items-start space-x-3">
                        {myItem?.image_url && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={myItem.image_url}
                              alt={myItem.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{myItem?.title}</h4>
                          <p className="text-sm text-primary-600">
                            ${myItem?.estimated_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 w-full md:w-1/2">
                      <p className="text-sm text-gray-500 mb-2">Their Item</p>
                      <div className="flex items-start space-x-3">
                        {theirItem?.image_url && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={theirItem.image_url}
                              alt={theirItem.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{theirItem?.title}</h4>
                          <p className="text-sm text-primary-600">
                            ${theirItem?.estimated_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex justify-end space-x-3 bg-gray-50">
                    <button className="btn-secondary py-1 px-4">
                      Contact Trader
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {declinedMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Declined Trades</h2>
          <div className="space-y-4">
            {declinedMatches.map((match) => {
              const isMine = user && match.item_a?.user_id === user.id;
              const myItem = isMine ? match.item_a : match.item_b;
              const theirItem = isMine ? match.item_b : match.item_a;

              return (
                <div key={match.id} className="card overflow-hidden opacity-70">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Declined Trade</h3>
                      <span className="py-1 px-3 bg-red-100 text-red-800 rounded-full text-sm">
                        Declined
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <div className="p-4 w-full md:w-1/2 border-b md:border-b-0 md:border-r">
                      <p className="text-sm text-gray-500 mb-2">Your Item</p>
                      <div className="flex items-start space-x-3">
                        {myItem?.image_url && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={myItem.image_url}
                              alt={myItem.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{myItem?.title}</h4>
                          <p className="text-sm text-primary-600">
                            ${myItem?.estimated_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 w-full md:w-1/2">
                      <p className="text-sm text-gray-500 mb-2">Their Item</p>
                      <div className="flex items-start space-x-3">
                        {theirItem?.image_url && (
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={theirItem.image_url}
                              alt={theirItem.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{theirItem?.title}</h4>
                          <p className="text-sm text-primary-600">
                            ${theirItem?.estimated_value.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

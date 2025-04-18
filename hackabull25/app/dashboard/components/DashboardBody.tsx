"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import updateBidStatus from "@/actions/updateBidStatus";
import { toast } from "sonner";

// ShadCn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  price: number;
  image: string;
  status: "active" | "pending" | "traded";
  description: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Bid {
  id: string;
  offered_item_id: string;
  target_item_id: string;
  bidder_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  offered_item: {
    name: string;
    price: number;
    image: string;
  };
  bidder: {
    firstName: string;
    lastName: string;
  };
}

interface Notification {
  id: string;
  type: "bid" | "match" | "message" | "system";
  title: string;
  body: string;
  created_at: string;
}

interface BidGroup {
  targetItem: UserItem;
  bids: Bid[];
}

export default function DashboardBody() {
  const { user } = useUser();
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [currentBids, setCurrentBids] = useState<Bid[]>([]);
  const [groupedBids, setGroupedBids] = useState<BidGroup[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchUserItems();
      fetchWishlistItems();
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (userItems.length > 0) {
      fetchUserBids();
    }
  }, [userItems]);

  useEffect(() => {
    // Group bids by target item
    const grouped = userItems
      .map((item) => ({
        targetItem: item,
        bids: currentBids.filter((bid) => bid.target_item_id === item.id),
      }))
      .filter((group) => group.bids.length > 0);

    setGroupedBids(grouped);
  }, [currentBids, userItems]);

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const fetchUserBids = async () => {
    if (!user) return;

    try {
      // Fetch bids where the user's items are being bid on
      const { data: receivedBids, error: receivedError } = await supabase
        .from("bids")
        .select(
          `
          id,
          offered_item_id,
          target_item_id,
          bidder_id,
          status,
          created_at,
          offered_item:products!offered_item_id (
            name,
            price,
            image
          ),
          bidder:users!bidder_id (
            firstName,
            lastName
          )
        `
        )
        .eq("status", "pending")
        .in(
          "target_item_id",
          userItems.map((item) => item.id)
        );

      if (receivedError) throw receivedError;

      console.log(userItems);

      // Type cast the response to match our Bid interface
      const typedBids = (receivedBids || []).map((bid) => {
        // Extract the first (and should be only) item from the arrays
        const offeredItem = Array.isArray(bid.offered_item)
          ? bid.offered_item[0]
          : bid.offered_item;
        const bidder = Array.isArray(bid.bidder) ? bid.bidder[0] : bid.bidder;

        return {
          ...bid,
          offered_item: {
            name: offeredItem?.name || "",
            price: offeredItem?.price || 0,
            image: offeredItem?.image || "",
          },
          bidder: {
            firstName: bidder?.firstName || "",
            lastName: bidder?.lastName || "",
          },
        };
      }) as Bid[];

      setCurrentBids(typedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoadingBids(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("userId", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserItems(data || []);
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistItems = async () => {
    if (!user) return;

    try {
      // 1. Fetch list of product_ids from wishlist
      const { data: wishData, error: wishError } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

      if (wishError) throw wishError;

      if (wishData.length === 0) {
        setWishlistItems([]);
        setLoadingWishlist(false);
        return;
      }

      const productIds = wishData.map((w) => w.product_id);

      // 2. Fetch matching product details
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productError) throw productError;

      setWishlistItems(products || []);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  return (
    <div className="px-6 pb-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Bids Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Current Bids</span>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                {currentBids.length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-108 overflow-auto">
            <div className="space-y-4">
              {loadingBids ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : groupedBids.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No active bids</p>
                </div>
              ) : (
                groupedBids.map(({ targetItem, bids }) => (
                  <div key={targetItem.id} className="space-y-2">
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleItemExpansion(targetItem.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16">
                          <Image
                            src={targetItem.image}
                            alt={targetItem.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1 w-48">
                            {targetItem.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${targetItem.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {bids.length} {bids.length === 1 ? "bid" : "bids"}
                        </Badge>
                        {expandedItems.has(targetItem.id) ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {/* Dropdown content */}
                    {expandedItems.has(targetItem.id) && (
                      <div className="pl-8 space-y-2">
                        {bids.map((bid) => (
                          <div
                            key={bid.id}
                            className="flex flex-col space-y-3 justify-between p-3 bg-white border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative h-12 w-12">
                                <Image
                                  src={bid.offered_item.image}
                                  alt={bid.offered_item.name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {bid.offered_item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${bid.offered_item.price.toFixed(2)} by{" "}
                                  {bid.bidder.firstName} {bid.bidder.lastName}
                                </p>
                              </div>
                            </div>

                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                className="bg-green-50 text-green-500 w-1/2 cursor-pointer hover:bg-green-50 hover:brightness-75"
                                onClick={async () => {
                                  const success = await updateBidStatus(
                                    bid.id,
                                    "accepted",
                                    bid.bidder_id,
                                    user?.id || "",
                                    targetItem.name,
                                    bid.offered_item.name
                                  );
                                  if (success) {
                                    toast.success("Bid accepted!");
                                    fetchUserBids();
                                  } else {
                                    toast.error("Failed to accept bid");
                                  }
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-50 text-red-500 w-1/2 cursor-pointer hover:bg-red-50 hover:brightness-75"
                                onClick={async () => {
                                  const success = await updateBidStatus(
                                    bid.id,
                                    "rejected",
                                    bid.bidder_id,
                                    user?.id || "",
                                    targetItem.name,
                                    bid.offered_item.name
                                  );
                                  if (success) {
                                    toast.success("Bid rejected");
                                    fetchUserBids();
                                  } else {
                                    toast.error("Failed to reject bid");
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Items Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>My Items</span>
              {/* <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/add-item">+ Add Item</Link>
              </Button> */}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-108 overflow-auto">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : userItems.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No items added yet</p>
                </div>
              ) : (
                userItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="relative h-16 w-16">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.status === "active"
                          ? "default"
                          : item.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Notifications</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {notifications.length} New
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-108 overflow-auto">
            <div className="space-y-4">
              {loadingNotifications ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.body}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          notification.type === "bid"
                            ? "bg-blue-100 text-blue-800"
                            : notification.type === "match"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Card */}
        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                {loadingWishlist ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Your wishlist is empty</p>
                  </div>
                ) : (
                  wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="relative h-16 w-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-[#E329F8FF] to-[#ff0f7b]"
                asChild
              >
                <Link href="/dashboard/products">Start Swiping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

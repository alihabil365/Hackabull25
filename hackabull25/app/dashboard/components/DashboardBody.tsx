"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";

// ShadCn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserItem {
  id: string;
  name: string;
  price: number;
  image: string;
  status: "active" | "pending" | "traded";
  description: string;
}

interface Bid {
  id: string;
  itemName: string;
  bidderName: string;
  bidAmount: number;
  timestamp: string;
  status: "pending" | "accepted" | "rejected";
}

interface Notification {
  id: string;
  type: "bid" | "match" | "message" | "system";
  message: string;
  timestamp: string;
  read: boolean;
}

export default function DashboardBody() {
  const { user } = useUser();
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Example data for bids and notifications - these can be updated later to use real data
  const [currentBids] = useState<Bid[]>([
    {
      id: "1",
      itemName: "Vintage Camera",
      bidderName: "John Doe",
      bidAmount: 280.0,
      timestamp: "2024-02-24T10:00:00Z",
      status: "pending",
    },
    {
      id: "2",
      itemName: "Gaming Console",
      bidderName: "Jane Smith",
      bidAmount: 450.0,
      timestamp: "2024-02-24T09:30:00Z",
      status: "pending",
    },
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "bid",
      message: "New bid on your Vintage Camera",
      timestamp: "2024-02-24T10:00:00Z",
      read: false,
    },
    {
      id: "2",
      type: "match",
      message: "You matched with a Gaming Console!",
      timestamp: "2024-02-24T09:30:00Z",
      read: true,
    },
    {
      id: "3",
      type: "system",
      message: "Welcome to Barter! Start by adding your first item.",
      timestamp: "2024-02-24T09:00:00Z",
      read: true,
    },
  ]);

  useEffect(() => {
    if (user) {
      fetchUserItems();
    }
  }, [user]);

  const fetchUserItems = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("userId", user?.id)
        .order("created_at", { ascending: false })
        .limit(3); // Only fetch the 3 most recent items for the dashboard

      if (error) throw error;
      setUserItems(data || []);
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
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
          <CardContent>
            <div className="space-y-4">
              {currentBids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{bid.itemName}</p>
                    <p className="text-sm text-gray-500">
                      Bid by {bid.bidderName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${bid.bidAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(bid.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
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
          <CardContent>
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
                {notifications.filter((n) => !n.read).length} New
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    notification.read ? "bg-gray-50" : "bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{notification.message}</p>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Swipe Feature Card */}
        <Card>
          <CardHeader>
            <CardTitle>Start Swiping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="relative h-40 w-full">
                <Image
                  src="/images/photo-1712133611163-3dc3cadecf7f.avif"
                  alt="Swipe Feature"
                  fill
                  className="object-cover rounded-lg opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f89b29]/20 to-[#ff0f7b]/20 rounded-lg" />
              </div>
              <p className="text-gray-600">
                Discover new items by swiping through our marketplace. Match
                with items you're interested in and start trading!
              </p>
              <Button
                className="w-full bg-gradient-to-r from-[#f89b29] to-[#ff0f7b]"
                asChild
              >
                <Link href="/swipe">Start Swiping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

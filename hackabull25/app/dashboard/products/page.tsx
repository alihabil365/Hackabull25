"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// Components
import DashboardSidebar from "../components/DashboardSidebar";
import AddItemDialog from "../components/AddItemDialog";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import { Edit2Icon, Trash2Icon } from "lucide-react";

// Supabase
import { createClient } from "@/utils/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  status: "active" | "pending" | "traded";
  created_at: string;
  userId: string;
}

export default function ProductsPage() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user]);

  const fetchUserProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("userId", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      // Refresh products list
      fetchUserProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen w-3/4 flex pr-6 bg-gray-50 overflow-auto">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 pr-6">
        <div className="py-6 border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <AddItemDialog />
          </div>
        </div>

        <div className="max-full py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                You haven't added any products yet.
              </p>
              <AddItemDialog />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative h-fit w-full">
                    <div className="h-24">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Badge
                      className="absolute top-2 right-2"
                      variant={
                        product.status === "active"
                          ? "default"
                          : product.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <CardHeader className="m-0">
                    <CardTitle className="flex justify-between items-start">
                      {/* Wrap the product name in a Link to navigate to /product/{product.id} */}
                      <Link
                        href={`/product/${product.id}`}
                        className="text-xl truncate w-full"
                      >
                        {product.name}
                      </Link>
                    </CardTitle>
                    <span className="text-sm">${product.price.toFixed(2)}</span>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      {/* Uncomment to enable edit/delete actions */}
                      {/*
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(product.id)}>
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                      */}
                    </div>
                    <div className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition w-full rounded-xl">
                      <Link href={`/swipe/${product.id}`}>Go to Swiper</Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

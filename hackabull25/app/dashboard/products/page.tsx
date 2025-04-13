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
    <div className="h-screen w-4/5 bg-gray-50 flex flex-col relative overflow-scroll">
      {/* Main Content */}
      <div className="p-6">
        <div className="w-full mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <AddItemDialog />
        </div>
        <hr className="mt-6" />
      </div>

      <div className="max-full px-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>
                <div className="px-4 my-4">
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
                </div>
                <CardContent>
                  <div className="flex justify-between items-start w-full">
                    <Link
                      className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition w-full rounded-xl"
                      href={`/swipe/${product.id}`}
                    >
                      Go to Swiper
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

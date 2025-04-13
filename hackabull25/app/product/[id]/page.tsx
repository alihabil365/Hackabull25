"use client";

// React
import { use, useEffect, useState, useTransition } from "react";

// Next
import Image from "next/image";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Server Actions
import getItem from "@/actions/getItem";

// Lucide
import { WandSparkles } from "lucide-react";

// Drawer
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

// Clerk
import { useUser } from "@clerk/nextjs";

// Supabase
import { createClient } from "@/utils/supabase/client";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // State
  const [product, setProduct] = useState<any>(undefined);
  const [userProducts, setUserProducts] = useState<any[]>([]);

  // Clerk User
  const { user } = useUser();

  // Params
  const { id } = use(params);

  // Transitions
  const [isPending, startTransition] = useTransition();

  // Effects
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
        console.error(
          "[Supabase] Error fetching user products:",
          error.message
        );
      } else {
        setUserProducts(data || []);
      }
    };

    fetchUserProducts();
  }, [user]);

  if (product) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        {/* Left Side */}
        <div className="h-screen w-1/2 relative overflow-hidden">
          <Image
            src={product.image}
            alt="product-img"
            fill={true}
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
            Actual market valuation according to AI: $10.00
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
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>My Products</DrawerTitle>
                <DrawerDescription>
                  {userProducts.length > 0 ? (
                    <ul className="space-y-2">
                      {userProducts.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">
                      You haven't uploaded any products yet.
                    </p>
                  )}
                </DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    );
  }
}

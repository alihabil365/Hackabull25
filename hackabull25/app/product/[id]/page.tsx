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

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // State
  const [product, setProduct] = useState(undefined);

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
          <Button className="bg-pink-500 cursor-pointer">Place Bid</Button>
        </div>
      </div>
    );
  }
}

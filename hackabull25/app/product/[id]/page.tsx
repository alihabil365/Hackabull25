"use client";

// React
import { use, useEffect, useState, useTransition } from "react";

// Next
import Image from "next/image";

// Components
// import ProductClientPage from "@/components/ProductClientPage";
import { Badge } from "@/components/ui/badge";

// Server Actions
import getItem from "@/actions/getItem";
// import LoadingCircleSpinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
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
          <hr className="opacity-50" />
          <p>{product.description}</p>
          <Button className="bg-pink-500 cursor-pointer">Place Bid</Button>
        </div>
      </div>
    );
  }
}

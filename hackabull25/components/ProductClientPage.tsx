'use client';

import { useEffect, useState } from 'react';
import ProductDetail from '@/components/productDetail';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductClientPage({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error(error.message);
      else setProduct(data);

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  if (!product) return <p className="text-center mt-8 text-red-500">Product not found.</p>;

  const productData = {
    id: product.id,
    title: product.name,
    price: product.price,
    originalPrice: product.price * 1.2,
    location: 'Unknown',
    description: product.description,
    images: [product.image],
    condition: 'Good',
    seller: {
      name: 'Anonymous',
      profileImage: '/default-profile.png',
      rating: 4.8,
    },
  };

  return <ProductDetail {...productData} />;
}

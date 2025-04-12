'use client';

import { useEffect, useState } from 'react';
import SwipeCard from './SwipeCard';
import { createClient } from '@supabase/supabase-js';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type SwipeItem = {
  id: string;
  title: string;
  description: string;
  value: number;
  image: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SwipeClient() {
  const [items, setItems] = useState<SwipeItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('[Supabase] Error fetching products:', error.message);
      } else if (data) {
        const mapped = data.map((product: Product) => ({
          id: product.id.toString(),
          title: product.name,
          description: product.description,
          value: product.price,
          image: product.image,
        }));
        setItems(mapped);
      }
    };

    fetchItems();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Barter Matchmaker</h1>
      {items.length > 0 ? (
        <SwipeCard items={items} />
      ) : (
        <p className="text-gray-400">Loading items from Supabase...</p>
      )}
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import SwipeCard from '../../components/SwipeCard';

type ProductFromDB = {
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

export default function SwipePage() {
  const [items, setItems] = useState<SwipeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('[Supabase] Error:', error.message);
      } else if (data) {
        const mapped: SwipeItem[] = data.map((item: ProductFromDB) => ({
          id: item.id.toString(),
          title: item.name,
          description: item.description,
          value: item.price,
          image: item.image,
        }));
        setItems(mapped);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Barter Matchmaker</h1>
      {loading ? (
        <p className="text-gray-400">Loading items from Supabase...</p>
      ) : items.length > 0 ? (
        <SwipeCard items={items} />
      ) : (
        <p className="text-red-400">No items found in Supabase.</p>
      )}
    </main>
  );
}

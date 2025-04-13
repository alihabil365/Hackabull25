'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WishlistClient() {
  const { user } = useUser();
  const userId = user?.id;
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id, products(*)')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching wishlist:', error.message);
      } else {
        const items = data.map((entry: any) => entry.products);
        setWishlistItems(items);
      }

      setLoading(false);
    };

    fetchWishlistItems();
  }, [userId]);

  if (!userId) {
    return <p className="text-center p-6 text-gray-600">Please sign in to view your wishlist.</p>;
  }

  if (loading) {
    return <p className="text-center p-6 text-gray-600">Loading wishlist...</p>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">Your wishlist is empty.</p>
        <Link href="/explore" className="mt-4 inline-block text-blue-600 hover:underline">
          Go explore items
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Link key={item.id} href={`/product/${item.id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden">
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={item.image || '/next.svg'}
                  alt={item.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-black">${item.price.toLocaleString()}</h2>
                <h3 className="text-lg text-black">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.location}</p>
          
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    const { error } = await supabase
                      .from('wishlists')
                      .delete()
                      .match({ user_id: userId, product_id: item.id });
          
                    if (!error) {
                      setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
                    } else {
                      console.error('Error removing item:', error.message);
                    }
                  }}
                  className="mt-4 inline-block text-red-600 hover:underline text-sm"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </Link>
          
          ))}
        </div>
      </div>
    </div>
  );
}

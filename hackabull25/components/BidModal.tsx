'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';

export default function BidDrawer({ targetItemId }: { targetItemId: string }) {
  const { user } = useUser();
  const supabase = createClient();
  const [userItems, setUserItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id);

      if (error) console.error('Error loading items:', error.message);
      else setUserItems(data || []);
    };

    fetchUserItems();
  }, [user?.id]);

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button className="bg-pink-500 text-white">Place a Bid</Button>
      </DrawerTrigger>

      <DrawerContent className="p-6 max-h-[80vh] overflow-y-auto rounded-t-xl border-t">
        <DrawerHeader>
          <DrawerTitle>Choose an item to offer</DrawerTitle>
          <DrawerDescription>This will create a trade offer for this product.</DrawerDescription>
        </DrawerHeader>

        {/* Scrollable card list */}
        <div className="flex overflow-x-auto gap-4 py-4 px-2">
        {userItems.map((item) => (
        <div
          key={item.id}
          className="min-w-[200px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border flex-shrink-0"
        >
          <div className="relative h-40 w-full bg-gray-100">
            <Image
              src={item.image || '/next.svg'}
              alt={item.name}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-semibold text-black">{item.name}</h2>
            <p className="text-gray-600 text-sm">${item.price}</p>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={async () => {
                if (!user?.id) return alert("Must be signed in to place bid.");

                const { error } = await supabase.from('bids').insert({
                  bidder_id: user.id,
                  offered_item_id: item.id,
                  target_item_id: targetItemId,
                  status: 'pending',
                });

                if (error) {
                  console.error('Error placing bid:', error.message);
                  alert('Failed to place bid.');
                } else {
                  alert('Bid placed successfully!');
                }
              }}
            >
              Bid Item
            </Button>
          </div>
        </div>
      ))}


          {/* Add Item Box */}
          <div
            onClick={() => console.log('TODO: Add item modal')}
            className="min-w-[200px] flex flex-col justify-center items-center bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-gray-200 flex-shrink-0"
          >
            <p className="text-2xl font-bold text-gray-600">＋</p>
            <p className="text-sm text-gray-500">Add Item</p>
          </div>
        </div>

        <DrawerFooter>
          <Button disabled>Submit Trade Offer</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
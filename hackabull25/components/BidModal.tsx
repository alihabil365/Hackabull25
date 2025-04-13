'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface BidModalProps {
  targetItemId: string;
}

export default function BidModal({ targetItemId }: BidModalProps) {
  const { user } = useUser();
  const supabase = createClient();
  const [userItems, setUserItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');


  
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id); // Make sure your `products` table has an `owner_id` field

      if (error) {
        console.error('Error fetching user items:', error.message);
      } else {
        setUserItems(data);
      }
    };

    fetchUserItems();
  }, [user?.id, supabase]);

  const submitBid = async () => {
    if (!selectedItemId || !user?.id) {
      toast.error('Please select an item to offer.');
      return;

      
    }

    const { error } = await supabase.from('bids').insert({
      offered_item_id: selectedItemId,
      target_item_id: targetItemId,
      bidder_id: user.id,
    });
    

    if (error) {
      toast.error('Failed to submit bid');
      console.error(error.message);
    } else {
      toast.success('Bid submitted!');
      setSelectedItemId('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          Make a Trade Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Select an Item to Offer</h2>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
        >
          <option value="">-- Select one of your items --</option>
          {userItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price})
            </option>
          ))}
        </select>
        <Button onClick={submitBid} className="w-full bg-blue-600 text-white">
          Submit Trade Offer
        </Button>
      </DialogContent>
    </Dialog>
  );
}

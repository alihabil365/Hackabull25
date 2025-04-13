'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import AddItemComponent from '@/app/dashboard/components/AddItemComponent';
interface AddItemComponentProps {
    onItemCreated?: (itemId: string) => void;
  }
  
interface BidModalProps {
  targetItemId: string;
}

export default function BidModal({ targetItemId }: BidModalProps) {
  const { user } = useUser();
  const supabase = createClient();

  const [userItems, setUserItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [addingNewItem, setAddingNewItem] = useState(false);
  const [refreshItems, setRefreshItems] = useState(false);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id);

      if (error) console.error('Error fetching user items:', error.message);
      else setUserItems(data);
    };

    fetchUserItems();
  }, [user?.id, refreshItems]);

  const submitBid = async () => {
    if (!selectedItemId || !user?.id) {
      toast.error('Please select or add an item to offer.');
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
      setAddingNewItem(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          Make a Trade Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white p-6 space-y-6 max-w-lg">
        <h2 className="text-xl font-semibold">Offer an Item for Trade</h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Select one of your existing items or add a new one:
            </p>
            <button
              onClick={() => setAddingNewItem(!addingNewItem)}
              className="text-blue-600 text-sm underline"
            >
              {addingNewItem ? '← Cancel' : '+ Add New Item'}
            </button>
          </div>

          {addingNewItem ? (
            <div className="border p-4 rounded-md bg-gray-50">
              <AddItemComponent
              
                onItemCreated={(itemId: string) => {
                  setSelectedItemId(itemId);
                  setAddingNewItem(false);
                  setRefreshItems((r) => !r); // Trigger re-fetch
                  toast.success('Item added! Now ready to submit bid.');
                }}
              />
            </div>
          ) : (
            <select
              className="w-full p-2 border rounded"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              <option value="">-- Select your item --</option>
              {userItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (${item.price})
                </option>
              ))}
            </select>
          )}
        </div>

        <Button
          onClick={submitBid}
          className="w-full bg-blue-600 text-white"
          disabled={!selectedItemId}
        >
          Submit Trade Offer
        </Button>
      </DialogContent>
    </Dialog>
  );
}

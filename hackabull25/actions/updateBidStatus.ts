"use server";

import { createClient } from "@/utils/supabase/server";
import createNotification from "./createNotification";

type BidStatus = "pending" | "accepted" | "rejected";

export default async function updateBidStatus(
  bidId: string,
  newStatus: BidStatus,
  bidderUserId: string,
  ownerUserId: string,
  itemName: string,
  offeredItemName: string
) {
  const supabase = await createClient();

  // Update bid status
  const { error: updateError } = await supabase
    .from("bids")
    .update({ status: newStatus })
    .eq("id", bidId);

  if (updateError) {
    console.error("Error updating bid status:", updateError);
    return false;
  }

  // Create notification for the bidder
  const notificationTitle = newStatus === "accepted" 
    ? "Bid Accepted!"
    : "Bid Rejected";
  
  const notificationBody = newStatus === "accepted"
    ? `Your offer of ${offeredItemName} for ${itemName} has been accepted!`
    : `Your offer of ${offeredItemName} for ${itemName} has been rejected.`;

  await createNotification(
    bidderUserId,
    newStatus === "accepted" ? "match" : "bid",
    notificationTitle,
    notificationBody
  );

  return true;
} 
"use server";

import { createClient } from "@/utils/supabase/server";

type NotificationType = "bid" | "match" | "message" | "system";

export default async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      title,
      body,
    })
    .select();

  if (error) {
    console.error("Error creating notification:", error);
    return null;
  }

  return data[0];
} 
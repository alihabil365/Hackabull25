"use server";

import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";

export default async function createItem(
  name: string,
  description: string,
  price: string,
  imageUrl: string
) {
  console.log("hello world");

  const supabase = await createClient();
  const { userId } = await auth(); // ✅ Fix: Await the auth() call

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price: parseFloat(price),
      image: imageUrl,
      userId: userId, // ✅ Now works correctly
    })
    .select();

  console.log(data);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return;
  } else {
    return data;
  }
}

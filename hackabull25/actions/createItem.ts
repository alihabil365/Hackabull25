"use server";

import { createClient } from "@/utils/supabase/server";

export default async function createItem(
  name: String,
  description: String,
  price: String,
  imageUrl: string
) {
  console.log("hello world");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: name,
      description: description,
      price: price,
      image: imageUrl,
    })
    .select();

  console.log(data);

  if (error) {
    console.log(error);
    return;
  } else {
    return data;
  }
}

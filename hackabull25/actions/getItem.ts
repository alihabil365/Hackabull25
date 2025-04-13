"use server";

import { createClient } from "@/utils/supabase/server";

export default async function getItem(id: String) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        user:users (
          id,
          emailAddress,
          firstName,
          lastName,
          imageUrl
        )
      `
    )
    .eq("id", id)
    .single();

  console.log(data);

  if (error) console.log(error);
  else return data;
}

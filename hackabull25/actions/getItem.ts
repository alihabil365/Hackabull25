"use server";

import { createClient } from "@/utils/supabase/server";

export default async function getItem(id: String) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) console.log(error);
  else return data;
}

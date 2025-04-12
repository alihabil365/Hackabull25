"use server";

import { createClient } from "@/utils/supabase/server";

export default async function uploadImageToSupabase(file: File) {
  const supabase = await createClient();

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("productimages")
    .upload(fileName, file);

  if (error) {
    console.log(error);
    return null;
  } else {
    return data;
  }
}

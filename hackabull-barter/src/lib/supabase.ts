import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export type Item = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  estimated_value: number;
  desired_items: string[];
  created_at: string;
};

export type Match = {
  id: string;
  item_a_id: string;
  item_b_id: string;
  matched_at: string;
  status: 'pending' | 'accepted' | 'declined';
  item_a?: Item;
  item_b?: Item;
}; 
-- Create the items table
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    estimated_value DECIMAL(10, 2) NOT NULL,
    desired_items TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create the matches table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_a_id UUID NOT NULL,
    item_b_id UUID NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_item_a FOREIGN KEY (item_a_id) REFERENCES public.items(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_b FOREIGN KEY (item_b_id) REFERENCES public.items(id) ON DELETE CASCADE
);

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('item-images', 'item-images', true, 5242880, -- 5MB limit
        '{image/png,image/jpeg,image/gif,image/webp}'
);

-- Set up row-level security policies
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Everyone can view all items
CREATE POLICY "Anyone can view all items" ON public.items
    FOR SELECT USING (true);

-- Only authenticated users can insert items, and they can only insert their own
CREATE POLICY "Authenticated users can insert their own items" ON public.items
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only update and delete their own items
CREATE POLICY "Users can update their own items" ON public.items
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own items" ON public.items
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Set up RLS for matches table
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Anyone can view matches, but in the app we'll filter by user
CREATE POLICY "Anyone can view all matches" ON public.matches
    FOR SELECT USING (true);

-- Only authenticated users can insert matches
CREATE POLICY "Authenticated users can insert matches" ON public.matches
    FOR INSERT TO authenticated WITH CHECK (true);

-- Users can only update matches where they own one of the items
CREATE POLICY "Users can update matches for their items" ON public.matches
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.items 
            WHERE (items.id = matches.item_a_id OR items.id = matches.item_b_id) 
            AND items.user_id = auth.uid()
        )
    );

-- Set up storage permissions
CREATE POLICY "Authenticated users can upload item images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'item-images' AND 
        -- Only allow authenticated users to upload with their user ID prefix
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Everyone can view item images
CREATE POLICY "Anyone can view item images" ON storage.objects
    FOR SELECT USING (bucket_id = 'item-images');

-- Users can only update and delete their own images
CREATE POLICY "Users can update their own item images" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id = 'item-images' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own item images" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id = 'item-images' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_estimated_value ON public.items(estimated_value);
CREATE INDEX IF NOT EXISTS idx_matches_item_a_id ON public.matches(item_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_item_b_id ON public.matches(item_b_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status); 
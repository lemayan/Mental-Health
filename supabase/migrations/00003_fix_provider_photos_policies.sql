-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own provider photos" ON storage.objects;

-- Create storage bucket for provider photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-photos', 'provider-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up NEW storage policies that allow anonymous uploads
-- This is necessary because users aren't authenticated when creating profiles

-- Allow public read access
CREATE POLICY "Public read access for provider photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-photos');

-- Allow ANYONE to upload (change from authenticated to public)
CREATE POLICY "Anyone can upload provider photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'provider-photos');

-- Allow anyone to update photos in this bucket
CREATE POLICY "Anyone can update provider photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'provider-photos');

-- Allow anyone to delete photos in this bucket
CREATE POLICY "Anyone can delete provider photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'provider-photos');

-- Add photo_url column to providers table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE providers ADD COLUMN photo_url TEXT;
  END IF;
END $$;

-- Add comment
COMMENT ON COLUMN providers.photo_url IS 'URL to provider profile photo stored in Supabase Storage';

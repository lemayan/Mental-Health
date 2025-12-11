-- Create storage bucket for provider photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-photos', 'provider-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for provider photos
-- Allow public read access
CREATE POLICY "Public read access for provider photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload provider photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'provider-photos' AND auth.role() = 'authenticated');

-- Allow users to update their own photos
CREATE POLICY "Users can update their own provider photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'provider-photos' AND auth.role() = 'authenticated');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own provider photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'provider-photos' AND auth.role() = 'authenticated');

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

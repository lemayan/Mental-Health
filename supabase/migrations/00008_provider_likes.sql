-- Create provider_likes table
CREATE TABLE IF NOT EXISTS provider_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  user_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_provider_likes_provider_id ON provider_likes(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_likes_created_at ON provider_likes(created_at);

-- Enable RLS
ALTER TABLE provider_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert likes
CREATE POLICY "Allow public likes"
ON provider_likes
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Anyone can view likes
CREATE POLICY "Allow viewing likes"
ON provider_likes
FOR SELECT
TO public
USING (true);

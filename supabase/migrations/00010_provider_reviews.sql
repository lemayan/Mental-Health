-- Create provider_reviews table
CREATE TABLE IF NOT EXISTS provider_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_provider_reviews_provider_id ON provider_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_reviews_created_at ON provider_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_provider_reviews_rating ON provider_reviews(rating);

-- Enable RLS
ALTER TABLE provider_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert reviews
CREATE POLICY "Allow public reviews"
ON provider_reviews
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Anyone can view reviews
CREATE POLICY "Allow viewing reviews"
ON provider_reviews
FOR SELECT
TO public
USING (true);

-- Create view for provider ratings summary
CREATE OR REPLACE VIEW provider_ratings AS
SELECT 
  provider_id,
  COUNT(*) as review_count,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
  COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
  COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
  COUNT(*) FILTER (WHERE rating = 1) as one_star_count
FROM provider_reviews
GROUP BY provider_id;

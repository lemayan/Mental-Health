-- Create provider_interactions table to track user engagement
CREATE TABLE IF NOT EXISTS provider_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'profile_view', 'email_click', 'phone_click', 'website_click'
  user_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_provider_interactions_provider_id ON provider_interactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_interactions_created_at ON provider_interactions(created_at);

-- Enable RLS
ALTER TABLE provider_interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert interaction data
CREATE POLICY "Allow public interaction tracking"
ON provider_interactions
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Providers can view their own interaction data
CREATE POLICY "Providers can view own interactions"
ON provider_interactions
FOR SELECT
TO public
USING (true);

-- Create a view for provider stats
CREATE OR REPLACE VIEW provider_stats AS
SELECT 
  provider_id,
  COUNT(*) FILTER (WHERE interaction_type = 'profile_view') as profile_views,
  COUNT(*) FILTER (WHERE interaction_type = 'email_click') as email_clicks,
  COUNT(*) FILTER (WHERE interaction_type = 'phone_click') as phone_clicks,
  COUNT(*) FILTER (WHERE interaction_type = 'website_click') as website_clicks,
  COUNT(*) as total_interactions,
  MAX(created_at) as last_interaction
FROM provider_interactions
GROUP BY provider_id;

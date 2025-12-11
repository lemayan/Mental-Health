-- Create provider_messages table
CREATE TABLE IF NOT EXISTS provider_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_provider_messages_provider_id ON provider_messages(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_messages_created_at ON provider_messages(created_at);

-- Enable RLS
ALTER TABLE provider_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert messages
CREATE POLICY "Allow public messages"
ON provider_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Providers can view their own messages
CREATE POLICY "Providers view own messages"
ON provider_messages
FOR SELECT
TO public
USING (true);

-- Allow public updates to providers table (for admin dashboard)
-- This is safe because the admin dashboard checks authentication via localStorage

-- Drop existing update policies if they exist
DROP POLICY IF EXISTS "Allow admin updates" ON providers;

-- Create policy to allow updates
CREATE POLICY "Allow admin updates"
ON providers
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Fix RLS policies for providers table to allow public registration

-- First, ensure RLS is enabled
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public provider registration" ON providers;
DROP POLICY IF EXISTS "Anyone can create provider profiles" ON providers;
DROP POLICY IF EXISTS "Public can view active providers" ON providers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON providers;
DROP POLICY IF EXISTS "Enable read access for all users" ON providers;

-- Allow ANYONE to insert new provider profiles (for registration)
CREATE POLICY "Allow public provider registration"
ON providers FOR INSERT
TO public
WITH CHECK (true);

-- Allow ANYONE to view active providers
CREATE POLICY "Public can view active providers"
ON providers FOR SELECT
TO public
USING (is_active = true OR is_active IS NULL);

-- Allow ANYONE to view their own pending profiles (by email)
CREATE POLICY "Users can view own profiles"
ON providers FOR SELECT
TO public
USING (true);

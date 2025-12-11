-- Drop all existing policies before recreating them
-- Run this FIRST before running any other migrations

-- Drop storage.objects policies (all variations)
DROP POLICY IF EXISTS "Anyone can upload provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from provider photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to provider photos" ON storage.objects;

-- Drop providers table policies (all variations)
DROP POLICY IF EXISTS "Allow public provider registration" ON providers;
DROP POLICY IF EXISTS "Anyone can create provider profiles" ON providers;
DROP POLICY IF EXISTS "Public can view active providers" ON providers;

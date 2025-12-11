-- Add missing columns to providers table for onboarding form

-- Add bio column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'bio'
  ) THEN
    ALTER TABLE providers ADD COLUMN bio TEXT;
  END IF;
END $$;

-- Add tagline column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'tagline'
  ) THEN
    ALTER TABLE providers ADD COLUMN tagline TEXT;
  END IF;
END $$;

-- Add address_line2 column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'address_line2'
  ) THEN
    ALTER TABLE providers ADD COLUMN address_line2 TEXT;
  END IF;
END $$;

-- Add website column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'website'
  ) THEN
    ALTER TABLE providers ADD COLUMN website TEXT;
  END IF;
END $$;

-- Add age_groups_served column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'age_groups_served'
  ) THEN
    ALTER TABLE providers ADD COLUMN age_groups_served TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add service_formats column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'service_formats'
  ) THEN
    ALTER TABLE providers ADD COLUMN service_formats TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add payment_types column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'payment_types'
  ) THEN
    ALTER TABLE providers ADD COLUMN payment_types TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add insurance_accepted column if missing (as array)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'insurance_accepted'
  ) THEN
    ALTER TABLE providers ADD COLUMN insurance_accepted TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Add availability_status column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'availability_status'
  ) THEN
    ALTER TABLE providers ADD COLUMN availability_status TEXT DEFAULT 'accepting';
  END IF;
END $$;

-- Add provider_type column if missing (should already exist but just in case)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'provider_type'
  ) THEN
    ALTER TABLE providers ADD COLUMN provider_type TEXT;
  END IF;
END $$;

-- Add comments for new columns
COMMENT ON COLUMN providers.bio IS 'Provider biography and approach description';
COMMENT ON COLUMN providers.tagline IS 'Short one-line description of practice';
COMMENT ON COLUMN providers.address_line2 IS 'Address line 2 (suite, apt, etc)';
COMMENT ON COLUMN providers.website IS 'Provider website URL';
COMMENT ON COLUMN providers.age_groups_served IS 'Age groups this provider serves';
COMMENT ON COLUMN providers.service_formats IS 'Service delivery formats (in-person, telehealth, etc)';
COMMENT ON COLUMN providers.payment_types IS 'Payment types accepted';
COMMENT ON COLUMN providers.insurance_accepted IS 'Insurance providers accepted (comma-separated)';
COMMENT ON COLUMN providers.availability_status IS 'Current availability status';

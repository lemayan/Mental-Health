-- Baltimore Mental Health Navigator
-- Initial Database Schema Migration
-- 
-- This migration creates all tables, indexes, relationships, and RLS policies
-- for the Baltimore Mental Health Navigator platform.

-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For location queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- =============================================================================
-- CUSTOM TYPES (ENUMS)
-- =============================================================================

-- Provider Types
CREATE TYPE provider_type AS ENUM (
  'therapist',
  'psychiatrist',
  'psychologist',
  'counselor',
  'social_worker',
  'nurse_practitioner',
  'peer_specialist'
);

-- Organization Types
CREATE TYPE organization_type AS ENUM (
  'community_mental_health_center',
  'hospital_clinic',
  'nonprofit',
  'support_group',
  'crisis_center',
  'school_based',
  'faith_based',
  'government',
  'private_practice_group'
);

-- Service Formats
CREATE TYPE service_format AS ENUM (
  'in_person',
  'telehealth',
  'phone',
  'hybrid'
);

-- Payment Types
CREATE TYPE payment_type AS ENUM (
  'medicaid',
  'medicare',
  'private_insurance',
  'sliding_scale',
  'free',
  'self_pay'
);

-- Availability Status
CREATE TYPE availability_status AS ENUM (
  'accepting_new_clients',
  'waitlist',
  'limited_availability',
  'not_accepting'
);

-- Urgency Levels
CREATE TYPE urgency_level AS ENUM (
  'crisis',
  'urgent',
  'soon',
  'moderate',
  'exploring'
);

-- Article Categories
CREATE TYPE article_category AS ENUM (
  'getting_started',
  'paying_for_care',
  'teens_and_families',
  'crisis_and_safety',
  'community_resources',
  'self_care',
  'understanding_conditions'
);

-- User Roles
CREATE TYPE user_role AS ENUM (
  'admin',
  'provider',
  'organization_admin'
);

-- Contact Submission Status
CREATE TYPE contact_status AS ENUM (
  'new',
  'viewed',
  'responded',
  'archived'
);

-- Claim Status
CREATE TYPE claim_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- Verification Methods
CREATE TYPE verification_method AS ENUM (
  'email',
  'npi',
  'manual'
);

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tenants (Multi-tenant support for future city expansion)
-- -----------------------------------------------------------------------------
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default Baltimore tenant
INSERT INTO tenants (name, slug, city, state, settings)
VALUES (
  'Baltimore Mental Health Navigator',
  'baltimore',
  'Baltimore',
  'MD',
  '{
    "crisis_phone": "988",
    "crisis_text": "741741",
    "support_email": "support@baltimoremhn.org"
  }'::jsonb
);

-- -----------------------------------------------------------------------------
-- Neighborhoods
-- -----------------------------------------------------------------------------
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  zip_codes TEXT[] NOT NULL DEFAULT '{}',
  boundary_geojson JSONB,
  center_latitude DECIMAL(10, 8),
  center_longitude DECIMAL(11, 8),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- Create index for neighborhood lookups
CREATE INDEX idx_neighborhoods_tenant ON neighborhoods(tenant_id);
CREATE INDEX idx_neighborhoods_zip_codes ON neighborhoods USING GIN(zip_codes);

-- -----------------------------------------------------------------------------
-- Providers
-- -----------------------------------------------------------------------------
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Basic info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  credentials TEXT[] NOT NULL DEFAULT '{}',
  provider_type provider_type NOT NULL,
  
  -- Profile
  photo_url TEXT,
  tagline TEXT,
  bio TEXT,
  
  -- Contact
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  
  -- Location
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT NOT NULL DEFAULT 'Baltimore',
  state TEXT NOT NULL DEFAULT 'MD',
  zip_code TEXT NOT NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  location GEOGRAPHY(POINT, 4326),  -- PostGIS point for distance queries
  
  -- Services (stored as text arrays for flexibility)
  issues_treated TEXT[] NOT NULL DEFAULT '{}',
  age_groups_served TEXT[] NOT NULL DEFAULT '{}',
  service_formats service_format[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{english}',
  
  -- Payment
  payment_types payment_type[] NOT NULL DEFAULT '{}',
  insurance_accepted TEXT[] NOT NULL DEFAULT '{}',
  sliding_scale_min INTEGER,
  sliding_scale_max INTEGER,
  self_pay_rate INTEGER,
  
  -- Availability
  availability_status availability_status NOT NULL DEFAULT 'accepting_new_clients',
  typical_wait_weeks INTEGER,
  
  -- Metadata
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  claimed_by_user_id UUID,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_verified_at TIMESTAMPTZ,
  
  -- Full-text search
  search_vector TSVECTOR
);

-- Indexes for providers
CREATE INDEX idx_providers_tenant ON providers(tenant_id);
CREATE INDEX idx_providers_zip_code ON providers(zip_code);
CREATE INDEX idx_providers_neighborhood ON providers(neighborhood_id);
CREATE INDEX idx_providers_provider_type ON providers(provider_type);
CREATE INDEX idx_providers_availability ON providers(availability_status);
CREATE INDEX idx_providers_active ON providers(is_active) WHERE is_active = true;
CREATE INDEX idx_providers_verified ON providers(is_verified) WHERE is_verified = true;
CREATE INDEX idx_providers_issues ON providers USING GIN(issues_treated);
CREATE INDEX idx_providers_age_groups ON providers USING GIN(age_groups_served);
CREATE INDEX idx_providers_payment ON providers USING GIN(payment_types);
CREATE INDEX idx_providers_insurance ON providers USING GIN(insurance_accepted);
CREATE INDEX idx_providers_location ON providers USING GIST(location);
CREATE INDEX idx_providers_search ON providers USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION providers_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.first_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.last_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.bio, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.credentials, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER providers_search_update
  BEFORE INSERT OR UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION providers_search_vector_trigger();

-- -----------------------------------------------------------------------------
-- Organizations
-- -----------------------------------------------------------------------------
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  organization_type organization_type NOT NULL,
  
  -- Profile
  logo_url TEXT,
  tagline TEXT,
  description TEXT,
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Services
  services_offered TEXT[] NOT NULL DEFAULT '{}',
  issues_addressed TEXT[] NOT NULL DEFAULT '{}',
  age_groups_served TEXT[] NOT NULL DEFAULT '{}',
  service_formats service_format[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{english}',
  
  -- Payment
  payment_types payment_type[] NOT NULL DEFAULT '{}',
  insurance_accepted TEXT[] NOT NULL DEFAULT '{}',
  is_free BOOLEAN NOT NULL DEFAULT false,
  
  -- Access
  accepts_walk_ins BOOLEAN NOT NULL DEFAULT false,
  referral_required BOOLEAN NOT NULL DEFAULT false,
  how_to_access TEXT,
  
  -- Operating hours (JSON structure)
  operating_hours JSONB,
  
  -- Metadata
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Full-text search
  search_vector TSVECTOR
);

-- Indexes for organizations
CREATE INDEX idx_organizations_tenant ON organizations(tenant_id);
CREATE INDEX idx_organizations_type ON organizations(organization_type);
CREATE INDEX idx_organizations_active ON organizations(is_active) WHERE is_active = true;
CREATE INDEX idx_organizations_free ON organizations(is_free) WHERE is_free = true;
CREATE INDEX idx_organizations_walk_ins ON organizations(accepts_walk_ins) WHERE accepts_walk_ins = true;
CREATE INDEX idx_organizations_issues ON organizations USING GIN(issues_addressed);
CREATE INDEX idx_organizations_age_groups ON organizations USING GIN(age_groups_served);
CREATE INDEX idx_organizations_payment ON organizations USING GIN(payment_types);
CREATE INDEX idx_organizations_search ON organizations USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION organizations_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.services_offered, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_search_update
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION organizations_search_vector_trigger();

-- -----------------------------------------------------------------------------
-- Organization Locations
-- -----------------------------------------------------------------------------
CREATE TABLE organization_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  name TEXT,  -- "Main Office", "East Baltimore Branch"
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL DEFAULT 'Baltimore',
  state TEXT NOT NULL DEFAULT 'MD',
  zip_code TEXT NOT NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  location GEOGRAPHY(POINT, 4326),
  
  phone TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for organization locations
CREATE INDEX idx_org_locations_org ON organization_locations(organization_id);
CREATE INDEX idx_org_locations_zip ON organization_locations(zip_code);
CREATE INDEX idx_org_locations_location ON organization_locations USING GIST(location);

-- -----------------------------------------------------------------------------
-- Articles (Resource Hub)
-- -----------------------------------------------------------------------------
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,  -- Markdown
  
  category article_category NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  
  featured_image_url TEXT,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  
  author_name TEXT,
  author_id UUID,
  
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  search_vector TSVECTOR,
  
  UNIQUE(tenant_id, slug)
);

-- Indexes for articles
CREATE INDEX idx_articles_tenant ON articles(tenant_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(is_published, published_at DESC) WHERE is_published = true;
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION articles_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_update
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION articles_search_vector_trigger();

-- -----------------------------------------------------------------------------
-- Navigator Responses
-- -----------------------------------------------------------------------------
CREATE TABLE navigator_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Answers
  primary_concern TEXT NOT NULL,
  help_for TEXT NOT NULL,  -- 'adult', 'teen', 'child', 'couple', 'family'
  urgency urgency_level NOT NULL,
  service_format TEXT NOT NULL,  -- 'in_person', 'online', 'either'
  payment_type payment_type NOT NULL,
  insurance_provider TEXT,
  zip_code TEXT NOT NULL,
  
  -- Optional preferences
  provider_gender_preference TEXT,
  language_preference TEXT,
  open_to_community_programs BOOLEAN NOT NULL DEFAULT true,
  
  -- Session tracking
  session_id TEXT NOT NULL,
  user_id UUID,
  
  -- Results
  results_viewed BOOLEAN NOT NULL DEFAULT false,
  results_count INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for navigator responses
CREATE INDEX idx_navigator_tenant ON navigator_responses(tenant_id);
CREATE INDEX idx_navigator_session ON navigator_responses(session_id);
CREATE INDEX idx_navigator_created ON navigator_responses(created_at DESC);
CREATE INDEX idx_navigator_urgency ON navigator_responses(urgency);

-- -----------------------------------------------------------------------------
-- Contact Submissions
-- -----------------------------------------------------------------------------
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Source (one of these will be set)
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  
  -- Context
  navigator_response_id UUID REFERENCES navigator_responses(id) ON DELETE SET NULL,
  
  -- Status
  status contact_status NOT NULL DEFAULT 'new',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure at least one target
  CONSTRAINT contact_has_target CHECK (provider_id IS NOT NULL OR organization_id IS NOT NULL)
);

-- Indexes for contact submissions
CREATE INDEX idx_contacts_tenant ON contact_submissions(tenant_id);
CREATE INDEX idx_contacts_provider ON contact_submissions(provider_id);
CREATE INDEX idx_contacts_organization ON contact_submissions(organization_id);
CREATE INDEX idx_contacts_status ON contact_submissions(status);
CREATE INDEX idx_contacts_created ON contact_submissions(created_at DESC);

-- -----------------------------------------------------------------------------
-- Users (Supabase Auth integration)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'provider',
  
  first_name TEXT,
  last_name TEXT,
  
  -- Linked entities
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Indexes for users
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_provider ON users(provider_id);
CREATE INDEX idx_users_organization ON users(organization_id);

-- -----------------------------------------------------------------------------
-- Provider Claims
-- -----------------------------------------------------------------------------
CREATE TABLE provider_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Verification
  verification_email TEXT NOT NULL,
  verification_method verification_method NOT NULL DEFAULT 'email',
  
  status claim_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id)
);

-- Indexes for provider claims
CREATE INDEX idx_claims_tenant ON provider_claims(tenant_id);
CREATE INDEX idx_claims_provider ON provider_claims(provider_id);
CREATE INDEX idx_claims_user ON provider_claims(user_id);
CREATE INDEX idx_claims_status ON provider_claims(status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigator_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_claims ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Public read access policies (for anonymous users)
-- -----------------------------------------------------------------------------

-- Tenants - public read
CREATE POLICY "Tenants are viewable by everyone" ON tenants
  FOR SELECT USING (is_active = true);

-- Neighborhoods - public read
CREATE POLICY "Neighborhoods are viewable by everyone" ON neighborhoods
  FOR SELECT USING (is_active = true);

-- Providers - public read for active, verified
CREATE POLICY "Active providers are viewable by everyone" ON providers
  FOR SELECT USING (is_active = true);

-- Organizations - public read for active
CREATE POLICY "Active organizations are viewable by everyone" ON organizations
  FOR SELECT USING (is_active = true);

-- Organization locations - public read
CREATE POLICY "Organization locations are viewable by everyone" ON organization_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE organizations.id = organization_locations.organization_id 
      AND organizations.is_active = true
    )
  );

-- Articles - public read for published
CREATE POLICY "Published articles are viewable by everyone" ON articles
  FOR SELECT USING (is_published = true);

-- Navigator responses - users can create
CREATE POLICY "Anyone can create navigator responses" ON navigator_responses
  FOR INSERT WITH CHECK (true);

-- Contact submissions - users can create
CREATE POLICY "Anyone can create contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Admin policies
-- -----------------------------------------------------------------------------

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admins can do everything
CREATE POLICY "Admins have full access to providers" ON providers
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to organizations" ON organizations
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to organization_locations" ON organization_locations
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to articles" ON articles
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to navigator_responses" ON navigator_responses
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to contact_submissions" ON contact_submissions
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to users" ON users
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to provider_claims" ON provider_claims
  FOR ALL USING (is_admin());

-- -----------------------------------------------------------------------------
-- Provider-specific policies
-- -----------------------------------------------------------------------------

-- Providers can view and update their own profile
CREATE POLICY "Providers can view their own profile" ON providers
  FOR SELECT USING (
    claimed_by_user_id = auth.uid()
  );

CREATE POLICY "Providers can update their own profile" ON providers
  FOR UPDATE USING (
    claimed_by_user_id = auth.uid()
  );

-- Providers can view their own contact submissions
CREATE POLICY "Providers can view their contact submissions" ON contact_submissions
  FOR SELECT USING (
    provider_id IN (
      SELECT id FROM providers WHERE claimed_by_user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their contact submissions" ON contact_submissions
  FOR UPDATE USING (
    provider_id IN (
      SELECT id FROM providers WHERE claimed_by_user_id = auth.uid()
    )
  );

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to calculate distance between two points (in miles)
CREATE OR REPLACE FUNCTION distance_miles(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN ST_Distance(
    ST_MakePoint(lon1, lat1)::geography,
    ST_MakePoint(lon2, lat2)::geography
  ) / 1609.344;  -- Convert meters to miles
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get default tenant ID (Baltimore)
CREATE OR REPLACE FUNCTION get_default_tenant_id() RETURNS UUID AS $$
BEGIN
  RETURN (SELECT id FROM tenants WHERE slug = 'baltimore' LIMIT 1);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_org_locations_updated_at BEFORE UPDATE ON organization_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_provider_claims_updated_at BEFORE UPDATE ON provider_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- SEED DATA: Baltimore Neighborhoods
-- =============================================================================

-- Insert Baltimore neighborhoods
INSERT INTO neighborhoods (tenant_id, name, slug, zip_codes) VALUES
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Downtown', 'downtown', ARRAY['21201', '21202']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Inner Harbor', 'inner-harbor', ARRAY['21202', '21230']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Fells Point', 'fells-point', ARRAY['21231']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Canton', 'canton', ARRAY['21224']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Federal Hill', 'federal-hill', ARRAY['21230']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Mount Vernon', 'mount-vernon', ARRAY['21201', '21202']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Charles Village', 'charles-village', ARRAY['21218']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Hampden', 'hampden', ARRAY['21211']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Roland Park', 'roland-park', ARRAY['21210']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Guilford', 'guilford', ARRAY['21218']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Homeland', 'homeland', ARRAY['21212']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Northwood', 'northwood', ARRAY['21212', '21239']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Waverly', 'waverly', ARRAY['21218']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Remington', 'remington', ARRAY['21211']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Station North', 'station-north', ARRAY['21201', '21218']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Patterson Park', 'patterson-park', ARRAY['21224', '21231']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Highlandtown', 'highlandtown', ARRAY['21224']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Greektown', 'greektown', ARRAY['21224']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'East Baltimore', 'east-baltimore', ARRAY['21205', '21213', '21224']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'West Baltimore', 'west-baltimore', ARRAY['21216', '21217', '21223']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'North Baltimore', 'north-baltimore', ARRAY['21210', '21211', '21212']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'South Baltimore', 'south-baltimore', ARRAY['21225', '21230']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Brooklyn', 'brooklyn', ARRAY['21225']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Locust Point', 'locust-point', ARRAY['21230']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Pigtown', 'pigtown', ARRAY['21230']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Upton', 'upton', ARRAY['21217']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Penn North', 'penn-north', ARRAY['21217']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Mondawmin', 'mondawmin', ARRAY['21215', '21216']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Belair-Edison', 'belair-edison', ARRAY['21213', '21214']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Hamilton', 'hamilton', ARRAY['21214']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Lauraville', 'lauraville', ARRAY['21214']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Towson', 'towson', ARRAY['21204', '21286']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Dundalk', 'dundalk', ARRAY['21222']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Essex', 'essex', ARRAY['21221']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Catonsville', 'catonsville', ARRAY['21228', '21229']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Parkville', 'parkville', ARRAY['21234']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Pikesville', 'pikesville', ARRAY['21208']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Reisterstown', 'reisterstown', ARRAY['21136']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Owings Mills', 'owings-mills', ARRAY['21117']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Randallstown', 'randallstown', ARRAY['21133']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Columbia', 'columbia', ARRAY['21044', '21045', '21046']),
  ((SELECT id FROM tenants WHERE slug = 'baltimore'), 'Ellicott City', 'ellicott-city', ARRAY['21042', '21043']);

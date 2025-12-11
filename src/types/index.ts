/**
 * Baltimore Mental Health Navigator - Core Types
 * 
 * This file contains all TypeScript types for the application,
 * including database entities, API contracts, and UI types.
 */

// =============================================================================
// ENUMS AND CONSTANTS
// =============================================================================

export const ISSUE_TYPES = [
  'anxiety',
  'depression',
  'trauma',
  'addiction',
  'stress',
  'grief',
  'relationship',
  'family',
  'child_behavior',
  'teen_issues',
  'eating_disorders',
  'bipolar',
  'ocd',
  'ptsd',
  'adhd',
  'autism',
  'personality_disorders',
  'schizophrenia',
  'sleep',
  'anger',
  'self_esteem',
  'life_transitions',
  'career',
  'lgbtq',
  'cultural_identity',
  'domestic_violence',
  'sexual_abuse',
  'chronic_illness',
  'other',
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number];

export const AGE_GROUPS = [
  'children', // 0-12
  'teens',    // 13-17
  'adults',   // 18-64
  'seniors',  // 65+
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export const PROVIDER_TYPES = [
  'therapist',
  'psychiatrist',
  'psychologist',
  'counselor',
  'social_worker',
  'nurse_practitioner',
  'peer_specialist',
] as const;

export type ProviderType = (typeof PROVIDER_TYPES)[number];

export const ORGANIZATION_TYPES = [
  'community_mental_health_center',
  'hospital_clinic',
  'nonprofit',
  'support_group',
  'crisis_center',
  'school_based',
  'faith_based',
  'government',
  'private_practice_group',
] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const SERVICE_FORMATS = [
  'in_person',
  'telehealth',
  'phone',
  'hybrid',
] as const;

export type ServiceFormat = (typeof SERVICE_FORMATS)[number];

export const PAYMENT_TYPES = [
  'medicaid',
  'medicare',
  'private_insurance',
  'sliding_scale',
  'free',
  'self_pay',
] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const INSURANCE_PROVIDERS = [
  'aetna',
  'bluecross_blueshield',
  'carefirst',
  'cigna',
  'united_healthcare',
  'humana',
  'kaiser',
  'tricare',
  'medicaid_priority_partners',
  'medicaid_amerigroup',
  'medicaid_maryland_physicians_care',
  'medicaid_jai_medical',
  'medicare',
  'other',
] as const;

export type InsuranceProvider = (typeof INSURANCE_PROVIDERS)[number];

export const GENDER_OPTIONS = [
  'no_preference',
  'woman',
  'man',
  'nonbinary',
  'prefer_not_to_say',
] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number];

export const LANGUAGES = [
  'english',
  'spanish',
  'french',
  'arabic',
  'mandarin',
  'cantonese',
  'korean',
  'vietnamese',
  'tagalog',
  'russian',
  'portuguese',
  'hindi',
  'urdu',
  'bengali',
  'amharic',
  'swahili',
  'american_sign_language',
  'other',
] as const;

export type Language = (typeof LANGUAGES)[number];

export const AVAILABILITY_STATUS = [
  'accepting_new_clients',
  'waitlist',
  'limited_availability',
  'not_accepting',
] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUS)[number];

export const URGENCY_LEVELS = [
  'crisis',           // I think I might be in crisis
  'urgent',           // In the next few days
  'soon',             // In the next few weeks
  'moderate',         // In the next month or two
  'exploring',        // Just exploring options
] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const CREDENTIALS = [
  'LCSW',
  'LCSW-C',
  'LCPC',
  'LGPC',
  'LMFT',
  'PhD',
  'PsyD',
  'MD',
  'DO',
  'PMHNP',
  'CRNP',
  'RN',
  'CADC',
  'CSAC',
  'CPS',
  'other',
] as const;

export type Credential = (typeof CREDENTIALS)[number];

// =============================================================================
// DATABASE ENTITIES
// =============================================================================

/**
 * Tenant - For multi-tenant support (future city expansion)
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  is_active: boolean;
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  primary_color?: string;
  logo_url?: string;
  crisis_phone?: string;
  crisis_text?: string;
  support_email?: string;
}

/**
 * Provider - Individual mental health provider
 */
export interface Provider {
  id: string;
  tenant_id: string;
  
  // Basic info
  first_name: string;
  last_name: string;
  credentials: Credential[];
  provider_type: ProviderType;
  
  // Profile
  photo_url?: string;
  tagline?: string;
  bio?: string;
  
  // Contact
  email: string;
  phone?: string;
  website?: string;
  
  // Location
  address_line1?: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  
  // Services
  issues_treated: IssueType[];
  age_groups_served: AgeGroup[];
  service_formats: ServiceFormat[];
  languages: Language[];
  
  // Payment
  payment_types: PaymentType[];
  insurance_accepted: InsuranceProvider[];
  sliding_scale_min?: number;
  sliding_scale_max?: number;
  self_pay_rate?: number;
  
  // Availability
  availability_status: AvailabilityStatus;
  typical_wait_weeks?: number;
  
  // Metadata
  is_verified: boolean;
  is_active: boolean;
  is_featured: boolean;
  claimed_by_user_id?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_verified_at?: string;
}

/**
 * Organization - Community organizations, clinics, support groups
 */
export interface Organization {
  id: string;
  tenant_id: string;
  
  // Basic info
  name: string;
  organization_type: OrganizationType;
  
  // Profile
  logo_url?: string;
  tagline?: string;
  description?: string;
  
  // Contact
  email?: string;
  phone?: string;
  website?: string;
  
  // Services
  services_offered: string[];
  issues_addressed: IssueType[];
  age_groups_served: AgeGroup[];
  service_formats: ServiceFormat[];
  languages: Language[];
  
  // Payment
  payment_types: PaymentType[];
  insurance_accepted: InsuranceProvider[];
  is_free: boolean;
  
  // Access
  accepts_walk_ins: boolean;
  referral_required: boolean;
  how_to_access?: string;
  
  // Operating hours (stored as JSON)
  operating_hours?: OperatingHours;
  
  // Metadata
  is_verified: boolean;
  is_active: boolean;
  is_featured: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface OperatingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  notes?: string;
}

export interface DayHours {
  open: string;   // "09:00"
  close: string;  // "17:00"
  closed?: boolean;
}

/**
 * Organization Location - Multiple locations per organization
 */
export interface OrganizationLocation {
  id: string;
  organization_id: string;
  
  name?: string;  // "Main Office", "East Baltimore Branch"
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  
  phone?: string;
  is_primary: boolean;
  
  created_at: string;
  updated_at: string;
}

/**
 * Article - Resource hub content
 */
export interface Article {
  id: string;
  tenant_id: string;
  
  title: string;
  slug: string;
  summary: string;
  content: string;  // Markdown or HTML
  
  category: ArticleCategory;
  tags: string[];
  
  featured_image_url?: string;
  read_time_minutes: number;
  
  author_name?: string;
  author_id?: string;
  
  is_published: boolean;
  is_featured: boolean;
  
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const ARTICLE_CATEGORIES = [
  'getting_started',
  'paying_for_care',
  'teens_and_families',
  'crisis_and_safety',
  'community_resources',
  'self_care',
  'understanding_conditions',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

/**
 * Navigator Response - Submitted questionnaire data
 */
export interface NavigatorResponse {
  id: string;
  tenant_id: string;
  
  // Answers
  primary_concern: IssueType | 'not_sure';
  help_for: 'adult' | 'teen' | 'child' | 'couple' | 'family';
  urgency: UrgencyLevel;
  service_format: 'in_person' | 'online' | 'either';
  payment_type: PaymentType;
  insurance_provider?: InsuranceProvider;
  zip_code: string;
  
  // Optional preferences
  provider_gender_preference?: GenderOption;
  language_preference?: Language;
  open_to_community_programs: boolean;
  
  // Session tracking
  session_id: string;
  user_id?: string;  // If logged in
  
  // Results
  results_viewed: boolean;
  results_count?: number;
  
  created_at: string;
}

/**
 * Contact Submission - Inquiry from potential client to provider/org
 */
export interface ContactSubmission {
  id: string;
  tenant_id: string;
  
  // Source
  provider_id?: string;
  organization_id?: string;
  
  // Contact info
  name: string;
  email: string;
  phone?: string;
  message: string;
  
  // Context
  navigator_response_id?: string;
  
  // Status
  status: 'new' | 'viewed' | 'responded' | 'archived';
  
  created_at: string;
  updated_at: string;
}

/**
 * Provider Claim - Request to claim/verify a provider profile
 */
export interface ProviderClaim {
  id: string;
  tenant_id: string;
  
  provider_id: string;
  user_id: string;
  
  // Verification
  verification_email: string;
  verification_method: 'email' | 'npi' | 'manual';
  
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

/**
 * User - Application user (providers, admins)
 */
export interface User {
  id: string;
  tenant_id: string;
  
  email: string;
  role: 'admin' | 'provider' | 'organization_admin';
  
  first_name?: string;
  last_name?: string;
  
  // Linked entities
  provider_id?: string;
  organization_id?: string;
  
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

/**
 * Neighborhood - Pre-defined Baltimore neighborhoods
 */
export interface Neighborhood {
  id: string;
  tenant_id: string;
  
  name: string;
  slug: string;
  zip_codes: string[];
  
  // For map display
  boundary_geojson?: object;
  center_latitude?: number;
  center_longitude?: number;
  
  is_active: boolean;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Navigator Flow - Submit questionnaire answers
 */
export interface NavigatorSubmitRequest {
  primary_concern: IssueType | 'not_sure';
  help_for: 'adult' | 'teen' | 'child' | 'couple' | 'family';
  urgency: UrgencyLevel;
  service_format: 'in_person' | 'online' | 'either';
  payment_type: PaymentType;
  insurance_provider?: InsuranceProvider;
  zip_code: string;
  provider_gender_preference?: GenderOption;
  language_preference?: Language;
  open_to_community_programs?: boolean;
}

export interface NavigatorSubmitResponse {
  response_id: string;
  results_url: string;
}

/**
 * Results Filtering
 */
export interface ResultsFilterParams {
  response_id?: string;
  
  // Filter criteria (from navigator or manual)
  issues?: IssueType[];
  age_groups?: AgeGroup[];
  provider_types?: ProviderType[];
  organization_types?: OrganizationType[];
  service_formats?: ServiceFormat[];
  payment_types?: PaymentType[];
  insurance_providers?: InsuranceProvider[];
  languages?: Language[];
  
  // Location
  zip_code?: string;
  neighborhood?: string;
  max_distance_miles?: number;
  
  // Availability
  availability_status?: AvailabilityStatus[];
  
  // Search
  query?: string;
  
  // Sorting
  sort_by?: 'relevance' | 'distance' | 'availability' | 'name';
  sort_order?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Include flags
  include_providers?: boolean;
  include_organizations?: boolean;
}

export interface ResultsResponse {
  providers: ProviderCard[];
  organizations: OrganizationCard[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
  filters_applied: Partial<ResultsFilterParams>;
}

/**
 * Provider/Organization Card - Lightweight for listing
 */
export interface ProviderCard {
  id: string;
  type: 'provider';
  
  name: string;
  credentials: Credential[];
  provider_type: ProviderType;
  
  photo_url?: string;
  tagline?: string;
  bio_excerpt?: string;
  
  neighborhood?: string;
  zip_code?: string;
  service_formats: ServiceFormat[];
  
  availability_status: AvailabilityStatus;
  typical_wait_weeks?: number;
  
  issues_treated: IssueType[];
  age_groups_served: AgeGroup[];
  specialties?: string[];
  
  payment_summary: string;  // "Medicaid, sliding scale"
  insurance_accepted?: string[];
  
  gender?: string;
  languages_spoken?: string[];
  
  distance_miles?: number;
  relevance_score?: number;
  
  // Rating fields
  average_rating?: number;
  review_count?: number;
}

export interface OrganizationCard {
  id: string;
  type: 'organization';
  
  name: string;
  organization_type: OrganizationType;
  
  logo_url?: string;
  tagline?: string;
  description?: string;
  description_excerpt?: string;
  
  neighborhood?: string;
  zip_code?: string;
  service_formats: ServiceFormat[];
  
  services_summary: string[];
  is_free: boolean;
  accepts_walk_ins: boolean;
  
  issues_addressed: IssueType[];
  age_groups_served: AgeGroup[];
  
  payment_summary: string;
  
  distance_miles?: number;
  relevance_score?: number;
}

export type ResultCard = ProviderCard | OrganizationCard;

/**
 * Provider Profile - Full details
 */
export interface ProviderProfileResponse {
  provider: Provider;
  similar_providers?: ProviderCard[];
}

/**
 * Organization Profile - Full details
 */
export interface OrganizationProfileResponse {
  organization: Organization;
  locations: OrganizationLocation[];
  similar_organizations?: OrganizationCard[];
}

/**
 * Contact Form Submission
 */
export interface ContactFormRequest {
  provider_id?: string;
  organization_id?: string;
  
  name: string;
  email: string;
  phone?: string;
  message: string;
  
  navigator_response_id?: string;
}

export interface ContactFormResponse {
  success: boolean;
  submission_id: string;
  message: string;
}

/**
 * Provider Onboarding
 */
export interface ProviderSearchRequest {
  query: string;  // Name or practice name
}

export interface ProviderSearchResponse {
  matches: ProviderCard[];
}

export interface ProviderClaimRequest {
  provider_id: string;
  verification_email: string;
}

export interface ProviderClaimResponse {
  claim_id: string;
  status: 'pending';
  message: string;
}

export interface ProviderCreateRequest {
  first_name: string;
  last_name: string;
  credentials: Credential[];
  email: string;
  phone?: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  issues_treated: IssueType[];
}

export interface ProviderCreateResponse {
  provider_id: string;
  claim_id: string;
  status: 'pending_review';
  message: string;
}

/**
 * Admin CRUD Operations
 */
export interface AdminListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'pending';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AdminListResponse<T> {
  items: T[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface AdminProviderUpdate {
  first_name?: string;
  last_name?: string;
  credentials?: Credential[];
  provider_type?: ProviderType;
  tagline?: string;
  bio?: string;
  phone?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  neighborhood?: string;
  issues_treated?: IssueType[];
  age_groups_served?: AgeGroup[];
  service_formats?: ServiceFormat[];
  languages?: Language[];
  payment_types?: PaymentType[];
  insurance_accepted?: InsuranceProvider[];
  sliding_scale_min?: number;
  sliding_scale_max?: number;
  self_pay_rate?: number;
  availability_status?: AvailabilityStatus;
  typical_wait_weeks?: number;
  is_verified?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface AdminOrganizationUpdate {
  name?: string;
  organization_type?: OrganizationType;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  services_offered?: string[];
  issues_addressed?: IssueType[];
  age_groups_served?: AgeGroup[];
  service_formats?: ServiceFormat[];
  languages?: Language[];
  payment_types?: PaymentType[];
  insurance_accepted?: InsuranceProvider[];
  is_free?: boolean;
  accepts_walk_ins?: boolean;
  referral_required?: boolean;
  how_to_access?: string;
  operating_hours?: OperatingHours;
  is_verified?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
}

// =============================================================================
// UI COMPONENT TYPES
// =============================================================================

export interface NavigatorStepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
}

export interface FilterChipProps {
  label: string;
  value: string;
  isSelected: boolean;
  onToggle: () => void;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// =============================================================================
// API ERROR TYPES
// =============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

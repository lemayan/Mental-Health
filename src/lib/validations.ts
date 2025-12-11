/**
 * API Validation Schemas
 * 
 * Zod schemas for validating API request bodies and query parameters.
 * These schemas ensure type safety and provide helpful error messages.
 */

import { z } from 'zod';
import {
  ISSUE_TYPES,
  AGE_GROUPS,
  PROVIDER_TYPES,
  ORGANIZATION_TYPES,
  SERVICE_FORMATS,
  PAYMENT_TYPES,
  INSURANCE_PROVIDERS,
  GENDER_OPTIONS,
  LANGUAGES,
  URGENCY_LEVELS,
  CREDENTIALS,
  AVAILABILITY_STATUS,
} from '@/types';

// =============================================================================
// COMMON SCHEMAS
// =============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const zipCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code');

export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\(\)\.+]+$/, 'Please enter a valid phone number')
  .optional();

// =============================================================================
// NAVIGATOR FLOW SCHEMAS
// =============================================================================

export const navigatorSubmitSchema = z.object({
  primary_concern: z.enum([...ISSUE_TYPES, 'not_sure'] as [string, ...string[]]),
  help_for: z.enum(['adult', 'teen', 'child', 'couple', 'family']),
  urgency: z.enum(URGENCY_LEVELS),
  service_format: z.enum(['in_person', 'online', 'either']),
  payment_type: z.enum(PAYMENT_TYPES),
  insurance_provider: z.enum(INSURANCE_PROVIDERS).optional(),
  zip_code: zipCodeSchema,
  provider_gender_preference: z.enum(GENDER_OPTIONS).optional(),
  language_preference: z.enum(LANGUAGES).optional(),
  open_to_community_programs: z.boolean().default(true),
});

export type NavigatorSubmitInput = z.infer<typeof navigatorSubmitSchema>;

// =============================================================================
// RESULTS FILTERING SCHEMAS
// =============================================================================

export const resultsFilterSchema = z.object({
  // From navigator response
  response_id: z.string().uuid().optional(),
  
  // Filter criteria
  issues: z.array(z.enum(ISSUE_TYPES)).optional(),
  age_groups: z.array(z.enum(AGE_GROUPS)).optional(),
  provider_types: z.array(z.enum(PROVIDER_TYPES)).optional(),
  organization_types: z.array(z.enum(ORGANIZATION_TYPES)).optional(),
  service_formats: z.array(z.enum(SERVICE_FORMATS)).optional(),
  payment_types: z.array(z.enum(PAYMENT_TYPES)).optional(),
  insurance_providers: z.array(z.enum(INSURANCE_PROVIDERS)).optional(),
  languages: z.array(z.enum(LANGUAGES)).optional(),
  
  // Location
  zip_code: zipCodeSchema.optional(),
  neighborhood: z.string().optional(),
  max_distance_miles: z.coerce.number().positive().max(100).optional(),
  
  // Availability
  availability_status: z.array(z.enum(AVAILABILITY_STATUS)).optional(),
  
  // Search
  query: z.string().max(200).optional(),
  
  // Sorting
  sort_by: z.enum(['relevance', 'distance', 'availability', 'name']).default('relevance'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
  
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  
  // Include flags
  include_providers: z.coerce.boolean().default(true),
  include_organizations: z.coerce.boolean().default(true),
});

export type ResultsFilterInput = z.infer<typeof resultsFilterSchema>;

// =============================================================================
// CONTACT FORM SCHEMAS
// =============================================================================

export const contactFormSchema = z
  .object({
    provider_id: z.string().uuid().optional(),
    organization_id: z.string().uuid().optional(),
    name: z.string().min(1, 'Name is required').max(100),
    email: emailSchema,
    phone: phoneSchema,
    message: z
      .string()
      .min(10, 'Please enter a message of at least 10 characters')
      .max(2000, 'Message must be less than 2000 characters'),
    navigator_response_id: z.string().uuid().optional(),
  })
  .refine((data) => data.provider_id || data.organization_id, {
    message: 'Either provider_id or organization_id is required',
  });

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// =============================================================================
// PROVIDER ONBOARDING SCHEMAS
// =============================================================================

export const providerSearchSchema = z.object({
  query: z.string().min(2, 'Please enter at least 2 characters').max(100),
});

export type ProviderSearchInput = z.infer<typeof providerSearchSchema>;

export const providerClaimSchema = z.object({
  provider_id: z.string().uuid(),
  verification_email: emailSchema,
});

export type ProviderClaimInput = z.infer<typeof providerClaimSchema>;

export const providerCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: emailSchema,
  phone: z.string().optional().nullable(),
  providerType: z.string().min(1, 'Provider type is required'),
  credentials: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(5000),
  tagline: z.string().optional().nullable(),
  address_line1: z.string().min(1, 'Address is required').max(200),
  address_line2: z.string().optional().nullable(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(2),
  zip_code: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  languages: z.array(z.string()).optional().default(['english']),
  issues_treated: z.array(z.string()).optional().default([]),
  age_groups_served: z.array(z.string()).optional().default([]),
  service_formats: z.array(z.string()).optional().default([]),
  payment_types: z.array(z.string()).optional().default([]),
  insurance_accepted: z.string().optional().nullable(),
  availability_status: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  photo_url: z.string().url().optional().nullable(),
});

export type ProviderCreateInput = z.infer<typeof providerCreateSchema>;

// =============================================================================
// ADMIN CRUD SCHEMAS
// =============================================================================

export const adminListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().max(100).optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type AdminListInput = z.infer<typeof adminListSchema>;

export const adminProviderUpdateSchema = z.object({
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
  credentials: z.array(z.enum(CREDENTIALS)).optional(),
  provider_type: z.enum(PROVIDER_TYPES).optional(),
  tagline: z.string().max(200).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  phone: phoneSchema.nullable(),
  website: z.string().url().optional().nullable(),
  address_line1: z.string().max(200).optional().nullable(),
  address_line2: z.string().max(200).optional().nullable(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  zip_code: zipCodeSchema.optional(),
  neighborhood: z.string().optional().nullable(),
  issues_treated: z.array(z.enum(ISSUE_TYPES)).optional(),
  age_groups_served: z.array(z.enum(AGE_GROUPS)).optional(),
  service_formats: z.array(z.enum(SERVICE_FORMATS)).optional(),
  languages: z.array(z.enum(LANGUAGES)).optional(),
  payment_types: z.array(z.enum(PAYMENT_TYPES)).optional(),
  insurance_accepted: z.array(z.enum(INSURANCE_PROVIDERS)).optional(),
  sliding_scale_min: z.number().int().positive().optional().nullable(),
  sliding_scale_max: z.number().int().positive().optional().nullable(),
  self_pay_rate: z.number().int().positive().optional().nullable(),
  availability_status: z.enum(AVAILABILITY_STATUS).optional(),
  typical_wait_weeks: z.number().int().min(0).max(52).optional().nullable(),
  is_verified: z.boolean().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export type AdminProviderUpdateInput = z.infer<typeof adminProviderUpdateSchema>;

export const adminOrganizationUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  organization_type: z.enum(ORGANIZATION_TYPES).optional(),
  tagline: z.string().max(200).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  email: emailSchema.optional().nullable(),
  phone: phoneSchema.nullable(),
  website: z.string().url().optional().nullable(),
  services_offered: z.array(z.string().max(100)).optional(),
  issues_addressed: z.array(z.enum(ISSUE_TYPES)).optional(),
  age_groups_served: z.array(z.enum(AGE_GROUPS)).optional(),
  service_formats: z.array(z.enum(SERVICE_FORMATS)).optional(),
  languages: z.array(z.enum(LANGUAGES)).optional(),
  payment_types: z.array(z.enum(PAYMENT_TYPES)).optional(),
  insurance_accepted: z.array(z.enum(INSURANCE_PROVIDERS)).optional(),
  is_free: z.boolean().optional(),
  accepts_walk_ins: z.boolean().optional(),
  referral_required: z.boolean().optional(),
  how_to_access: z.string().max(1000).optional().nullable(),
  is_verified: z.boolean().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export type AdminOrganizationUpdateInput = z.infer<typeof adminOrganizationUpdateSchema>;

export const adminArticleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  summary: z.string().min(1, 'Summary is required').max(500),
  content: z.string().min(1, 'Content is required'),
  category: z.enum([
    'getting_started',
    'paying_for_care',
    'teens_and_families',
    'crisis_and_safety',
    'community_resources',
    'self_care',
    'understanding_conditions',
  ]),
  tags: z.array(z.string().max(50)).default([]),
  featured_image_url: z.string().url().optional().nullable(),
  read_time_minutes: z.number().int().positive().default(5),
  author_name: z.string().max(100).optional().nullable(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

export type AdminArticleCreateInput = z.infer<typeof adminArticleCreateSchema>;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Safely parse and validate input with a Zod schema
 * Returns either the validated data or an error object
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Format Zod errors into a user-friendly object
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  
  return errors;
}

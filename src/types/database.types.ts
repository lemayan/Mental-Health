/**
 * Database Types
 * 
 * This file contains TypeScript types that match the Supabase database schema.
 * 
 * To regenerate this file from your actual Supabase schema, run:
 * npx supabase gen types typescript --local > src/types/database.types.ts
 * 
 * Or if using Supabase hosted:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          city: string;
          state: string;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          city: string;
          state: string;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          city?: string;
          state?: string;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      neighborhoods: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          slug: string;
          zip_codes: string[];
          boundary_geojson: Json | null;
          center_latitude: number | null;
          center_longitude: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          slug: string;
          zip_codes?: string[];
          boundary_geojson?: Json | null;
          center_latitude?: number | null;
          center_longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          slug?: string;
          zip_codes?: string[];
          boundary_geojson?: Json | null;
          center_latitude?: number | null;
          center_longitude?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      providers: {
        Row: {
          id: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          credentials: string[];
          provider_type: Database['public']['Enums']['provider_type'];
          photo_url: string | null;
          tagline: string | null;
          bio: string | null;
          email: string;
          phone: string | null;
          website: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string;
          state: string;
          zip_code: string;
          neighborhood_id: string | null;
          issues_treated: string[];
          age_groups_served: string[];
          service_formats: Database['public']['Enums']['service_format'][];
          languages: string[];
          payment_types: Database['public']['Enums']['payment_type'][];
          insurance_accepted: string[];
          sliding_scale_min: number | null;
          sliding_scale_max: number | null;
          self_pay_rate: number | null;
          availability_status: Database['public']['Enums']['availability_status'];
          typical_wait_weeks: number | null;
          is_verified: boolean;
          is_active: boolean;
          is_featured: boolean;
          claimed_by_user_id: string | null;
          created_at: string;
          updated_at: string;
          last_verified_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          first_name: string;
          last_name: string;
          credentials?: string[];
          provider_type: Database['public']['Enums']['provider_type'];
          photo_url?: string | null;
          tagline?: string | null;
          bio?: string | null;
          email: string;
          phone?: string | null;
          website?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string;
          state?: string;
          zip_code: string;
          neighborhood_id?: string | null;
          issues_treated?: string[];
          age_groups_served?: string[];
          service_formats?: Database['public']['Enums']['service_format'][];
          languages?: string[];
          payment_types?: Database['public']['Enums']['payment_type'][];
          insurance_accepted?: string[];
          sliding_scale_min?: number | null;
          sliding_scale_max?: number | null;
          self_pay_rate?: number | null;
          availability_status?: Database['public']['Enums']['availability_status'];
          typical_wait_weeks?: number | null;
          is_verified?: boolean;
          is_active?: boolean;
          is_featured?: boolean;
          claimed_by_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          last_verified_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          first_name?: string;
          last_name?: string;
          credentials?: string[];
          provider_type?: Database['public']['Enums']['provider_type'];
          photo_url?: string | null;
          tagline?: string | null;
          bio?: string | null;
          email?: string;
          phone?: string | null;
          website?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          neighborhood_id?: string | null;
          issues_treated?: string[];
          age_groups_served?: string[];
          service_formats?: Database['public']['Enums']['service_format'][];
          languages?: string[];
          payment_types?: Database['public']['Enums']['payment_type'][];
          insurance_accepted?: string[];
          sliding_scale_min?: number | null;
          sliding_scale_max?: number | null;
          self_pay_rate?: number | null;
          availability_status?: Database['public']['Enums']['availability_status'];
          typical_wait_weeks?: number | null;
          is_verified?: boolean;
          is_active?: boolean;
          is_featured?: boolean;
          claimed_by_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          last_verified_at?: string | null;
        };
      };
      organizations: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          organization_type: Database['public']['Enums']['organization_type'];
          logo_url: string | null;
          tagline: string | null;
          description: string | null;
          email: string | null;
          phone: string | null;
          website: string | null;
          services_offered: string[];
          issues_addressed: string[];
          age_groups_served: string[];
          service_formats: Database['public']['Enums']['service_format'][];
          languages: string[];
          payment_types: Database['public']['Enums']['payment_type'][];
          insurance_accepted: string[];
          is_free: boolean;
          accepts_walk_ins: boolean;
          referral_required: boolean;
          how_to_access: string | null;
          operating_hours: Json | null;
          is_verified: boolean;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          organization_type: Database['public']['Enums']['organization_type'];
          logo_url?: string | null;
          tagline?: string | null;
          description?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          services_offered?: string[];
          issues_addressed?: string[];
          age_groups_served?: string[];
          service_formats?: Database['public']['Enums']['service_format'][];
          languages?: string[];
          payment_types?: Database['public']['Enums']['payment_type'][];
          insurance_accepted?: string[];
          is_free?: boolean;
          accepts_walk_ins?: boolean;
          referral_required?: boolean;
          how_to_access?: string | null;
          operating_hours?: Json | null;
          is_verified?: boolean;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          organization_type?: Database['public']['Enums']['organization_type'];
          logo_url?: string | null;
          tagline?: string | null;
          description?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          services_offered?: string[];
          issues_addressed?: string[];
          age_groups_served?: string[];
          service_formats?: Database['public']['Enums']['service_format'][];
          languages?: string[];
          payment_types?: Database['public']['Enums']['payment_type'][];
          insurance_accepted?: string[];
          is_free?: boolean;
          accepts_walk_ins?: boolean;
          referral_required?: boolean;
          how_to_access?: string | null;
          operating_hours?: Json | null;
          is_verified?: boolean;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_locations: {
        Row: {
          id: string;
          organization_id: string;
          name: string | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          zip_code: string;
          neighborhood_id: string | null;
          phone: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name?: string | null;
          address_line1: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          zip_code: string;
          neighborhood_id?: string | null;
          phone?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string | null;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          zip_code?: string;
          neighborhood_id?: string | null;
          phone?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          tenant_id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          category: Database['public']['Enums']['article_category'];
          tags: string[];
          featured_image_url: string | null;
          read_time_minutes: number;
          author_name: string | null;
          author_id: string | null;
          is_published: boolean;
          is_featured: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          category: Database['public']['Enums']['article_category'];
          tags?: string[];
          featured_image_url?: string | null;
          read_time_minutes?: number;
          author_name?: string | null;
          author_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          content?: string;
          category?: Database['public']['Enums']['article_category'];
          tags?: string[];
          featured_image_url?: string | null;
          read_time_minutes?: number;
          author_name?: string | null;
          author_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      navigator_responses: {
        Row: {
          id: string;
          tenant_id: string;
          primary_concern: string;
          help_for: string;
          urgency: Database['public']['Enums']['urgency_level'];
          service_format: string;
          payment_type: Database['public']['Enums']['payment_type'];
          insurance_provider: string | null;
          zip_code: string;
          provider_gender_preference: string | null;
          language_preference: string | null;
          open_to_community_programs: boolean;
          session_id: string;
          user_id: string | null;
          results_viewed: boolean;
          results_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          primary_concern: string;
          help_for: string;
          urgency: Database['public']['Enums']['urgency_level'];
          service_format: string;
          payment_type: Database['public']['Enums']['payment_type'];
          insurance_provider?: string | null;
          zip_code: string;
          provider_gender_preference?: string | null;
          language_preference?: string | null;
          open_to_community_programs?: boolean;
          session_id: string;
          user_id?: string | null;
          results_viewed?: boolean;
          results_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          primary_concern?: string;
          help_for?: string;
          urgency?: Database['public']['Enums']['urgency_level'];
          service_format?: string;
          payment_type?: Database['public']['Enums']['payment_type'];
          insurance_provider?: string | null;
          zip_code?: string;
          provider_gender_preference?: string | null;
          language_preference?: string | null;
          open_to_community_programs?: boolean;
          session_id?: string;
          user_id?: string | null;
          results_viewed?: boolean;
          results_count?: number | null;
          created_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          tenant_id: string;
          provider_id: string | null;
          organization_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          navigator_response_id: string | null;
          status: Database['public']['Enums']['contact_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider_id?: string | null;
          organization_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          navigator_response_id?: string | null;
          status?: Database['public']['Enums']['contact_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          provider_id?: string | null;
          organization_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          navigator_response_id?: string | null;
          status?: Database['public']['Enums']['contact_status'];
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          tenant_id: string;
          email: string;
          role: Database['public']['Enums']['user_role'];
          first_name: string | null;
          last_name: string | null;
          provider_id: string | null;
          organization_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          tenant_id: string;
          email: string;
          role?: Database['public']['Enums']['user_role'];
          first_name?: string | null;
          last_name?: string | null;
          provider_id?: string | null;
          organization_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          email?: string;
          role?: Database['public']['Enums']['user_role'];
          first_name?: string | null;
          last_name?: string | null;
          provider_id?: string | null;
          organization_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      provider_claims: {
        Row: {
          id: string;
          tenant_id: string;
          provider_id: string;
          user_id: string;
          verification_email: string;
          verification_method: Database['public']['Enums']['verification_method'];
          status: Database['public']['Enums']['claim_status'];
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider_id: string;
          user_id: string;
          verification_email: string;
          verification_method?: Database['public']['Enums']['verification_method'];
          status?: Database['public']['Enums']['claim_status'];
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          provider_id?: string;
          user_id?: string;
          verification_email?: string;
          verification_method?: Database['public']['Enums']['verification_method'];
          status?: Database['public']['Enums']['claim_status'];
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      distance_miles: {
        Args: {
          lat1: number;
          lon1: number;
          lat2: number;
          lon2: number;
        };
        Returns: number;
      };
      get_default_tenant_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      provider_type:
        | 'therapist'
        | 'psychiatrist'
        | 'psychologist'
        | 'counselor'
        | 'social_worker'
        | 'nurse_practitioner'
        | 'peer_specialist';
      organization_type:
        | 'community_mental_health_center'
        | 'hospital_clinic'
        | 'nonprofit'
        | 'support_group'
        | 'crisis_center'
        | 'school_based'
        | 'faith_based'
        | 'government'
        | 'private_practice_group';
      service_format: 'in_person' | 'telehealth' | 'phone' | 'hybrid';
      payment_type:
        | 'medicaid'
        | 'medicare'
        | 'private_insurance'
        | 'sliding_scale'
        | 'free'
        | 'self_pay';
      availability_status:
        | 'accepting_new_clients'
        | 'waitlist'
        | 'limited_availability'
        | 'not_accepting';
      urgency_level: 'crisis' | 'urgent' | 'soon' | 'moderate' | 'exploring';
      article_category:
        | 'getting_started'
        | 'paying_for_care'
        | 'teens_and_families'
        | 'crisis_and_safety'
        | 'community_resources'
        | 'self_care'
        | 'understanding_conditions';
      user_role: 'admin' | 'provider' | 'organization_admin';
      contact_status: 'new' | 'viewed' | 'responded' | 'archived';
      claim_status: 'pending' | 'approved' | 'rejected';
      verification_method: 'email' | 'npi' | 'manual';
    };
  };
}

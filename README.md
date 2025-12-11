# Baltimore Mental Health Navigator

A web platform that helps Baltimore residents find appropriate mental health support through a guided questionnaire and curated resource matching.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Validation:** Zod
- **Forms:** React Hook Form

## Project Structure

```
baltimore-mhn/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── navigator/     # Navigator questionnaire submission
│   │   │   ├── results/       # Results filtering and sorting
│   │   │   ├── providers/     # Provider profiles
│   │   │   ├── organizations/ # Organization profiles
│   │   │   ├── contact/       # Contact form submissions
│   │   │   ├── onboarding/    # Provider onboarding (search, claim, create)
│   │   │   └── admin/         # Admin CRUD operations
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components (navbar, footer)
│   │   ├── forms/             # Form components
│   │   └── cards/             # Card components
│   ├── lib/
│   │   ├── supabase/          # Supabase client configuration
│   │   ├── utils.ts           # Utility functions
│   │   └── validations.ts     # Zod validation schemas
│   ├── types/
│   │   ├── index.ts           # Application types
│   │   └── database.types.ts  # Supabase database types
│   └── hooks/                 # Custom React hooks
├── supabase/
│   └── migrations/            # Database migrations
├── tailwind.config.ts         # Tailwind configuration (design system)
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (or local Supabase instance)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your Supabase credentials
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

```bash
# Run migrations against your Supabase instance
supabase db push

# Generate TypeScript types from schema (IMPORTANT!)
npm run db:generate
```

> **Note:** After running migrations, you MUST regenerate the database types using `npm run db:generate`. The included `database.types.ts` is a placeholder that matches the schema structure but needs to be regenerated from your actual Supabase instance for full type safety.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design System

The Tailwind configuration implements the full design system from the design specification:

### Colors

- **Primary:** Calm blue/teal palette (`primary-500: #4A90A4`)
- **Accent:** Warm, hopeful tone (`accent-500: #F2B441`)
- **Support:** Friendly warmth (`support-500: #E67E52`)
- **Neutrals:** Full grayscale palette
- **Semantic:** Success, warning, error, crisis colors

### Typography

- **Font:** Inter
- **Scale:** Display, H1-H4, Body variants, Caption, Overline
- **Body text:** 16-18px for accessibility

### Spacing

- Scale: 4, 8, 12, 16, 24, 32, 40px
- Consistent use throughout components

### Components

- Buttons: Primary, Secondary, Ghost, Crisis, Outline
- Inputs: Text, with label and error states
- Cards: Default, Elevated, Outlined, Interactive
- Tags: Multiple variants for specialties and filters

## API Contracts

### Navigator Flow

#### POST /api/navigator
Submit questionnaire responses.

**Request:**
```typescript
{
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
```

**Response:**
```typescript
{
  data: {
    response_id: string;
    results_url: string;
  }
}
```

### Results Filtering

#### GET /api/results
Fetch filtered provider/organization results.

**Query Parameters:**
- `response_id`: Navigator response ID
- `issues`: Comma-separated issue types
- `age_groups`: Comma-separated age groups
- `provider_types`: Filter by provider type
- `service_formats`: Filter by format (in_person, telehealth)
- `payment_types`: Filter by payment method
- `zip_code`: Location filter
- `sort_by`: relevance | distance | availability | name
- `page`, `limit`: Pagination

**Response:**
```typescript
{
  data: {
    providers: ProviderCard[];
    organizations: OrganizationCard[];
    total_count: number;
    page: number;
    limit: number;
    has_more: boolean;
  }
}
```

### Provider Profiles

#### GET /api/providers/[id]
Get full provider profile.

#### GET /api/organizations/[id]
Get full organization profile with locations.

### Contact Forms

#### POST /api/contact
Submit inquiry to provider/organization.

**Request:**
```typescript
{
  provider_id?: string;
  organization_id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  navigator_response_id?: string;
}
```

### Provider Onboarding

#### GET /api/onboarding/search?query=name
Search for existing profiles to claim.

#### POST /api/onboarding/claim
Request to claim an existing profile.

#### POST /api/onboarding/create
Create a new provider profile.

### Admin Operations

All admin routes require authentication with admin role.

#### Providers
- `GET /api/admin/providers` - List providers
- `POST /api/admin/providers` - Create provider
- `GET /api/admin/providers/[id]` - Get provider details
- `PATCH /api/admin/providers/[id]` - Update provider
- `DELETE /api/admin/providers/[id]` - Soft delete provider

#### Organizations
- `GET /api/admin/organizations` - List organizations
- `POST /api/admin/organizations` - Create organization

#### Claims
- `GET /api/admin/claims` - List provider claims
- `GET /api/admin/claims/[id]` - Get claim details
- `POST /api/admin/claims/[id]` - Approve/reject claim

## Database Schema

### Key Tables

- `tenants` - Multi-tenant support
- `providers` - Individual mental health providers
- `organizations` - Community organizations, clinics
- `organization_locations` - Multiple locations per org
- `articles` - Resource hub content
- `navigator_responses` - Questionnaire submissions
- `contact_submissions` - User inquiries
- `users` - Application users (providers, admins)
- `provider_claims` - Profile claim requests
- `neighborhoods` - Baltimore neighborhoods

### Key Features

- **Multi-tenant:** `tenant_id` on all relevant tables
- **Full-text search:** `search_vector` columns with triggers
- **Geospatial:** PostGIS for location queries
- **RLS:** Row-level security policies for data access control

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run db:generate  # Generate types from Supabase schema
npm run db:migrate   # Push migrations to Supabase
npm run db:reset     # Reset database
```

## Contributing

1. Follow the design system for all UI work
2. Use TypeScript strictly
3. Add Zod validation for all API inputs
4. Write accessible components (WCAG AA minimum)
5. Test on mobile viewports first

## License

Private - All rights reserved

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Starts Next.js development server with Turbopack
- **Build**: `npm run build` - Creates production build with Turbopack
- **Start**: `npm run start` - Runs production server
- **Lint**: `npm run lint` - Runs ESLint

## High-Level Architecture

Fiyova is a modern e-commerce platform built with Next.js 15, integrating with Dodo Payments for complete payment processing.

### Core Architecture Patterns

**Server vs Client Components**:
- Server Components for data fetching (products, product details) to avoid client-side API calls
- Client Components for interactive elements (buttons, forms, checkout flow)
- Pattern: Fetch data in Server Components, pass as props to Client Components

**API Route Structure**:
- `/api/dodo/products` - Product management and listing
- `/api/dodo/customers` - Customer creation
- `/api/dodo/payments` - Payment link generation
- `/api/webhooks/dodo` - Payment webhook handling
- `/api/auth/signup` - User registration with secure password hashing
- `/api/auth/login` - User authentication and session management

### Payment Flow

1. Product Selection → Server Component fetches products
2. Checkout Initiation → Client Component handles form submission
3. Customer Creation → API route creates customer in Dodo
4. Payment Creation → API route generates payment link
5. Redirect → User goes to Dodo's checkout page
6. Success Handling → Redirect back with query parameters

### Authentication Flow

1. User Registration → Client form validates input and submits to signup API
2. Password Hashing → Server securely hashes password with scrypt and random salt
3. User Storage → User data saved to persistent storage (JSON file in development)
4. User Login → Client form submits credentials to login API
5. Credential Verification → Server verifies email exists and password hash matches
6. Session Management → User data stored in localStorage for client-side auth state
7. Header Integration → Auth state displayed in header with login/logout functionality

### Key Technical Patterns

**Dodo Payments Integration**:
- API Key in environment variables (`DODO_PAYMENTS_API_KEY`)
- Test/Live mode configuration via `DODO_MODE`
- SDK initialization in `src/lib/dodo.ts`
- Always include `billing` object in payment requests
- Extract `items` from nested API responses: `response?.items || response || []`

**Slug Mapping System**:
- Utility in `src/lib/product-slug.ts` with `buildSlugMap()` function
- Bidirectional mapping between slugs and product IDs for SEO-friendly URLs
- Consistent usage across all product-related components

**Authentication System**:
- User management service in `src/lib/users.ts` with secure password hashing
- Development-friendly persistent storage using JSON file (`users.json`)
- Scrypt-based password hashing with random salts for security
- Client-side authentication state management via localStorage
- Header component integration with login/logout functionality

**Error Handling**:
- API routes wrapped in try-catch with JSON error responses
- Client components show user-friendly error messages
- Graceful degradation when APIs fail

## Important Implementation Details

### Environment Variables
```bash
DODO_PAYMENTS_API_KEY=<api_key>
DODO_MODE=test|live
DODO_REDIRECT_URL=http://localhost:3000/checkout/complete
```

### Common Issues and Solutions

**Context Errors**: "createContext only works in Client Components"
- Solution: Move Button usage to separate Client Components
- Files: `src/components/products/product-actions.tsx`, `src/components/products/product-card-actions.tsx`

**Payment Link Retrieval**: Dodo API response field names vary
- Solution: Try multiple field names: `payment_link_url`, `payment_link`, `checkout_url`, `url`, `link`

**Missing Required Fields**: 422 errors for missing `billing` field
- Solution: Always include default billing object in payment requests

**Authentication Issues**: Users not persisting across development server restarts
- Solution: Use persistent storage (JSON file) instead of in-memory arrays for development
- Hot reloading can reset in-memory state, causing login issues

## Key Files

### Critical Files
- `src/lib/dodo.ts` - Dodo client configuration
- `src/lib/product-slug.ts` - Slug mapping utilities
- `src/lib/users.ts` - User management service with authentication
- `src/app/api/dodo/payments/route.ts` - Payment processing
- `src/app/api/auth/signup/route.ts` - User registration endpoint
- `src/app/api/auth/login/route.ts` - User authentication endpoint
- `src/app/checkout/complete/page.tsx` - Payment success handling
- `users.json` - Development user storage (gitignored)

### Page Structure
- `src/app/page.tsx` - Landing page with product listing
- `src/app/products/page.tsx` - Product catalog
- `src/app/products/[slug]/page.tsx` - Individual product pages
- `src/app/checkout/page.tsx` - Checkout flow
- `src/app/signup/page.tsx` - User registration form
- `src/app/login/page.tsx` - User authentication form

### Component Organization
- `src/components/products/*` - Reusable product components
- `src/components/ui/*` - UI components (shadcn/ui)
- `src/components/site/*` - Site-wide components

## Memory Bank

The project includes a memory bank directory (`memory-bank/`) containing comprehensive documentation:
- `projectbrief.md` - Project overview and requirements
- `systemPatterns.md` - Architecture patterns and technical decisions
- `activeContext.md` - Current implementation context
- `progress.md` - Development progress tracking

Always read memory bank files at the start of each session for context.
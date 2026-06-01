# Inventory Track Project - Claude Code Guide

## Project Overview
This is a Next.js application for inventory tracking with user authentication, product management, manufacturing tracking, and order management features. The app uses MongoDB for data storage and implements JWT-based session handling.

## Key Architectural Patterns

### File Structure
- `app/` - Next.js 13+ app router structure
  - `(auth)/` - Authentication routes (login)
  - `(dashboard)/` - Protected dashboard routes
  - `inventory/` - Product inventory management
  - `manufacture/` - Manufacturing tracking
  - `order/` - Order management
  - `settings/` - User settings
  - `addproduct/`, `addmanufacture/` - Creation forms
  - `components/` - Shared UI components
  - `lib/` - Utility functions and services
  - `data/` - Data action functions

### Authentication & Sessions
- JWT-based authentication using `jose` library
- Session tokens stored in HTTP-only cookies
- Session validation in `app/layout.js` protects all routes
- Session refresh mechanism with 10-second expiration (renewed on activity)
- Protected routes redirect unauthenticated users to login

### Data Flow
- Server actions in `lib/actions/` for mutations
- API routes in `pages/api/` for data fetching
- Direct database access via Mongoose models in `models/`
- Configuration via environment variables and `lib/config.js`

### Styling
- Global CSS in `app/globals.css`
- Component-specific styling (likely CSS modules or inline styles)
- Uses `next/font` for font optimization

## Development Guidelines

### 1. Authentication Checks
- All routes are protected by default via `app/layout.js`
- Never bypass the session verification in layouts
- Use `verifyToken()` from `lib/session.js` for manual checks

### 2. Database Operations
- Use Mongoose models in `models/` directory
- Connection handled by `lib/db.js`
- Always handle connection errors gracefully
- Close connections in serverless environments when appropriate

### 3. API Routes
- Located in `pages/api/` (legacy pages router)
- Use `process.env.BASE_URL` from `lib/config.js` for internal API calls
- Include session cookie in requests to protected endpoints
- Handle errors with proper HTTP status codes

### 4. State Management
- Primarily server-side rendered with Next.js
- Minimal client-state (React hooks for UI interactions)
- Consider React Query or SWR for complex client-state needs

### 5. Error Handling
- Server actions should throw errors for Next.js to catch
- API routes should return appropriate HTTP status codes
- Client-side errors should be handled with try/catch and user feedback
- Log errors appropriately (avoid console.log in production)

### 6. Performance
- Leverage Next.js built-in optimizations (font, image, code splitting)
- Use `next/navigation` for client-side navigation
- Implement proper loading states
- Consider caching strategies for frequently accessed data

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for signing session tokens
- `NEXT_PUBLIC_APP_URL` - App URL for absolute links
- `VERCEL_URL` - Auto-set by Vercel
- `DEV_URL` - Development URL fallback

## Common Tasks

### Adding New Features
1. Create route in appropriate `app/` directory
2. Add server actions in `lib/actions/` if needed
3. Create/update Mongoose models in `models/`
4. Add API routes in `pages/api/` if required
5. Update navigation/menu as needed

### Modifying Existing Features
1. Check corresponding route in `app/`
2. Review related server actions and API routes
3. Update Mongoose models if data structure changes
4. Test both server and client-side functionality

### Database Changes
1. Update Mongoose schema in `models/`
2. Create migration script if needed
3. Update all usages throughout codebase
4. Test with existing data

## Testing Guidelines
- Write unit tests for utility functions
- Test server actions with mock requests
- Test API routes with supertest or similar
- Component testing with React Testing Library
- End-to-end testing with Cypress or Playwright

## Deployment
- Configured for Vercel deployment
- Ensure environment variables are set in Vercel dashboard
- Build command: `next build`
- Start command: `next start`

## Troubleshooting
- Session issues: Check cookie settings and JWT secret
- Database errors: Verify `MONGODB_URI` and network connectivity
- Build failures: Check for TypeScript/JavaScript syntax errors
- API issues: Verify process.env.BASE_URL configuration and route existence

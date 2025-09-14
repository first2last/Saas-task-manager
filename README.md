# Multi-Tenant SaaS Notes Application

A complete multi-tenant SaaS notes application built with the MERN stack and TypeScript, featuring role-based access control and subscription-based feature gating.

## Multi-Tenancy Architecture

This application uses the **Shared Schema with Tenant ID Column** approach for multi-tenancy. This means:

- Single database with all tenant data stored together
- Each document includes a `tenantId` field for data isolation
- Cost-effective and scalable solution
- Proper indexes ensure good performance
- Strict middleware enforcement prevents data leakage between tenants

### Why Shared Schema?

- **Cost Efficiency**: Single database instance reduces hosting costs
- **Scalability**: Easy to manage and scale with proper indexing
- **Maintenance**: Single schema to maintain and update
- **Resource Optimization**: Shared resources with tenant isolation

## Features

### 1. Multi-Tenancy
- ✅ Support for multiple tenants (Acme and Globex)
- ✅ Strict data isolation using tenant middleware
- ✅ Tenant-based user authentication
- ✅ Shared schema with tenant ID columns

### 2. Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Member)
- ✅ Tenant-scoped user sessions
- ✅ Protected routes with middleware

### 3. Subscription Feature Gating
- ✅ Free Plan: Limited to 3 notes maximum
- ✅ Pro Plan: Unlimited notes
- ✅ Admin-only upgrade functionality
- ✅ Real-time limit enforcement

### 4. Notes CRUD API
- ✅ Create, read, update, delete notes
- ✅ Tenant isolation for all operations
- ✅ Role-based permissions
- ✅ Subscription limit checks

### 5. Frontend Features
- ✅ React with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ Login with tenant selection
- ✅ Notes management interface
- ✅ Upgrade prompts for free users
- ✅ Role-based UI elements

## Test Accounts

| Email | Password | Tenant | Role | Purpose |
|-------|----------|--------|------|---------|
| admin@acme.test | password | Acme | Admin | Can invite users and upgrade |
| user@acme.test | password | Acme | Member | Can manage notes only |
| admin@globex.test | password | Globex | Admin | Can invite users and upgrade |
| user@globex.test | password | Globex | Member | Can manage notes only |

## API Endpoints

### Authentication
- `POST /auth/login` - User login with tenant context

### Notes Management
- `POST /notes` - Create a new note (with subscription limits)
- `GET /notes` - List all notes for current tenant
- `GET /notes/:id` - Get specific note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Tenant Management
- `POST /tenants/:slug/upgrade` - Upgrade tenant to Pro plan (Admin only)

### Health Check
- `GET /health` - Application health status



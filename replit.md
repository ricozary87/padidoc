# PadiDoc - Rice Mill Management System

## Overview

PadiDoc is a comprehensive rice mill management system built with React, Express, and PostgreSQL. The application manages the complete rice production workflow from grain purchasing to rice sales, including drying, production, inventory management, financial tracking, and customizable PDF invoice generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Router**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Management**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses
- **Middleware**: Express built-in middleware for JSON parsing and URL encoding

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **Connection**: Neon serverless connection with WebSocket support
- **Migrations**: Drizzle Kit for database schema management
- **Schema**: Centralized schema definitions in shared directory

## Key Components

### Database Schema
The system manages eight core entities:
- **Users**: Authentication and role management
- **Suppliers**: Grain supplier information
- **Customers**: Rice customer information
- **Pembelian**: Grain purchase transactions
- **Pengeringan**: Grain drying process tracking
- **Produksi**: Rice production records
- **Penjualan**: Rice sales transactions
- **Pengeluaran**: Expense tracking
- **Stok**: Inventory management
- **LogStok**: Stock movement logging

### Frontend Pages
- **Dashboard**: Overview with metrics, quick actions, and recent activities
- **Pembelian Gabah**: Grain purchasing management with PDF invoice printing
- **Pengeringan**: Drying process tracking
- **Produksi**: Production management
- **Penjualan**: Sales management with PDF invoice printing
- **Pengeluaran**: Expense tracking
- **Stok**: Inventory management
- **Laporan**: Reporting and analytics
- **Settings**: Company configuration for invoice customization

### Shared Components
- **DataTable**: Reusable table component with search and sorting
- **MetricsCard**: Dashboard metric display cards
- **Sidebar**: Navigation sidebar with routing
- **Form Components**: Consistent form elements across pages

## Data Flow

1. **Grain Purchase**: Suppliers provide grain recorded in Pembelian
2. **Drying Process**: Purchased grain goes through Pengeringan
3. **Production**: Dried grain is processed into rice in Produksi
4. **Sales**: Processed rice is sold to customers in Penjualan
5. **Inventory**: Stock levels are maintained in Stok with LogStok tracking
6. **Expenses**: All operational costs tracked in Pengeluaran
7. **Reporting**: All data aggregated for dashboard metrics and reports

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Validation**: Zod for runtime type validation
- **Forms**: React Hook Form for form state management
- **Queries**: TanStack Query for server state management
- **Styling**: Tailwind CSS with class-variance-authority for variants

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM for database operations
- **Validation**: Zod for schema validation (shared with frontend)
- **WebSocket**: ws for Neon database WebSocket connection

### Development Dependencies
- **Build**: Vite for frontend bundling, esbuild for backend bundling
- **TypeScript**: Full TypeScript support across the stack
- **Development**: tsx for TypeScript execution, nodemon-like development experience

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle Kit handles schema migrations

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment setting (development/production)
- **REPL_ID**: Replit environment detection

### Production Deployment
- **Static Files**: Frontend served from `dist/public`
- **API**: Express server serves REST API from `/api` routes
- **Database**: PostgreSQL database with Drizzle ORM
- **Process**: Single Node.js process serves both frontend and backend

### Development Setup
- **Hot Reload**: Vite HMR for frontend, tsx for backend auto-restart
- **Database**: Drizzle push for development schema updates
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Error Handling**: Runtime error overlay for development debugging

The architecture supports a complete rice mill operation with real-time inventory tracking, financial management, and comprehensive reporting capabilities. The system is designed for scalability and maintainability with strong type safety throughout the stack.

## Recent Changes

### Visual Dashboard Enhancements (January 2025)
- **Enhanced MetricsCard Component**: Added colored backgrounds and text for better visual distinction
- **Color-coded Statistics Cards**: Each metric now has distinct color scheme (blue for purchases, green for production, yellow for sales, purple for rice stock, orange for grain stock, etc.)
- **Hover Animations**: Added smooth scale and shadow transitions for metric cards
- **Gradient Progress Bars**: Replaced standard progress bars with gradient green progress bars for efficiency metrics
- **Improved Chart Placeholders**: Empty chart areas now use slate background with semi-transparent icons and "Data belum tersedia" text
- **Colored Sidebar Icons**: Added color-coded icons for navigation menu items matching their respective functions
- **Created CardStat Component**: Reusable component for future metric cards with standardized styling
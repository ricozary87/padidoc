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
- **Grain Yield Simulation Feature**: Added comprehensive yield simulation tool in Dashboard
  - Interactive modal with form inputs for grain weight, purchase/sale prices, and yield percentages
  - Real-time calculation of production results (rice, bran, broken rice, husk)
  - Financial analysis showing costs, potential revenue, and profit/loss
  - Visual status indicators (✅ Profit / ❌ Loss / ⚖️ Break-even) with color coding
  - Frontend-only calculation without backend API dependency
- **Weekly Cash Flow Panel**: Added comprehensive cash flow tracking dashboard
  - Real-time calculation of weekly income vs expenses based on all transactions
  - Shows initial capital (default 50M), weekly income, weekly expenses, and final balance
  - Visual status indicators (🟢 Profit / 🔴 Loss / ⚖️ Break-even) with color coding
  - Interactive line chart showing 7-day trend of income vs expenses using Recharts
  - Separate calculation helper (`cashFlowCalculator.js`) for clean code organization
  - "Lihat Detail Arus Kas" button linking to detailed reports
  - Integrates data from sales (penjualan), purchases (pembelian), and expenses (pengeluaran)
- **Clickable Dashboard Panels**: Made all metric cards interactive with navigation
  - Updated MetricsCard component to support onClick handlers with proper hover effects
  - Added navigation to appropriate pages: Pembelian → /pembelian, Produksi → /produksi, Penjualan → /penjualan
  - All stock-related cards (Stok Beras, Stok Gabah, Stok Katul, Stok Menir, Stok Sekam) navigate to /stok
  - Cards now display cursor pointer and opacity changes on hover to indicate clickability
  - Implemented using wouter's useLocation hook for programmatic navigation
- **Dashboard Layout Improvements**: Cleaned up panel spacing and alignment
  - Reduced main content spacing from `space-y-6` to `space-y-4` for tighter layout
  - Reduced all grid gaps from `gap-6` to `gap-4` for better visual balance
  - Created dedicated section for "Arus Kas Mingguan dan Jadwal Pengeringan" alignment
  - Restructured layout with proper side-by-side alignment of key panels
  - Moved Recent Activities to its own dedicated section
  - Fixed responsive layout for better mobile and tablet viewing
- **Transaction History Panel Enhancement (January 2025)**
  - **Converted "Transaksi Terbaru" to "Riwayat Transaksi"**: Changed panel title and icon to reflect transaction history focus
  - **Auto-refresh functionality**: Added 30-second interval auto-refresh using React Query with `refetchInterval`
  - **Real-time updates**: Implemented comprehensive cache invalidation across all transaction mutations
  - **Enhanced API endpoint**: Created `/api/dashboard/transactions` for comprehensive transaction history from all sources
  - **Improved UI**: Added loading states, hover effects, and better visual feedback
  - **Multi-transaction support**: Shows pembelian, penjualan, and pengeluaran in unified history view
  - **Cache invalidation**: All transaction mutations now invalidate dashboard caches for real-time updates

### Comprehensive System Audit (January 16, 2025)

**Audit Scope**: Complete system review covering database schema, API endpoints, business logic, validation, performance, and security.

**Key Findings**:
- **Strengths**: Modern architecture (React + TypeScript + Drizzle ORM), responsive design, good form validation with Zod, real-time cache updates, working PDF generation, multi-product framework foundation
- **Critical Issues**: No automatic stock updates on transactions, missing validation for negative stock/prices/dates, no authentication system, data consistency problems

**Priority Fixes Identified**:
1. **HIGH PRIORITY**: Auto-update stock on transactions, validate negative stock to prevent overselling, add input validation for negative values, implement auto-calculations on forms
2. **MEDIUM PRIORITY**: Basic authentication system, pagination for tables, improved dashboard metrics calculation, confirmation dialogs for critical operations
3. **LOW PRIORITY**: Bulk operations, enhanced export functionality, performance optimization with debouncing, offline capability

**Technical Debt**: Multi-product framework partially implemented with "UPDATE INI UNTUK MULTI PRODUK" comments throughout codebase requiring completion

**Security Concerns**: No authentication, role-based access controls, or input sanitization implemented

**Performance Issues**: No pagination, excessive auto-refresh (30s intervals), missing search debouncing, multiple separate queries in dashboard

**Status**: Application has solid UI/UX foundation but requires critical business logic fixes before production deployment. Next session will focus on implementing priority fixes.

### Critical Business Logic Fixes Implementation (January 16, 2025)

**Implemented High Priority Fixes**:
1. **Auto-update Stock System**: Created helper functions `updateStok()` and `logStokPerubahan()` for automatic stock management
   - Prevents negative stock with validation before transactions
   - Logs all stock changes with transaction references
   - Handles pembelian (stock increase), penjualan (stock decrease), and produksi (input decrease, output increase)
   - Validates stock availability before processing transactions

2. **Enhanced Form Validation**: Strengthened schema validation with strict business rules
   - Added negative value validation for prices, quantities, and percentages
   - Prevents future dates in transaction forms
   - Validates kadar air (0-100%), rendemen (0-100%), and other range constraints
   - Improved error messages with descriptive validation feedback

3. **Auto-calculation Features**: Implemented real-time calculations in forms
   - **Pembelian**: Auto-calculates total harga from jumlah × harga per kg
   - **Penjualan**: Auto-calculates total harga from jumlah × harga per kg
   - **Produksi**: Auto-calculates rendemen from (beras output / gabah input) × 100%
   - All calculations update in real-time using React form watch

4. **Error Handling Improvements**: Better error propagation and user feedback
   - Specific error messages for stock validation failures
   - Clear feedback when stock is insufficient for transactions
   - Enhanced backend error handling with proper HTTP status codes

**Code Quality Improvements**:
- Added "PRIORITAS AUDIT - FIXED" comments to all modified sections
- Used React.useEffect with form.watch for efficient auto-calculations
- Implemented readonly fields for auto-calculated values
- Enhanced user experience with immediate feedback

**Stock Management Logic**:
- Pembelian: Adds stock to inventory automatically
- Penjualan: Validates sufficient stock before allowing transaction
- Produksi: Validates gabah input stock and adds output products to inventory
- All transactions create audit logs for stock changes

**Status**: Critical business logic fixes completed. Application now prevents overselling and maintains data integrity. Next priorities are authentication system and performance optimizations.

### Weekly Production Trend Feature Implementation (January 16, 2025)

**Added Weekly Production Trend Dashboard Panel**:
- **Visual Chart**: Interactive line chart showing 4-week production trends for gabah input and beras output
- **Summary Statistics**: Total production metrics for beras, gabah, katul, menir with color-coded display
- **Yield Analysis**: Automatic calculation of average rendemen (yield percentage) across production periods
- **Navigation Integration**: Direct link to production detail page with hover effects
- **Empty State Handling**: Graceful display when no production data available with informative messaging

**Technical Implementation**:
- Added `calculateWeeklyProduction` function to process production data into weekly aggregates
- Integrated with existing React Query data fetching for real-time updates
- Used Recharts library for responsive chart visualization with proper formatting
- Implemented proper field mapping (`jumlahGabahInput`, `jumlahBerasOutput`, etc.)

**Bug Fixes**:
- **React Import Error Fixed**: Resolved "Can't find variable: React" error in Produksi.tsx by properly importing useEffect
- **Data Field Mapping**: Corrected field names in weekly trend calculation to match actual database schema
- **Chart Data Display**: Fixed "Data belum tersedia" issue by using correct production data structure

**UI/UX Improvements**:
- Replaced static "Jadwal Pengeringan" panel with dynamic "Tren Produksi Mingguan" 
- Added color-coded trend lines (green for beras, amber for gabah)
- Implemented responsive tooltip with formatted data display
- Added proper loading states and error handling for production data

### "No Values to Update" Error Resolution (January 16, 2025)

**Problem**: Error "No values to update" occurred when updateStok method was called with empty data, causing transaction failures.

**Root Cause**: Method naming conflict between `autoUpdateStok` (internal stock updates) and `updateStok` (manual stock updates) causing improper method calls.

**Solution Implemented**:
1. **Enhanced updateStok Method**: Added validation to handle empty update data gracefully
   - If no values to update, return existing data without query execution
   - Added proper error handling for missing stock records
   - Maintained backward compatibility with existing code

2. **Fixed Method Separation**: Ensured clean separation between:
   - `autoUpdateStok`: Internal automatic stock updates during transactions
   - `updateStok`: Manual stock updates from user interface

3. **Improved Error Handling**: Added comprehensive error messages and validation

**Test Results**: All transaction flows now working correctly:
- ✓ Pembelian: Stock increases properly
- ✓ Produksi: Input stock decreases, output stock increases  
- ✓ Penjualan: Stock decreases with validation
- ✓ Overselling Protection: Prevents negative stock

**Current Stock Management**: System now maintains accurate inventory across all product types (gabah, beras, katul, menir, sekam) with complete transaction logging.

### Critical React Import Fixes and Cash Flow Improvements (January 16, 2025)

**React Import Error Resolution**:
- **Fixed PembelianGabah.tsx**: Added proper `useEffect` import, replaced `React.useEffect` with `useEffect`
- **Fixed Penjualan.tsx**: Added proper `useEffect` import, replaced `React.useEffect` with `useEffect`
- **Fixed Produksi.tsx**: Previously resolved similar import issue
- **Result**: Eliminated all "Can't find variable: React" errors across the application

**Cash Flow Data Correction**:
- **Fixed Field Mapping**: Corrected `harga_total` to `totalHarga` in cash flow calculations
- **Added Type Conversion**: Implemented `parseFloat()` for proper number conversion
- **Resolved Display Issues**: Fixed "RpNaN" displaying in cash flow panel
- **Fixed Chart Data**: Corrected chart data usage from `cashFlow.chartData` to `chartData`
- **Removed Duplicate Variables**: Eliminated duplicate `cashFlow` variable definitions causing syntax errors

**Auto-Estimate Gabah Input Feature**:
- **Smart Estimation**: Added automatic gabah input estimation based on total output using 65% rendemen
- **Enhanced UX**: Added helpful placeholder text and instructions for gabah input field
- **Flexible Operations**: Supports both manual input and auto-estimation workflows
- **Real-time Calculation**: Updates gabah input automatically when output values change
- **Operational Benefit**: Solves real-world problem of uncertain gabah quantities in continuous production

**Production Workflow Improvements**:
- **Two-Mode Operation**: Manual input for precise tracking, auto-estimate for continuous production
- **Better User Guidance**: Clear instructions on when to use each mode
- **Maintained Validation**: Stock validation still applies regardless of input method
- **Enhanced Logging**: All transactions properly logged with appropriate references

**Current Application State**:
- ✓ All pages accessible without React errors
- ✓ Cash flow panel displays accurate financial data
- ✓ Production form supports flexible gabah input workflows
- ✓ Auto-refresh and real-time updates working correctly
- ✓ Complete transaction logging and stock management functional
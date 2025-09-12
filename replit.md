# Overview

This is a comprehensive CRM (Customer Relationship Management) system designed specifically for exterior finishes contractors. The application manages leads, estimates, jobs, customers, vendors, and communications across three business divisions: single-family residential, multi-family residential, and repair & restoration (R&R). The system features a modern web interface with real-time updates, dashboard analytics, and Microsoft Outlook integration for email and calendar management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React + TypeScript SPA**: Modern single-page application built with React 18, TypeScript, and Vite for fast development and optimized production builds
- **Component Library**: Extensive use of Radix UI primitives with shadcn/ui components for consistent, accessible design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state management with real-time WebSocket updates
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Real-time Communication**: WebSocket server for live updates across all clients
- **API Design**: Resource-based REST endpoints with consistent error handling and logging middleware

## Data Storage Solutions
- **PostgreSQL Database**: Primary data store with Drizzle schema definitions
- **Schema Design**: Comprehensive relational model covering users, customers, leads, estimates, jobs, communications, vendors, and white-label settings
- **Database Migrations**: Drizzle Kit for schema migrations and database management
- **Connection**: Neon Database serverless PostgreSQL with connection pooling

## Authentication and Authorization
- **Session-based Authentication**: Traditional server-side sessions with secure cookie management
- **User Management**: Role-based access control with user accounts and permissions
- **Security**: Environment-based configuration with secure defaults

## External Dependencies

### Third-party Services
- **Microsoft Graph API**: Deep integration for Outlook email and calendar management
- **Replit Connectors**: OAuth flow management for Microsoft services
- **Neon Database**: Serverless PostgreSQL hosting with auto-scaling

### Key Libraries
- **UI Components**: Radix UI primitives (@radix-ui/*) for accessible component foundation
- **Data Visualization**: Recharts for dashboard analytics and reporting charts
- **Form Validation**: Zod schemas with React Hook Form resolvers
- **Date Handling**: date-fns for consistent date/time operations
- **HTTP Client**: Fetch API with custom wrapper for API requests

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer
- **Development**: Hot module replacement and error overlay for debugging
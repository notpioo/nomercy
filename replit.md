# NoMercy Gaming Platform

## Overview

NoMercy is a full-stack gaming platform built with React, Express, and PostgreSQL. The application features a sleek dark-themed UI with casino-style games, user authentication via Firebase, and a comprehensive social system. The platform includes three main games (Mine, Tower, Coinflip), user management, tournaments, and real-time chat functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and bundling
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Context for authentication, TanStack Query for server state
- **UI Components**: Comprehensive shadcn/ui component system with Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Development**: tsx for TypeScript execution
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Firebase Authentication with Firestore for user data

### Database Design
- **Primary Database**: PostgreSQL via Neon Database
- **Schema Management**: Drizzle ORM with migrations
- **Key Tables**: users, game_stats, game_history, tournaments, chat_messages
- **User System**: Role-based access control (member/admin)

## Key Components

### Authentication System
- Firebase Authentication with custom email format (username@nomercy.local)
- Dual storage approach: Firebase for auth, Firestore for user profiles
- Protected routes and role-based access control
- AuthContext provider for global authentication state

### Gaming Engine
- **Mine Game**: Risk-based mining game with configurable difficulty
- **Tower Game**: Progressive climbing game with increasing rewards
- **Coinflip**: Simple 50/50 betting game with instant results
- Virtual currency system using "Mercy Coins" (MC)

### User Interface
- Responsive design optimized for mobile and desktop
- Dark theme with indigo/violet gradient accents
- Mobile-first navigation with bottom sheet menus
- Toast notifications for user feedback

### Social Features
- Real-time chat system (UI implemented, backend pending)
- User profiles with game statistics
- Leaderboards and achievement systems
- Tournament management system

## Data Flow

1. **Authentication Flow**: User registers/logs in via Firebase → AuthContext updates → User data synced with Firestore
2. **Game Flow**: User selects game → Places bet → Game logic executes → Results update user stats
3. **Navigation**: Wouter handles client-side routing → Protected routes check auth state
4. **API Communication**: TanStack Query manages server state → Express API routes handle requests

## External Dependencies

### Core Dependencies
- **Firebase**: Authentication and user data storage
- **Neon Database**: PostgreSQL hosting
- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast build tool with HMR
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production bundling for server code

### UI Libraries
- **shadcn/ui**: Pre-built accessible components
- **Lucide React**: Icon library
- **React Hook Form**: Form validation and management

## Deployment Strategy

### Build Process
- Client build: Vite bundles React app to `dist/public`
- Server build: ESBuild bundles Express server to `dist/index.js`
- Development: Concurrent client/server with Vite middleware

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- Firebase configuration via environment variables
- Development vs production mode detection

### Database Management
- Drizzle migrations in `/migrations` directory
- Schema definitions in `shared/schema.ts`
- Push-based development workflow with `db:push` command

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 30, 2025. Firebase-only architecture for Railway deployment
  - Removed PostgreSQL complexity to resolve network deployment issues
  - Simplified to Firebase/Firestore as single database solution
  - Eliminated hybrid storage system and network dependency checks
  - Updated Railway configuration for reliable deployment without external database
  - Created Firebase-only documentation and deployment guide
- June 30, 2025. Railway deployment configuration completed
  - Created comprehensive Railway deployment setup with railway.json, nixpacks.toml, Procfile
  - Configured production-ready server with dynamic port assignment
  - Added Docker configuration and deployment documentation
  - Setup environment variables template and Firebase integration guide
  - Created complete deployment guide with troubleshooting and optimization tips
  - All deployment files ready for Railway, Heroku, and other PaaS platforms
- June 30, 2025. Comprehensive admin management system implementation
  - Added complete admin dashboard with 6 management modules
  - Implemented complex user management with edit/delete functionality
  - Created quiz system with points, rewards, and time limits
  - Built redeem code system with usage tracking and expiration
  - Added game settings management for all casino games
  - Integrated MAIN menu in both desktop and mobile navigation
  - Fixed API authentication to work with Firebase UID
  - All admin features now functional with proper CRUD operations
- June 30, 2025. Successfully migrated from Replit Agent to Replit environment
  - Fixed Firebase configuration with essential secrets
  - Resolved Firestore date conversion errors in admin dashboard
  - Completed migration with all checklist items verified
- June 28, 2025. Initial setup
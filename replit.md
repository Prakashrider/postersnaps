# PosterSnaps - AI Poster Generator

## Overview

PosterSnaps is a single-page web application that allows users to create AI-powered posters using keywords or URLs. The application features a modern React frontend with Express.js backend, leveraging OpenAI GPT for content generation and Puppeteer for poster rendering. Users can create one free poster without authentication, with additional features available for authenticated users.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/UI components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Authentication**: Firebase Auth for user management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Layer**: Hono.js for type-safe API routing with Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with planned PostgreSQL migration
- **Authentication**: Firebase Admin SDK for token verification

## Key Components

### 1. User Interface Flow
- **Landing Page**: Toggle between keyword and URL input modes
- **Configuration Modals**: Sequential popups for style, content type, format, and page count selection
- **Preview System**: Real-time poster generation status and preview
- **Authentication Modal**: Sign-in/sign-up when free limit is reached

### 2. AI Content Generation
- **OpenAI Integration**: GPT-3.5 for generating poster content based on input
- **Content Styles**: Narrative, Quote, and Pointers formats
- **Content Types**: Trending, Awareness, and Informative categories
- **Metadata Extraction**: YouTube API and web scraping for URL-based content

### 3. Poster Rendering Engine
- **Template System**: HTML/CSS templates for different poster styles
- **Puppeteer Integration**: Server-side rendering to PNG/JPG
- **Format Support**: Square (1:1), Portrait (4:5), and Story formats
- **Multi-page Support**: 1-5 pages per poster set

### 4. Storage and Data Management
- **Schema Design**: Zod schemas for type validation across frontend/backend
- **User Usage Tracking**: Poster creation limits and analytics
- **Session Management**: Anonymous user tracking for free tier
- **File Storage**: Firebase Storage for generated poster images

## Data Flow

1. **Input Processing**: User selects mode (keyword/URL) and provides input
2. **Configuration**: Sequential modal collection of preferences
3. **Content Generation**: AI processes input with metadata extraction for URLs
4. **Poster Creation**: Template-based rendering with generated content
5. **Storage**: Images uploaded to Firebase Storage
6. **Delivery**: URLs returned to frontend for download

## External Dependencies

### Required APIs
- **OpenAI API**: Content generation (GPT-3.5)
- **YouTube API**: Video metadata extraction
- **Firebase**: Authentication and file storage

### Third-party Services
- **Neon Database**: PostgreSQL hosting
- **Puppeteer**: Headless browser for rendering
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Full-stack development with automatic reloading
- **Type Safety**: Shared TypeScript types between frontend and backend

### Production Build
- **Frontend**: Vite build with optimized assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Database**: Drizzle migrations for schema management
- **Environment Variables**: Separate configs for development/production

### Performance Optimizations
- **Code Splitting**: Dynamic imports for modal components
- **Image Optimization**: Compressed poster outputs
- **Caching**: Static asset caching and API response optimization
- **Bundle Analysis**: Optimized dependency management

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 04, 2025. Initial setup
# PosterSnaps - AI-Powered Poster Generator

Transform your ideas into stunning posters with AI magic! 🎨✨

## Features

- 🤖 **AI-Powered Content Generation** - OpenAI GPT creates unique poster content
- 🎨 **Multiple Poster Styles** - Narrative, Quote, and Pointers formats
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔐 **Firebase Authentication** - Secure user management
- 💳 **Credits System** - Fair usage with credit-based billing
- 👑 **Admin Dashboard** - Built-in admin tools for user management
- 🌐 **Multiple Input Modes** - Generate from keywords or URLs
- 📊 **Multiple Formats** - Square, Portrait, and Story formats

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI GPT API
- **Auth**: Firebase Authentication
- **UI**: Radix UI + shadcn/ui
- **Deployment**: Vercel
- **Deployment**: Vercel

## Project Structure

```
postersnaps/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route components
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── services/           # Business logic
│   └── routes/             # API routes
├── shared/                 # Shared types and schemas
└── dist/                   # Build output
```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables**:
   - Make sure your `.env` file is configured with Firebase and OpenAI credentials
   - Fill in your API keys and configuration

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

- `POST /api/generate-poster` - Generate a poster from configuration
- `GET /api/metadata` - Extract metadata from URLs
- `POST /api/auth/verify` - Verify Firebase authentication

## Deployment

The app is configured for Vercel deployment with:
- `vercel.json` configuration
- Dynamic port handling
- Environment variable support

## Recent Changes

- ✅ Cleaned up Replit-specific dependencies
- ✅ Removed Drizzle ORM (not needed)
- ✅ Fixed server configuration for Vercel
- ✅ Updated Vite configuration
- ✅ Added proper error handling
- ✅ Configured environment variables

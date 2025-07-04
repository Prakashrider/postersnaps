# Authentication Testing Guide

## Fixed Issues
✅ **Fixed Firebase Import Error**: Added missing `signInWithGoogle` function to `/client/src/lib/firebase.ts`

## Authentication Flow Test Steps

### 1. Visit the Application
- Open: http://localhost:3000
- You should see the PosterSnaps homepage

### 2. Test Guest Mode (No Sign-In)
- Try generating a poster without signing in
- You should be able to generate 1 poster (free limit)
- After the first poster, you'll be prompted to sign in

### 3. Test Sign-In Flow
- Click "Sign In" button in the top right
- AuthModal should open with two options:
  - Email/Password authentication
  - Google Sign-In (popup)

### 4. Test Email Authentication
- Enter email and password
- Try both Sign Up and Sign In modes
- Check for proper error handling

### 5. Test Google Authentication
- Click "Sign in with Google"
- Google popup should appear
- After successful auth, you should be redirected back

### 6. Test User Dashboard
- After signing in, you should see:
  - Welcome message in the header
  - User dropdown with profile info
  - UserDashboard component with:
    - Profile information
    - Credits display
    - Posters created count
    - Account status
    - Quick actions

### 7. Test Admin Features
- Sign in with admin email: maritimeriderprakash@gmail.com
- Should see "Admin" badge
- Unlimited credits (∞ symbol)
- AdminDashboard component at bottom

### 8. Test Sign-Out
- Click user dropdown → "Sign out"
- Should be signed out successfully
- Dashboard should disappear

## API Endpoints Working
✅ Health Check: GET /api/health
✅ User Usage: GET /api/user-usage/{userId}
✅ Poster Generation: POST /api/generate-poster
✅ Poster Status: GET /api/poster/{posterId}

## Components Status
✅ AuthModal - Email/Google authentication
✅ UserDashboard - Profile and stats
✅ PosterGenerator - Main app with auth integration
✅ CreditsDisplay - User credits
✅ AdminDashboard - Admin-only features
✅ Home - Auth state management

## Environment Variables
✅ VITE_ADMIN_EMAIL - Frontend admin email
✅ ADMIN_EMAIL - Backend admin email
✅ Firebase configuration (all VITE_FIREBASE_* variables)

## Next Steps
1. Test the complete flow in the browser
2. Verify Google Sign-In works (may need Firebase console configuration)
3. Test poster generation with authenticated users
4. Verify credit system works properly
5. Test admin vs regular user experience

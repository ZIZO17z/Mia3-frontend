# Deployment Guide

## Required Environment Variables

For the application to work properly in production, you MUST set these environment variables:

### Essential (Required)

- `LIVEKIT_API_KEY` - Your LiveKit API key
- `LIVEKIT_API_SECRET` - Your LiveKit API secret
- `LIVEKIT_URL` - Your LiveKit server URL (e.g., `https://your-project.livekit.cloud`)

### Optional

- `NEXT_PUBLIC_CONN_DETAILS_ENDPOINT` - Custom connection details endpoint (if using proxy)
- `NEXT_PUBLIC_APP_CONFIG_ENDPOINT` - App config endpoint for sandbox mode
- `SANDBOX_ID` - Sandbox identifier for config service

## Deployment Platforms

### Vercel

1. Connect your repository to Vercel
2. Go to Settings → Environment Variables
3. Add the required environment variables listed above
4. Deploy

### Other Platforms (Netlify, Railway, etc.)

1. Set the environment variables in your deployment platform's dashboard
2. Ensure the platform supports Node.js server functions (not edge runtime)
3. Deploy

## Troubleshooting

### "Failed to fetch connection details" Error

This happens when the `/api/connection-details` endpoint fails. Common causes:

- Missing `LIVEKIT_API_KEY` environment variable
- Missing `LIVEKIT_API_SECRET` environment variable
- Missing `LIVEKIT_URL` environment variable
- Invalid LiveKit credentials
- Network issues connecting to LiveKit server

### Welcome Page Shows But Session Won't Start

- Check the browser console for error messages
- Verify all required environment variables are set
- Check that your LiveKit credentials are valid
- Ensure your LiveKit server is accessible from your deployment

### Build Failures

The app should build successfully with:

- ✅ No TypeScript errors
- ✅ No ESLint errors (lint passes)
- ✅ All dependencies installed

If builds fail, check the build logs for specific error messages.

## Verification

### Quick Test

After deployment, test the application:

1. Visit your deployed URL
2. Click "Start Session"
3. Should either:
   - Transition to the session view (if environment variables are correct), or
   - Show a toast error message without crashing (if environment variables are missing/invalid)

### Comprehensive Testing

For thorough verification, see `TESTING.md` for a complete checklist covering:

- ✅ All routes and pages
- ✅ Error handling and edge cases
- ✅ API functionality
- ✅ Mobile responsiveness
- ✅ Browser compatibility
- ✅ Performance checks

### Build Quality Assurance

The application now includes:

- ✅ **Linting enabled during build** - catches code quality issues
- ✅ **TypeScript strict checking** - prevents type-related runtime errors
- ✅ **Error boundaries** - graceful error handling throughout the app
- ✅ **Custom 404/error pages** - user-friendly error states
- ✅ **API error handling** - clear error messages for configuration issues
- ✅ **Security middleware** - CORS headers and security policies
- ✅ **Loading states** - smooth UX during page transitions

The application will NEVER show white screens or crash - all errors are handled gracefully with user-friendly messages.

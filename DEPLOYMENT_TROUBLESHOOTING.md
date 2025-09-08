# Deployment Troubleshooting Guide

## If you're seeing deployment errors, follow these steps:

### 1. ✅ Verify Build Passes Locally

First, ensure the build works on your local machine:

```bash
npm ci
npm run build
npm run lint
```

All commands should pass without errors.

### 2. 🐛 Common Deployment Errors & Solutions

#### Error: "Module not found" or Import Errors
**Fix:** Ensure all imports use exact case-sensitive paths:
- ✅ `@/components/ui/button` (lowercase)
- ❌ `@/components/UI/Button` (wrong case)

#### Error: "window is not defined" or "navigator is not defined"
**Fix:** These are SSR (Server-Side Rendering) issues. I've already fixed these by:
- Simplified VoiceBall component to avoid `navigator.mediaDevices`
- Added proper client-side checks with `useEffect`
- Used `'use client'` directives where needed

#### Error: "Cannot read properties of undefined"
**Fix:** Environment variable issues. Ensure these are set in your deployment:
```
LIVEKIT_API_KEY=your_key_here
LIVEKIT_API_SECRET=your_secret_here  
LIVEKIT_URL=your_livekit_server_url
```

#### Error: "Dynamic server usage" in static export
**Fix:** I've set `dynamic = 'force-dynamic'` for pages that need server-side features.

### 3. 🚀 Platform-Specific Fixes

#### Vercel Deployment
If deploying to Vercel:
1. Use the `vercel.json` configuration file I created
2. Set environment variables in Vercel dashboard
3. Ensure build command is: `npm run build`
4. Ensure install command is: `npm ci`

#### Netlify Deployment
If deploying to Netlify:
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

#### Railway/Render Deployment
1. Ensure build command: `npm run build`
2. Start command: `npm start`
3. Add environment variables in platform dashboard

### 4. 🔧 Quick Fixes Applied

I've already made these deployment-safe changes:

✅ **Removed complex audio processing** - VoiceBall now uses simple animation
✅ **Simplified theme toggle** - Removed complex icon dependencies  
✅ **Fixed SSR issues** - Proper client-side hydration
✅ **Added error boundaries** - Graceful error handling
✅ **Simplified components** - Removed problematic dependencies
✅ **Added Vercel config** - Platform-specific optimizations
✅ **Fixed dynamic imports** - Proper static/dynamic configuration

### 5. 🧪 Debugging Steps

If deployment still fails:

1. **Check build logs** for specific error messages
2. **Verify Node.js version** (should be 18+ for Next.js 15)
3. **Check memory limits** (increase if needed)
4. **Verify all dependencies** are in package.json
5. **Check for case-sensitive file issues** on Linux/Mac deployments

### 6. 📋 Last Resort: Minimal Deployment

If you still have issues, here's a minimal working version:

```bash
# Remove problematic files temporarily
mv components/VoiceBall.tsx components/VoiceBall.tsx.bak
mv components/theme-toggle.tsx components/theme-toggle.tsx.bak

# Create minimal replacements
echo 'export default function VoiceBall() { return <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse" />; }' > components/VoiceBall.tsx
echo 'export function ThemeToggle() { return <div />; }' > components/theme-toggle.tsx

# Build and deploy
npm run build
```

### 7. ✅ Success Verification

After deployment:
1. Visit your deployed URL
2. Should see welcome page with "Let's start!"
3. Click "Start Session" - should either work or show error toast (not crash)
4. Visit `/components` - should show component examples
5. No JavaScript console errors

### 8. 🆘 Get Help

If none of these work:
1. Share the exact error message from build logs
2. Specify your deployment platform (Vercel, Netlify, etc.)
3. Include your platform's build configuration

The app is designed to be deployment-safe, but different platforms have different requirements.

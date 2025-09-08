# Post-Deployment Testing Guide

## Quick Verification Checklist

After deploying, test these critical paths to ensure all pages work without errors:

### ✅ Core Application Routes

1. **Root Route (`/`)**
   - ✅ Should show the welcome page with "Let's start!" heading
   - ✅ Should display the "Start Session" button
   - ✅ Background should show animated VoiceBall component

2. **Session Flow**
   - ✅ Click "Start Session" button
   - ✅ Should either:
     - Show session view with chat interface (if env vars are set)
     - Show error toast message without crashing (if env vars missing)
   - ✅ No white screen or JavaScript errors

3. **Component Routes (`/components`)**
   - ✅ Should redirect to `/components/base`
   - ✅ Should show UI component examples
   - ✅ Tabs should work (Base components / LiveKit components)

4. **Base Components (`/components/base`)**
   - ✅ Should display button variants, toggles, alerts, selects
   - ✅ All interactive elements should work
   - ✅ No console errors

5. **LiveKit Components (`/components/livekit`)**
   - ✅ Should show device selection and track controls
   - ✅ Video grid should render (even without active participants)
   - ✅ Agent control bar should appear
   - ✅ No runtime errors

### ✅ API Routes

6. **Connection Details API (`/api/connection-details`)**
   - ✅ POST request should return proper error messages if env vars missing
   - ✅ Should return connection details if properly configured
   - ✅ No server crashes or 500 errors without clear messages

### ✅ Error Handling

7. **404 Pages**
   - ✅ Visit non-existent route (e.g., `/nonexistent`)
   - ✅ Should show custom 404 page with navigation options
   - ✅ "Go to homepage" and "View components" buttons should work

8. **Global Error Handling**
   - ✅ Application should never show blank white screens
   - ✅ All errors should show user-friendly messages
   - ✅ Error boundaries should catch and display errors gracefully

## Environment Variable Testing

### With Missing Environment Variables

- ✅ App should load and show welcome page
- ✅ "Start Session" should show error toast (not crash)
- ✅ Error message should be clear: "Failed to fetch connection details"

### With Correct Environment Variables

- ✅ "Start Session" should transition to session view
- ✅ LiveKit connection should work
- ✅ Chat interface should be functional

## Browser Compatibility Testing

Test in major browsers:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Mobile Responsiveness

- ✅ Welcome page should work on mobile
- ✅ Components page should be responsive
- ✅ Session view should work on touch devices

## Performance Checks

- ✅ Initial page load should be under 3 seconds
- ✅ No console errors in browser developer tools
- ✅ No memory leaks during session transitions
- ✅ VoiceBall animation should be smooth

## Security Headers (Check Network Tab)

- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: origin-when-cross-origin`
- ✅ CORS headers present on API routes

## Common Issues & Solutions

### Issue: White screen after "Start Session"

**Solution**: Check browser console for errors. Likely missing environment variables or network issues.

### Issue: 404 on any route

**Solution**: Verify deployment includes all pages. Check if server-side rendering is enabled.

### Issue: Components page shows errors

**Solution**: Verify all UI components are properly exported and imported.

### Issue: API returns CORS errors

**Solution**: Check middleware is deployed and CORS headers are set.

## Automated Testing Commands

Run these locally before deployment:

```bash
# Build with linting (should pass)
npm run build

# Lint check (should pass)
npm run lint

# Type check (should pass)
npx tsc --noEmit

# Format check (optional)
npm run format:check
```

## Success Criteria

✅ All routes load without errors
✅ All interactive elements work
✅ Error states show user-friendly messages
✅ No JavaScript console errors
✅ Mobile responsive
✅ Fast loading times
✅ Proper error boundaries

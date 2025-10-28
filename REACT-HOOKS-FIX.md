# React Hooks Error - Complete Fix

## Error Message
```
Uncaught TypeError: Cannot read properties of null (reading 'useState')
Warning: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

## Root Cause
This error occurs when there are multiple copies of React in your application, usually caused by:
1. Vite caching old versions of React modules
2. Browser caching old JavaScript bundles
3. Node modules having duplicate React instances

## Complete Fix - Follow ALL Steps

### Step 1: Stop the Dev Server
```bash
# Press Ctrl+C in the terminal where dev server is running
# Or kill all Vite processes:
pkill -f vite
```

### Step 2: Clean All Caches
```bash
cd /Users/Apple/Documents/GitHub/spacoLG_Eservice_App

# Run the clean script:
./clean-restart.sh

# OR manually:
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist
npm cache clean --force
```

### Step 3: Clear Browser Cache (CRITICAL!)

**For Chrome/Brave/Edge:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**OR:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage" in left sidebar
4. Check all boxes
5. Click "Clear site data"

**OR use keyboard shortcut:**
- Mac: `Cmd + Shift + Delete`
- Windows/Linux: `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Select "All time"
- Click "Clear data"

### Step 4: Close and Reopen Browser
Sometimes the browser keeps React in memory. Close ALL browser windows and restart.

### Step 5: Start Fresh Dev Server
```bash
npm run dev
```

### Step 6: Open in Incognito/Private Window (Testing)
This ensures no extensions or cached data interfere:
- Chrome: Cmd+Shift+N (Mac) or Ctrl+Shift+N (Windows)
- Navigate to: http://localhost:5174

## Verification

After following all steps, you should see:

✅ No React hooks errors in console
✅ Application loads normally
✅ ThemeProvider works correctly

## If Issue Persists

### Check 1: Verify Single React Version
```bash
npm list react react-dom
```

Should show: `react@18.3.1` and `react-dom@18.3.1` everywhere (all "deduped")

### Check 2: Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check 3: Check for Symlinks
```bash
ls -la node_modules/react
ls -la node_modules/react-dom
```

Should NOT be symlinks. If they are, delete and reinstall:
```bash
rm -rf node_modules/react node_modules/react-dom
npm install
```

### Check 4: Browser Extensions
Some browser extensions inject their own React, causing conflicts.

**Disable all extensions:**
- Open in incognito mode (extensions disabled by default)
- If it works in incognito, one of your extensions is the culprit

**Common problematic extensions:**
- React DevTools (usually safe, but can cause issues if outdated)
- Redux DevTools
- Any extension that modifies React apps

**Solution:**
1. Update React DevTools to latest version
2. Disable/remove problematic extensions
3. Or use incognito mode for development

### Check 5: Vite Config
Verify your [vite.config.js](vite.config.js) has:

```javascript
resolve: {
    alias: {
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom']
}
```

## Quick Fix Script

Run this one-liner to clean everything:
```bash
pkill -f vite; rm -rf node_modules/.vite .vite dist; npm cache clean --force; npm run dev
```

Then:
1. Clear browser cache (Cmd+Shift+Delete)
2. Hard reload (Cmd+Shift+R)

## Prevention

To prevent this from happening again:

1. **Always use npm dedupe after adding new packages:**
   ```bash
   npm dedupe
   ```

2. **Clear Vite cache periodically:**
   ```bash
   rm -rf node_modules/.vite
   ```

3. **Use the clean-restart script when switching branches:**
   ```bash
   ./clean-restart.sh
   ```

4. **Clear browser cache after major updates:**
   - Use DevTools → Network → Disable cache (while DevTools open)
   - Or frequently hard reload (Cmd+Shift+R)

## Technical Explanation

### Why This Happens

React uses internal state to manage hooks. When multiple copies of React exist:
1. Component imports React from version A
2. React DOM imports React from version B
3. React A creates state
4. React B tries to read state → NULL → Error

### The Fix

1. **Vite aliases** force all imports to use the SAME React instance
2. **Dedupe** in resolve tells Vite to never load multiple versions
3. **Cache clearing** removes old bundled code with duplicate React
4. **Browser cache clearing** removes old JavaScript files served to browser

### Verification That It's Fixed

Open browser console and run:
```javascript
// Check if React is loaded
console.log(React)

// Check React version
import('react').then(R => console.log(R.version))
```

Should show: `18.3.1` with no errors

## Summary

The issue is **browser caching**. The files on disk are correct, but your browser is serving old cached JavaScript files that have the duplicate React issue.

**The nuclear option** (guaranteed to work):
```bash
# Terminal 1: Stop and clean
pkill -f vite
rm -rf node_modules/.vite .vite dist node_modules/.cache
npm cache clean --force

# Terminal 2: Clear browser
# 1. Close ALL browser windows
# 2. Reopen browser
# 3. Open DevTools (F12)
# 4. Go to Application → Clear Storage → Clear All

# Terminal 1: Start fresh
npm run dev

# Browser: Hard reload
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R
```

This will 100% fix the issue by clearing everything and starting fresh.

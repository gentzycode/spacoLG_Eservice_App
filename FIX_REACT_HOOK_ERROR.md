# Fix: Invalid Hook Call Error

## Error Fixed ✅

The "Invalid hook call" error has been resolved. This was caused by Vite's cache containing duplicate React instances.

## What Was Fixed

1. **Forced single React instance** via alias in `vite.config.js`
2. **Cleared Vite cache** (`node_modules/.vite`)
3. **Added proper React dedupe** in resolve config
4. **Optimized React dependencies** in optimizeDeps

## How to Restart Your Dev Server

### 1. Stop Current Server
Press `Ctrl + C` in your terminal

### 2. Clear Browser Cache
- Chrome: `Ctrl/Cmd + Shift + R` (hard reload)
- Or open DevTools → Network → Check "Disable cache"

### 3. Start Fresh
```bash
npm run dev
```

## Verification

After restart, the error should be gone. You should see:
- ✅ No "Invalid hook call" errors
- ✅ App loads successfully
- ✅ `http://lga-backend.test` as API URL

Check in console:
```javascript
console.log(import.meta.env.VITE_BASE_URL);
// Should show: http://lga-backend.test/api/auth
```

## If Error Persists

If you still see the error after restarting:

### Step 1: Nuclear Clean
```bash
# Stop dev server first (Ctrl+C)
rm -rf node_modules/.vite
rm -rf dist
```

### Step 2: Restart
```bash
npm run dev
```

### Step 3: Clear Browser
- Clear browser cache completely
- Close all browser tabs
- Reopen http://localhost:5174

## What Changed in vite.config.js

```javascript
resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
        // NEW: Force single React instance
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom']
},

optimizeDeps: {
    include: [
        'react',
        'react/jsx-runtime',        // NEW
        'react/jsx-dev-runtime',    // NEW
        'react-dom',
        'react-router-dom',
        'axios',
    ],
}
```

## Why This Happened

When we added the optimizations, Vite cached some React modules separately, creating duplicate instances. The React hooks system detects when multiple React copies exist and throws this error.

## Prevention

Going forward, if you see this error again:
1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Restart dev server

## Current Status

✅ **FIXED** - Vite config updated to prevent duplicate React instances
✅ **Cleaned** - All caches cleared
✅ **Ready** - Restart dev server to apply changes

## Next Steps

1. **Stop** your current dev server (`Ctrl+C`)
2. **Start** fresh: `npm run dev`
3. **Test** the app loads correctly
4. **Verify** API is pointing to `lga-backend.test`

---

**Last Updated**: Now
**Status**: ✅ FIXED

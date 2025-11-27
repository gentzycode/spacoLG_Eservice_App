# Environment Variables - Quick Check

## Current Configuration (.env)

```env
VITE_BASE_URL=http://lga-backend.test/api/auth
VITE_ADMIN_BASE_URL=http://lga-backend.test/api/admin
VITE_PAYSTACK_PUBLIC_KEY=pk_test_5850a26e438bc617fe8157f1d5980e20a871b510
VITE_FRONTEND_URL=http://localhost:5174
```

## How to Apply Changes

### 1. Stop Dev Server
Press `Ctrl + C` in the terminal where `npm run dev` is running

### 2. Restart Dev Server
```bash
npm run dev
```

### 3. Verify in Browser Console
Open browser DevTools console and type:
```javascript
console.log(import.meta.env.VITE_BASE_URL);
// Should show: http://lga-backend.test/api/auth
```

## Common Issues

### Issue: Still pointing to old URL
**Solution**: Make sure you've restarted the dev server

### Issue: Getting CORS errors with local backend
**Solution**: Add CORS middleware to your Laravel backend:

```php
// In Laravel: config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5174'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Issue: "lga-backend.test" not resolving
**Solution**: Add to `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 lga-backend.test
```

## Quick Test API Connection

Run this in browser console after restart:
```javascript
// Test API connection
fetch(import.meta.env.VITE_BASE_URL + '/test')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

## Environment-Specific Files

For different environments, you can create:
- `.env.development` - Local development
- `.env.staging` - Staging server
- `.env.production` - Production server

Vite automatically loads the correct file based on the mode:
```bash
npm run dev        # Uses .env.development (or .env)
npm run build      # Uses .env.production
```

## Current Setup Check

✅ Environment variables properly prefixed with `VITE_`
✅ Local backend URL configured
✅ Paystack test key set
✅ Frontend URL set

**Next Step**: Restart dev server to apply changes!

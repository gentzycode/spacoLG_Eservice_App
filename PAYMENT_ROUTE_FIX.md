# Payment Route Fix

## Issue
The route `api/auth/api/auth/invoices-v2/6/initialize-payment` could not be found.

## Root Cause
The URL was being duplicated because:
1. `paymentService.js` was using `apiClient` which has base URL `/api/auth`
2. The path was also starting with `/api/auth`
3. Result: `/api/auth` + `/api/auth/invoices-v2/...` = doubled path

## Solution

### 1. Updated `paymentService.js`
**File**: `src/apis/paymentService.js`

**Changed**:
- From: `apiClient` with path `/api/auth/invoices-v2/{id}/initialize-payment`
- To: `adminApiClient` with path `invoice-manager/invoices/{id}/initialize-payment`

**Reason**: Other invoice API calls use `adminApiClient` with `invoice-manager/invoices` prefix

### 2. Added Route to admin.php
**File**: `routes/api/admin.php`

**Added** (line 166):
```php
Route::post('/invoices/{id}/initialize-payment', 'App\Http\Controllers\Api\Auth\InvoiceV2Controller@initializePayment')->name('api.auth.initializePayment.invoices_v2');
```

**Location**: Inside the `invoice-manager` route group

## Correct API Path
The payment initialization endpoint is now accessible at:

```
POST {ADMIN_BASE_URL}/invoice-manager/invoices/{id}/initialize-payment
```

Example:
```
POST http://localhost:8000/api/auth/admin/invoice-manager/invoices/6/initialize-payment
```

## Testing
Restart your frontend dev server and test again:

```bash
cd /Users/Apple/Documents/GitHub/LGA-BACKEND/YenagoaFrontend
npm run dev
```

Then click "Pay Online" on an invoice and select a gateway.

## Files Modified
1. ✅ `src/apis/paymentService.js` - Changed API client and path
2. ✅ `routes/api/admin.php` - Added initialize-payment route

The route should now work correctly!

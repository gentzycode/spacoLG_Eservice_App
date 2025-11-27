# Monnify Frontend Integration Guide

## Overview

This guide provides step-by-step instructions for integrating Monnify payment gateway into the Yenagoa LGA Revenue System frontend.

---

## Files Created

### 1. Payment Component
**Location:** `src/protected/components/invoices/MonnifyPaymentModal.jsx`

**Purpose:** Complete Monnify payment modal with support for:
- Online payments (Card/Bank Transfer)
- Offline payments (Dedicated Account Number)
- USSD code generation

### 2. API Functions
**Location:** `src/apis/authActions.js` (lines 707-858)

**Functions Added:**
- `initializeMonnifyPayment()` - Initialize online payment
- `initializeMonnifyOfflinePayment()` - Initialize offline payment
- `verifyMonnifyTransaction()` - Verify transaction status
- `generateMonnifyUSSD()` - Generate USSD code
- `getMonnifyUSSDBanks()` - Get supported banks for USSD
- `getMonnifyOfflinePaymentDetails()` - Get offline payment details
- `cancelMonnifyOfflinePayment()` - Cancel offline payment
- `getMonnifyStatistics()` - Get payment statistics
- `getMonnifyTransactions()` - Get transaction list
- `initiateMonnifyRefund()` - Initiate refund (Super Admin)
- `getMonnifyWalletBalance()` - Get wallet balance (Super Admin)
- `getMonnifyDashboard()` - Get dashboard stats (Super Admin)
- `toggleMonnifyMode()` - Toggle test/live mode (Super Admin)

### 3. Super Admin Updates
**Location:** `src/protected/super_admin/pages/PaymentGateways.jsx` (line 372)

**Change:** Added Monnify icon to the gateway icon map.

---

## How to Use Monnify Payment Modal

### Step 1: Import the Component

```javascript
import MonnifyPaymentModal from '../components/invoices/MonnifyPaymentModal';
```

### Step 2: Add State Management

```javascript
const [showMonnifyModal, setShowMonnifyModal] = useState(false);
```

### Step 3: Use the Component

```javascript
{showMonnifyModal && (
    <MonnifyPaymentModal
        token={token}
        invoice={selectedInvoice}
        customerInfo={{
            name: user.name,
            email: user.email,
            phone: user.phone
        }}
        onClose={() => setShowMonnifyModal(false)}
        onPaymentSuccess={() => {
            setShowMonnifyModal(false);
            // Refresh invoice data
            fetchInvoices();
        }}
    />
)}
```

---

## Complete Integration Example

### Updating Invoice Payment Page

**File:** `src/protected/pages/Invoices.jsx` (or wherever invoice payments are handled)

```javascript
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import MonnifyPaymentModal from '../components/invoices/MonnifyPaymentModal';
import WalletTokenPaymentModal from '../components/invoices/WalletTokenPaymentModal';
import { getEnabledPaymentGateways } from '../../apis/authActions';

const InvoicePaymentPage = ({ invoice }) => {
    const { token, user } = useContext(AuthContext);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showMonnifyModal, setShowMonnifyModal] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [gateways, setGateways] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGateways = async () => {
        setIsLoading(true);
        try {
            const response = await getEnabledPaymentGateways(token);
            setGateways(response.data || []);
        } catch (err) {
            console.error('Failed to fetch gateways:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentGatewaySelect = (gateway) => {
        const gatewayName = gateway.gateway_name.toLowerCase();

        switch(gatewayName) {
            case 'monnify':
                setShowMonnifyModal(true);
                break;
            case 'e-wallet':
            case 'token':
                setShowWalletModal(true);
                break;
            default:
                // Handle other gateways
                console.log('Gateway not yet implemented:', gatewayName);
        }

        setShowPaymentModal(false);
    };

    return (
        <div>
            {/* Your invoice display */}
            <button onClick={() => {
                fetchGateways();
                setShowPaymentModal(true);
            }}>
                Pay Invoice
            </button>

            {/* Payment Gateway Selection Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>

                        {isLoading ? (
                            <div className="text-center py-8">Loading payment methods...</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {gateways.map((gateway) => (
                                    <button
                                        key={gateway.id}
                                        onClick={() => handlePaymentGatewaySelect(gateway)}
                                        className="p-4 border-2 rounded-lg hover:border-blue-500 transition-all"
                                    >
                                        {gateway.logo_url ? (
                                            <img
                                                src={gateway.logo_url}
                                                alt={gateway.gateway_name}
                                                className="h-12 mx-auto mb-2"
                                            />
                                        ) : (
                                            <div className="text-3xl mb-2">
                                                {gateway.gateway_name === 'Monnify' && '🔷'}
                                                {gateway.gateway_name === 'E-Wallet' && '👛'}
                                                {gateway.gateway_name === 'Token' && '🎟️'}
                                            </div>
                                        )}
                                        <p className="font-semibold">{gateway.gateway_name}</p>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="mt-6 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Monnify Payment Modal */}
            {showMonnifyModal && (
                <MonnifyPaymentModal
                    token={token}
                    invoice={invoice}
                    customerInfo={{
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }}
                    onClose={() => setShowMonnifyModal(false)}
                    onPaymentSuccess={() => {
                        setShowMonnifyModal(false);
                        // Refresh invoice/payment data
                        window.location.reload(); // Or use a better state update method
                    }}
                />
            )}

            {/* Wallet/Token Payment Modal */}
            {showWalletModal && (
                <WalletTokenPaymentModal
                    token={token}
                    agentId={user.id}
                    invoice={invoice}
                    onClose={() => setShowWalletModal(false)}
                    onPaymentSuccess={() => {
                        setShowWalletModal(false);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
};

export default InvoicePaymentPage;
```

---

## Payment Flow

### Online Payment Flow

1. User selects "Monnify" from payment gateway list
2. `MonnifyPaymentModal` opens
3. User selects "Card Payment" mode
4. User clicks "Proceed to Checkout"
5. Frontend calls `initializeMonnifyPayment()`
6. User is redirected to Monnify checkout page
7. User completes payment on Monnify
8. Monnify redirects back to app
9. Webhook updates payment status in backend
10. Frontend verifies payment using `verifyMonnifyTransaction()`

### Offline Payment Flow (Bank Transfer)

1. User selects "Monnify" from payment gateway list
2. `MonnifyPaymentModal` opens
3. User selects "Bank Transfer" mode
4. User clicks "Generate Account Number"
5. Frontend calls `initializeMonnifyOfflinePayment()`
6. Modal displays dedicated account details
7. User copies account number
8. User transfers exact amount from their bank
9. Monnify confirms payment automatically
10. Webhook updates payment status
11. Invoice is marked as paid

### USSD Payment Flow

1. User selects "Monnify" from payment gateway list
2. `MonnifyPaymentModal` opens
3. User selects "USSD Code" mode
4. Frontend calls `getMonnifyUSSDBanks()` to load banks
5. User selects their bank
6. User clicks "Generate USSD Code"
7. Frontend calls `generateMonnifyUSSD()`
8. Modal displays USSD code
9. User dials code on their phone
10. User follows USSD prompts to complete payment
11. Webhook updates payment status

---

## Super Admin Integration

### Viewing Monnify Dashboard

```javascript
import { getMonnifyDashboard } from '../../apis/authActions';

const MonnifyDashboardPage = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await getMonnifyDashboard(token);
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
        }
    };

    return (
        <div>
            <h1>Monnify Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-100 rounded">
                    <p>Total Transactions</p>
                    <h2>{stats?.statistics.totalTransactions}</h2>
                </div>
                <div className="p-4 bg-green-100 rounded">
                    <p>Successful</p>
                    <h2>{stats?.statistics.successfulTransactions}</h2>
                </div>
                <div className="p-4 bg-yellow-100 rounded">
                    <p>Total Amount</p>
                    <h2>₦{stats?.statistics.totalAmount.toLocaleString()}</h2>
                </div>
            </div>
        </div>
    );
};
```

### Managing Monnify Gateway

The Super Admin can manage Monnify through the existing Payment Gateways page at:
`/super-admin/payment-gateways`

**Features Available:**
- ✅ View Monnify gateway status
- ✅ Enable/Disable Monnify
- ✅ Edit Monnify credentials
- ✅ View configuration
- ✅ Toggle test/live mode
- ✅ View statistics

---

## API Reference

### Frontend API Functions

#### 1. Initialize Online Payment

```javascript
import { initializeMonnifyPayment } from '../../apis/authActions';

const response = await initializeMonnifyPayment(token, {
    amount: 10000,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '08012345678',
    description: 'Payment for invoice #INV-001',
    invoice_id: 123
});

// Response
{
    status: 'success',
    message: 'Transaction initialized successfully',
    data: {
        transactionReference: 'MNFY|20|20250113|000001',
        paymentReference: 'REF_1705152000_001',
        checkoutUrl: 'https://sandbox.monnify.com/checkout/...',
        amount: 10000,
        customerName: 'John Doe',
        customerEmail: 'john@example.com'
    }
}
```

#### 2. Initialize Offline Payment

```javascript
import { initializeMonnifyOfflinePayment } from '../../apis/authActions';

const response = await initializeMonnifyOfflinePayment(token, {
    amount: 10000,
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    description: 'Payment for invoice #INV-002',
    invoice_id: 124
});

// Response
{
    status: 'success',
    message: 'Offline payment initialized successfully',
    data: {
        paymentReference: 'REF_1705152000_002',
        amount: 10000,
        accountNumber: '1234567890',
        bankName: 'Wema Bank',
        accountName: 'MONNIFY/YOUR_BUSINESS',
        expiryDate: '2025-01-14 12:00:00'
    }
}
```

#### 3. Generate USSD Code

```javascript
import { generateMonnifyUSSD } from '../../apis/authActions';

const response = await generateMonnifyUSSD(token, {
    payment_reference: 'REF_1705152000_002',
    bank_code: '058' // GTBank
});

// Response
{
    status: 'success',
    data: {
        ussdCode: '*737*2*10000*1234567890#',
        bankName: 'GTBank'
    }
}
```

#### 4. Get USSD Banks

```javascript
import { getMonnifyUSSDBanks } from '../../apis/authActions';

const response = await getMonnifyUSSDBanks(token);

// Response
{
    status: 'success',
    data: [
        { bankCode: '058', bankName: 'GTBank' },
        { bankCode: '033', bankName: 'United Bank for Africa' },
        { bankCode: '011', bankName: 'First Bank of Nigeria' }
    ]
}
```

#### 5. Verify Transaction

```javascript
import { verifyMonnifyTransaction } from '../../apis/authActions';

const response = await verifyMonnifyTransaction(token, 'MNFY|20|20250113|000001');

// Response
{
    status: 'success',
    message: 'Transaction verified successfully',
    data: {
        transactionReference: 'MNFY|20|20250113|000001',
        paymentReference: 'REF_1705152000_001',
        status: 'PAID',
        paymentStatus: 'PAID',
        amount: 10000,
        amountPaid: 10000,
        paymentMethod: 'CARD',
        paidOn: '2025-01-13 12:05:00'
    }
}
```

---

## Testing the Integration

### Step 1: Add Monnify Gateway (Super Admin)

1. Login as Super Admin
2. Navigate to Payment Gateways page
3. Click "Add Gateway"
4. Fill in details:
   - **Name:** Monnify
   - **Slug:** monnify
   - **Public Key:** MK_TEST_61NL3RDE8U
   - **Secret Key:** 06VJJ2CRS152DMHHGVB1ZPKKYL9WYR0D
   - **Description:** Nigerian payment gateway by TeamApt
   - **Logo URL:** (optional)
   - **Is Enabled:** ✓
   - **Test Mode:** ✓
5. Save

### Step 2: Test Online Payment

1. Login as regular user
2. View an unpaid invoice
3. Click "Pay Invoice"
4. Select "Monnify"
5. Choose "Card Payment"
6. Click "Proceed to Checkout"
7. On Monnify page, use test card:
   - **Card:** 5060666666666666666
   - **CVV:** 123
   - **Expiry:** 12/25
   - **PIN:** 1234
   - **OTP:** 123456
8. Complete payment
9. Verify invoice is marked as paid

### Step 3: Test Offline Payment

1. Select "Monnify" from payment options
2. Choose "Bank Transfer"
3. Click "Generate Account Number"
4. Note the account details
5. Transfer exact amount from your test bank
6. Wait for webhook confirmation (usually instant in sandbox)
7. Verify invoice is marked as paid

### Step 4: Test USSD Payment

1. Select "Monnify" from payment options
2. Choose "USSD Code"
3. Select "GTBank" from dropdown
4. Click "Generate USSD Code"
5. Copy the generated code
6. (In production) Dial the code on your phone
7. Follow prompts to complete payment

---

## Troubleshooting

### Issue: "Failed to initialize payment"

**Solutions:**
1. Check if Monnify gateway is enabled in Super Admin
2. Verify credentials in Payment Gateway settings
3. Check browser console for detailed error
4. Ensure backend is running and accessible

### Issue: "Failed to fetch payment gateways"

**Solutions:**
1. Check network connection
2. Verify JWT token is valid
3. Check backend `/paymentgateway/enabled` endpoint
4. Review backend logs for errors

### Issue: Checkout page not loading

**Solutions:**
1. Check if `checkoutUrl` is in response
2. Verify Monnify credentials are correct
3. Check if `MONNIFY_MODE=test` in backend `.env`
4. Clear browser cache

### Issue: USSD banks not loading

**Solutions:**
1. Check network request in browser DevTools
2. Verify backend route `/monnify/ussd/banks` exists
3. Check backend logs for Monnify API errors
4. Ensure Monnify credentials are valid

---

## Production Deployment

### Frontend Changes Required

1. **Update API Base URL:**
   - Ensure `baseUrl.js` points to production backend

2. **Update Redirect URLs:**
   - No frontend changes needed (handled by backend)

3. **Test in Production:**
   - Add Monnify production credentials in Super Admin
   - Toggle "Test Mode" OFF
   - Test with real bank account (small amount first)

### Backend Changes Required

1. **Update `.env` file:**
   ```bash
   MONNIFY_API_KEY=MK_PROD_YOUR_LIVE_KEY
   MONNIFY_SECRET_KEY=YOUR_LIVE_SECRET
   MONNIFY_MODE=live
   MONNIFY_BASE_URL=https://api.monnify.com
   MONNIFY_REDIRECT_URL=https://your-domain.com/payment/verify
   MONNIFY_WEBHOOK_URL=https://your-domain.com/api/webhooks/monnify
   ```

2. **Configure Webhooks in Monnify Dashboard:**
   - Use production webhook URL (not ngrok)
   - Enable all webhook events

3. **Security:**
   - Enable HTTPS
   - Add IP whitelisting
   - Rotate API keys regularly

---

## Component Props Reference

### MonnifyPaymentModal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `token` | string | Yes | JWT authentication token |
| `invoice` | object | Yes | Invoice object with `id`, `amount`, `reference_number`, etc. |
| `customerInfo` | object | Yes | Customer info with `name`, `email`, `phone` |
| `onClose` | function | Yes | Callback when modal is closed |
| `onPaymentSuccess` | function | Yes | Callback when payment is successful |

### Invoice Object Structure

```javascript
{
    id: 123,
    reference_number: 'INV-2025-001',
    amount: 50000,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    status: 'unpaid',
    // ... other fields
}
```

### Customer Info Object Structure

```javascript
{
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '08012345678'
}
```

---

## Additional Resources

### Backend Documentation
- **Complete Integration:** `/MONNIFY_INTEGRATION_DOCUMENTATION.md`
- **Quick Setup:** `/MONNIFY_QUICK_SETUP_GUIDE.md`
- **Testing Guide:** `/MONNIFY_TESTING_GUIDE.md`

### External Resources
- **Monnify Dashboard:** https://app.monnify.com
- **Monnify API Docs:** https://developers.monnify.com
- **Support:** support@monnify.com

---

## Next Steps

1. ✅ Component created and documented
2. ✅ API functions added to authActions
3. ✅ Super Admin gateway icon updated
4. ⏳ Integrate into invoice payment page
5. ⏳ Test with sandbox credentials
6. ⏳ Deploy to production with live credentials

---

**Last Updated:** 2025-01-13
**Version:** 1.0.0
**Author:** Claude Code

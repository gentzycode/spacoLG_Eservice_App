# Online Payment Components - Usage Guide

## Overview
Complete frontend implementation for Monnify **ONLINE** payment methods (Card, Bank Transfer & USSD payments).

> **Note**: These are DIGITAL payment methods, not physical cash payments. The components were previously named "Offline Payment" but have been renamed to "Online Payment" for clarity.

## Components Created

### 1. **OnlinePayment** (`/src/pages/OnlinePayment.jsx`)
Main page that allows users to choose between Bank Transfer and USSD payment methods.

### 2. **BankTransferInstructions** (`/src/components/payments/BankTransferInstructions.jsx`)
Displays bank account details with copyable fields for bank transfer payments.

### 3. **USSDPayment** (`/src/components/payments/USSDPayment.jsx`)
Allows bank selection and displays USSD dial code for instant payment.

### 4. **PaymentStatusPoller** (`/src/components/payments/PaymentStatusPoller.jsx`)
Modal that polls payment status in real-time and auto-redirects on success.

---

## Payment Methods Supported

### 1. Card Payment
- Redirects to Monnify checkout page
- Supports Verve, Mastercard, Visa
- 3D Secure authentication
- Instant payment confirmation

### 2. Bank Transfer (ONLINE)
- Generates temporary account number
- Transfer from any bank app or internet banking
- Automatic payment detection
- 24-hour account expiry

### 3. USSD Payment (ONLINE)
- Dial code on any mobile phone
- No internet required (for customer)
- Works with all major Nigerian banks
- Instant payment processing

---

## How to Use

### Navigating to Online Payment

From any page where you want to initiate online payment, use React Router's `navigate()` with state:

```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
    const navigate = useNavigate();

    const handleOnlinePayment = () => {
        navigate('/payment/online', {
            state: {
                amount: 5000.00,
                description: 'Daily Ticket Payment',
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '08012345678', // optional
                invoiceId: 123, // optional
            }
        });
    };

    return (
        <button onClick={handleOnlinePayment}>
            Pay Online
        </button>
    );
};
```

### Required State Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | Number | Yes | Payment amount in naira |
| `description` | String | Yes | Payment description/purpose |
| `customerName` | String | Yes | Customer's full name |
| `customerEmail` | String | Yes | Customer's email address |
| `customerPhone` | String | No | Customer's phone number |
| `invoiceId` | Number | No | Invoice ID (if paying for invoice) |

---

## User Flow

### Bank Transfer Flow

1. User clicks "Pay Online" button
2. Navigates to `/payment/online` with payment details
3. User selects "Bank Transfer" option
4. System generates temporary account number
5. User sees:
   - Account number (copyable)
   - Bank name
   - Account name
   - Exact amount to transfer
   - Payment reference
   - 24-hour expiry countdown
6. User transfers money from their bank app
7. User clicks "I've Made the Payment"
8. PaymentStatusPoller starts checking status every 5 seconds
9. On payment confirmation:
   - Shows success message
   - Auto-redirects to receipt page after 5 seconds
   - Option to skip countdown and view receipt immediately

### USSD Payment Flow

1. User clicks "Pay Online" button
2. Navigates to `/payment/online` with payment details
3. User selects "USSD Payment" option
4. User selects their bank from dropdown list
5. System generates USSD code (e.g., `*737*000*1234567890*5000#`)
6. User sees:
   - Large, copyable USSD code
   - Instructions to dial on phone
   - Selected bank name
   - Amount to pay
7. User dials code on phone and enters PIN
8. Payment processed instantly on phone
9. User clicks "I've Made the Payment"
10. PaymentStatusPoller verifies payment
11. Success → Auto-redirect to receipt

---

## Component Features

### OnlinePayment Component

**Features:**
- Payment method selection (Bank Transfer vs USSD)
- Payment summary display
- Form validation
- Error handling
- Loading states
- Dark mode support
- Mobile responsive
- Back button with confirmation

**State Management:**
```javascript
const [paymentMethod, setPaymentMethod] = useState(null); // 'bank_transfer' or 'ussd'
const [loading, setLoading] = useState(false);
const [paymentData, setPaymentData] = useState(null);
const [error, setError] = useState(null);
```

**API Call:**
```javascript
const response = await apiClient.post('/monnify/initialize-offline', {
    amount: amount,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    description: description,
    invoice_id: invoiceId,
});
```

---

### BankTransferInstructions Component

**Props:**
```javascript
{
    paymentData: {
        accountNumber: "1234567890",
        bankName: "Wema Bank",
        accountName: "MONNIFY-YENAGOA",
        paymentReference: "MNFY_REF_123",
        expiryDate: "2024-01-01T12:00:00Z",
        amount: 5000
    },
    amount: 5000.00,
    description: "Daily Ticket Payment",
    onBack: () => {} // Function to go back to method selection
}
```

**Features:**
- Copy-to-clipboard for each field
- Visual copy confirmation
- 24-hour countdown timer
- "I've Made the Payment" button
- "I'll Pay Later" option
- Payment status polling modal
- Responsive design

---

### USSDPayment Component

**Props:**
```javascript
{
    paymentData: {
        paymentReference: "MNFY_REF_123",
        amount: 5000
    },
    amount: 5000.00,
    description: "Daily Ticket Payment",
    onBack: () => {} // Function to go back to method selection
}
```

**Features:**
- Auto-fetch supported banks from backend
- Bank selection dropdown
- Auto-generate USSD code on bank selection
- Large, copyable USSD display
- "Change Bank" option
- Payment verification flow
- Step-by-step instructions

**API Calls:**
```javascript
// Get supported banks
const response = await apiClient.get('/monnify/ussd/banks');

// Generate USSD code
const response = await apiClient.post('/monnify/ussd/generate', {
    payment_reference: paymentReference,
    bank_code: selectedBank.bankCode
});
```

---

### PaymentStatusPoller Component

**Props:**
```javascript
{
    paymentReference: "MNFY_REF_123",
    onClose: () => {},
    onSuccess: (data) => {}
}
```

**Features:**
- Polls every 5 seconds (configurable)
- Maximum 60 checks (5 minutes total)
- Progress indicator
- Manual "Check Status Now" button
- Multiple states: checking, pending, paid, failed, timeout
- Auto-redirect on success (5 second countdown)
- "View Receipt Now" skip option
- Graceful timeout handling
- Retry option on failure

**API Call:**
```javascript
const response = await apiClient.get(`/monnify/verify/${paymentReference}`);
```

---

## Backend Integration

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/monnify/initialize-offline` | POST | Generate bank account / initialize payment |
| `/api/monnify/ussd/banks` | GET | Get list of supported banks for USSD |
| `/api/monnify/ussd/generate` | POST | Generate USSD dial code |
| `/api/monnify/verify/{ref}` | GET | Verify payment status |

### Response Format

**Initialize Payment:**
```json
{
    "status": "success",
    "message": "Payment initialized successfully",
    "data": {
        "accountNumber": "1234567890",
        "bankName": "Wema Bank",
        "accountName": "MONNIFY-YENAGOA",
        "paymentReference": "MNFY_REF_123",
        "expiryDate": "2024-01-01T12:00:00Z",
        "amount": 5000
    }
}
```

**Verify Payment:**
```json
{
    "status": "success",
    "data": {
        "paymentStatus": "PAID",
        "transactionReference": "MNFY_REF_123",
        "amountPaid": 5000,
        "paidOn": "2024-01-01T11:30:00Z"
    }
}
```

---

## Styling & Theming

All components support **dark mode** via Tailwind CSS:

```javascript
// Light mode
className="bg-white text-gray-900"

// Dark mode
className="dark:bg-gray-800 dark:text-white"
```

**Color Scheme:**
- Primary: Blue (`blue-600`, `blue-700`)
- Success: Green (`green-500`, `green-600`)
- Error: Red (`red-500`, `red-600`)
- Warning: Yellow (`yellow-500`, `yellow-600`)

---

## Error Handling

### Common Errors

1. **Missing Payment Details**
   - Displayed when navigating without required state
   - Shows error message with "Go Back" button

2. **API Initialization Failure**
   - Network errors
   - Invalid payment data
   - Backend errors
   - Displays error message with retry option

3. **Payment Verification Timeout**
   - After 60 checks (5 minutes)
   - Shows timeout message
   - Provides "Check Again" button
   - Contact support option

4. **USSD Bank Not Selected**
   - Validates bank selection before generating code
   - Shows error toast notification

---

## Testing Checklist

### Functionality Testing

- [ ] Navigate to `/payment/online` with valid state
- [ ] Verify payment summary displays correctly
- [ ] Test Bank Transfer option
  - [ ] Account details display
  - [ ] Copy-to-clipboard works for each field
  - [ ] Expiry timer counts down
  - [ ] "I've Made the Payment" triggers status poller
- [ ] Test USSD option
  - [ ] Banks list loads
  - [ ] Select bank generates USSD code
  - [ ] USSD code is copyable
  - [ ] "I've Made the Payment" triggers status poller
- [ ] Test PaymentStatusPoller
  - [ ] Polls every 5 seconds
  - [ ] Manual check button works
  - [ ] Success triggers auto-redirect
  - [ ] Timeout shows appropriate message
  - [ ] Retry option works

### UI/UX Testing

- [ ] Dark mode works correctly
- [ ] Mobile responsive (all screen sizes)
- [ ] Animations smooth
- [ ] Toast notifications appear
- [ ] Loading states display
- [ ] All buttons functional
- [ ] Forms validate properly

### Integration Testing

- [ ] Backend endpoints respond correctly
- [ ] Payment verification works end-to-end
- [ ] Webhook updates transaction status
- [ ] Receipt page displays after payment
- [ ] Error scenarios handled gracefully

---

## Troubleshooting

### Issue: State data is lost on page refresh

**Solution**: Payment data is intentionally not persisted in localStorage for security. Users must complete payment in the same session.

### Issue: Payment status shows "pending" even after payment

**Possible Causes:**
1. Webhook not configured in Monnify dashboard
2. Backend not receiving webhook notifications
3. Payment still processing (wait a few minutes)

**Solution:**
- Check webhook configuration
- Verify backend logs
- Wait and retry status check

### Issue: USSD banks not loading

**Possible Causes:**
1. Backend API error
2. Network connectivity issue
3. Monnify API down

**Solution:**
- Check browser console for errors
- Verify backend endpoint is working
- Contact Monnify support

---

## Production Checklist

Before deploying to production:

- [ ] Update `.env` with production Monnify credentials
- [ ] Configure webhook URL in Monnify dashboard
- [ ] Test all payment methods with real transactions
- [ ] Verify dark mode works correctly
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure proper redirect URLs
- [ ] Brief customer support team
- [ ] Prepare customer-facing documentation

---

## Support

### For Issues

- **Email**: support@yenagoalga.gov.ng
- **Logs**: Check browser console for frontend errors
- **Backend**: `storage/logs/laravel.log`

### Documentation

- **This Guide**: Frontend usage guide
- **Integration Examples**: `/ONLINE_PAYMENT_INTEGRATION_EXAMPLE.md`
- **Backend Docs**: `/MONNIFY_COMPLETE_IMPLEMENTATION_SUMMARY.md`
- **Quick Reference**: `/MONNIFY_QUICK_REFERENCE.md`

---

## Version History

### v2.0 (Current)
- Renamed from "Offline Payment" to "Online Payment" for clarity
- Updated all routes from `/payment/offline` to `/payment/online`
- Updated component names from `OfflinePayment` to `OnlinePayment`
- Added comprehensive documentation

### v1.0
- Initial implementation
- Bank Transfer support
- USSD payment support
- Payment status polling
- Dark mode support

---

**Last Updated**: November 20, 2025
**Status**: Production Ready

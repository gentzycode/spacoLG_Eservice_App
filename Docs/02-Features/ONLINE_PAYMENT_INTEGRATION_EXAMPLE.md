# Online Payment Integration Example

## Quick Integration: Daily Tickets Page

Here's a complete example of how to add online payment to your existing Daily Tickets page.

> **Note**: This guide uses the updated naming convention. The payment route is `/payment/online` (previously `/payment/offline`).

---

## Step 1: Add Navigation Button

In your existing DailyTickets component, add a button to navigate to online payment:

```javascript
// In /src/protected/pages/DailyTickets.jsx
import { useNavigate } from 'react-router-dom';

const DailyTickets = () => {
    const navigate = useNavigate();
    // ... existing state and functions

    const handleOnlinePayment = (ticket) => {
        navigate('/payment/online', {
            state: {
                amount: ticket.amount || 2000.00,
                description: `Daily Ticket for ${ticket.vehicle_number}`,
                customerName: ticket.driver_name || user.name,
                customerEmail: ticket.email || user.email,
                customerPhone: ticket.phone_number || user.phone,
            }
        });
    };

    return (
        <div>
            {/* Your existing ticket form */}

            {/* Add this button alongside your existing payment options */}
            <button
                onClick={() => handleOnlinePayment(ticketData)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg">
                Pay Online (Bank Transfer / USSD)
            </button>
        </div>
    );
};
```

---

## Step 2: Add to Payment Options Modal

If you have a payment options modal, add online payment as an option:

```javascript
const PaymentOptionsModal = ({ ticket, onClose }) => {
    const navigate = useNavigate();

    const paymentOptions = [
        {
            id: 'online',
            title: 'Bank Transfer / USSD',
            description: 'Pay via bank transfer or dial a USSD code',
            icon: '🏦',
            color: 'blue',
            onClick: () => {
                navigate('/payment/online', {
                    state: {
                        amount: ticket.amount,
                        description: `Daily Ticket for ${ticket.vehicle_number}`,
                        customerName: ticket.driver_name,
                        customerEmail: ticket.email,
                        customerPhone: ticket.phone_number,
                    }
                });
                onClose();
            }
        },
        {
            id: 'card',
            title: 'Pay with Card',
            description: 'Instant payment with debit/credit card',
            icon: '💳',
            color: 'green',
            onClick: () => {
                // Your existing card payment logic
            }
        },
        // ... other payment options
    ];

    return (
        <div className="modal">
            <h2>Choose Payment Method</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {paymentOptions.map(option => (
                    <button
                        key={option.id}
                        onClick={option.onClick}
                        className={`p-6 rounded-lg border-2 border-${option.color}-500 hover:bg-${option.color}-50`}>
                        <div className="text-4xl mb-2">{option.icon}</div>
                        <h3 className="font-bold text-lg">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
```

---

## Step 3: Complete Example with Existing Workflow

Here's how to integrate online payment into an existing ticket creation workflow:

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../apis/apiClient';
import { toast } from 'react-toastify';

const CreateDailyTicket = () => {
    const navigate = useNavigate();
    const [ticketData, setTicketData] = useState({
        vehicle_number: '',
        driver_name: '',
        driver_phone: '',
        driver_email: '',
        amount: 2000.00,
    });
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!ticketData.vehicle_number || !ticketData.driver_name) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Show payment options
        setShowPaymentOptions(true);
    };

    // Handle online payment selection
    const handleOnlinePayment = () => {
        navigate('/payment/online', {
            state: {
                amount: ticketData.amount,
                description: `Daily Ticket for ${ticketData.vehicle_number}`,
                customerName: ticketData.driver_name,
                customerEmail: ticketData.driver_email,
                customerPhone: ticketData.driver_phone,
            }
        });
    };

    // Handle card payment selection
    const handleCardPayment = async () => {
        try {
            // Your existing Monnify card payment initialization
            const response = await apiClient.post('/monnify/initialize', {
                amount: ticketData.amount,
                customer_name: ticketData.driver_name,
                customer_email: ticketData.driver_email,
                customer_phone: ticketData.driver_phone,
                description: `Daily Ticket for ${ticketData.vehicle_number}`,
            });

            if (response.data.status === 'success') {
                // Redirect to Monnify checkout
                window.location.href = response.data.data.checkoutUrl;
            }
        } catch (error) {
            toast.error('Failed to initialize payment');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create Daily Ticket</h1>

            {!showPaymentOptions ? (
                // Ticket Form
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Vehicle Number *
                        </label>
                        <input
                            type="text"
                            value={ticketData.vehicle_number}
                            onChange={(e) => setTicketData({...ticketData, vehicle_number: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Driver Name *
                        </label>
                        <input
                            type="text"
                            value={ticketData.driver_name}
                            onChange={(e) => setTicketData({...ticketData, driver_name: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Driver Email *
                        </label>
                        <input
                            type="email"
                            value={ticketData.driver_email}
                            onChange={(e) => setTicketData({...ticketData, driver_email: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={ticketData.driver_phone}
                            onChange={(e) => setTicketData({...ticketData, driver_phone: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={ticketData.amount}
                            onChange={(e) => setTicketData({...ticketData, amount: parseFloat(e.target.value)})}
                            className="w-full px-4 py-2 border rounded-lg"
                            readOnly
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                        Proceed to Payment
                    </button>
                </form>
            ) : (
                // Payment Options
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Choose Payment Method</h2>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold mb-2">Ticket Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Vehicle:</span>
                                <span className="font-semibold">{ticketData.vehicle_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Driver:</span>
                                <span className="font-semibold">{ticketData.driver_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-semibold">
                                    ₦{ticketData.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Online Payment Option */}
                        <button
                            onClick={handleOnlinePayment}
                            className="bg-white border-2 border-blue-500 hover:bg-blue-50 rounded-lg p-6 text-left">
                            <div className="text-4xl mb-3">🏦</div>
                            <h3 className="font-bold text-lg mb-2">Bank Transfer / USSD</h3>
                            <p className="text-sm text-gray-600">
                                Get account details or dial USSD code to pay
                            </p>
                            <ul className="mt-3 space-y-1 text-xs text-gray-500">
                                <li>✓ No card needed</li>
                                <li>✓ Works with all banks</li>
                                <li>✓ Instant confirmation</li>
                            </ul>
                        </button>

                        {/* Card Payment Option */}
                        <button
                            onClick={handleCardPayment}
                            className="bg-white border-2 border-green-500 hover:bg-green-50 rounded-lg p-6 text-left">
                            <div className="text-4xl mb-3">💳</div>
                            <h3 className="font-bold text-lg mb-2">Pay with Card</h3>
                            <p className="text-sm text-gray-600">
                                Instant payment with debit or credit card
                            </p>
                            <ul className="mt-3 space-y-1 text-xs text-gray-500">
                                <li>✓ Fast and secure</li>
                                <li>✓ Immediate receipt</li>
                                <li>✓ Mastercard, Visa, Verve</li>
                            </ul>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowPaymentOptions(false)}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg">
                        ← Back to Form
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateDailyTicket;
```

---

## Step 4: Add to Invoice Payment

```javascript
// In InvoicesPage.jsx or InvoiceDetail.jsx
const PayInvoice = ({ invoice }) => {
    const navigate = useNavigate();

    const handleOnlinePayment = () => {
        navigate('/payment/online', {
            state: {
                amount: invoice.total_amount,
                description: `Invoice #${invoice.invoice_number} - ${invoice.description}`,
                customerName: invoice.customer_name,
                customerEmail: invoice.customer_email,
                customerPhone: invoice.customer_phone,
                invoiceId: invoice.id,
            }
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Payment Options</h3>

            <button
                onClick={handleOnlinePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center">
                <span className="mr-2">🏦</span>
                Pay via Bank Transfer / USSD
            </button>

            {/* Your other payment options */}
        </div>
    );
};
```

---

## Step 5: Test the Integration

1. **Navigate to Daily Tickets page**
2. **Fill in ticket details**
3. **Click "Proceed to Payment"**
4. **Select "Bank Transfer / USSD"**
5. **Choose payment method** (Bank Transfer or USSD)
6. **Complete payment** and verify status polling works

---

## Pro Tips

### 1. Pre-fill Customer Details from Auth Context

```javascript
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const MyComponent = () => {
    const { user } = useContext(AuthContext);

    const handleOnlinePayment = () => {
        navigate('/payment/online', {
            state: {
                amount: 5000,
                description: 'Daily Ticket',
                customerName: user.name,          // ✅ Pre-filled
                customerEmail: user.email,        // ✅ Pre-filled
                customerPhone: user.phone,        // ✅ Pre-filled
            }
        });
    };
};
```

### 2. Create Reusable Payment Button Component

```javascript
// /src/components/payments/OnlinePaymentButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OnlinePaymentButton = ({ amount, description, customerData, className }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/payment/online', {
            state: {
                amount,
                description,
                customerName: customerData.name,
                customerEmail: customerData.email,
                customerPhone: customerData.phone,
                invoiceId: customerData.invoiceId,
            }
        });
    };

    return (
        <button
            onClick={handleClick}
            className={className || "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"}>
            Pay Online (Bank Transfer / USSD)
        </button>
    );
};

export default OnlinePaymentButton;
```

Usage:
```javascript
<OnlinePaymentButton
    amount={2000}
    description="Daily Ticket"
    customerData={{
        name: user.name,
        email: user.email,
        phone: user.phone
    }}
/>
```

### 3. Add Payment Method Analytics

```javascript
const handleOnlinePayment = () => {
    // Track analytics
    if (window.gtag) {
        window.gtag('event', 'payment_method_selected', {
            method: 'online',
            amount: ticketData.amount,
            description: ticketData.description,
        });
    }

    navigate('/payment/online', {
        state: { /* ... */ }
    });
};
```

---

## Common Issues & Solutions

### Issue: State data is lost on page refresh

**Solution**: Payment data is intentionally not persisted. Users must complete payment in the same session. For recovery, you could:
- Store payment reference in localStorage
- Create a "Resume Payment" feature

### Issue: Customer details are missing

**Solution**: Always validate state before navigating:
```javascript
const handleOnlinePayment = () => {
    if (!user.email || !user.name) {
        toast.error('Please complete your profile first');
        navigate('/profile');
        return;
    }

    navigate('/payment/online', { state: { /* ... */ } });
};
```

---

## Naming Convention Changes

### Previous (v1.0):
- Component: `OfflinePayment.jsx`
- Route: `/payment/offline`
- Marketing: "Pay Offline"

### Current (v2.0):
- Component: `OnlinePayment.jsx` ✅
- Route: `/payment/online` ✅
- Marketing: "Pay Online" ✅

**Reason for Change**:
The term "offline" was confusing. These are ONLINE payment methods (Bank Transfer and USSD are digital/electronic payments). Monnify's true "Offline Collections" refers to physical cash payments at agent locations, which is a separate system.

---

## Next Steps

1. ✅ Copy the integration code above
2. ✅ Add online payment button to your existing pages
3. ✅ Test with sandbox credentials
4. ✅ Configure Monnify webhook for production
5. ✅ Monitor payment success rates

---

**Last Updated**: November 20, 2025
**Status**: Production Ready

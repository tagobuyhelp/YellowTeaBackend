# Checkout & Payment API Documentation

## Overview
This documentation covers the complete checkout and payment flow for the Yellow Tea eCommerce platform, including both online payments (Razorpay) and Cash on Delivery (COD).

## Base URL
```
https://your-domain.com/api/v1
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Get Available Payment Methods

### Endpoint
```
GET /payments/methods
```

### Description
Retrieve all available payment methods for checkout.

### Request
```javascript
// No authentication required
const response = await fetch('/api/v1/payments/methods', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});
```

### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": [
        {
            "id": "razorpay",
            "name": "Razorpay",
            "description": "Pay securely with cards, UPI, net banking, and wallets",
            "methods": [
                { "id": "card", "name": "Credit/Debit Card", "icon": "💳" },
                { "id": "upi", "name": "UPI", "icon": "📱" },
                { "id": "netbanking", "name": "Net Banking", "icon": "🏦" },
                { "id": "wallet", "name": "Digital Wallets", "icon": "👛" }
            ],
            "isActive": true
        },
        {
            "id": "cod",
            "name": "Cash on Delivery",
            "description": "Pay with cash when your order is delivered",
            "methods": [
                { "id": "cod", "name": "Cash on Delivery", "icon": "💵" }
            ],
            "isActive": true
        }
    ],
    "message": "Payment methods retrieved successfully"
}
```

---

## 2. Create Order (Checkout)

### Endpoint
```
POST /orders
```

### Description
Create a new order with selected payment method.

### Request Body
```json
{
    "orderItems": [
        {
            "product": "64f8a1b2c3d4e5f6a7b8c9d0",
            "quantity": 2,
            "price": 299.99
        }
    ],
    "shippingAddress": {
        "address": "123 Main Street",
        "city": "Mumbai",
        "postalCode": "400001",
        "country": "India",
        "phone": "+919876543210"
    },
    "paymentMethod": "razorpay", // or "cod"
    "itemsPrice": 599.98,
    "taxPrice": 59.99,
    "shippingPrice": 50.00,
    "totalPrice": 709.97
}
```

### Response (Success)
```json
{
    "status": "success",
    "statusCode": 201,
    "data": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "orderNumber": "YT-20241201-0001",
        "user": "64f8a1b2c3d4e5f6a7b8c9d2",
        "orderItems": [...],
        "shippingAddress": {...},
        "paymentMethod": "razorpay",
        "paymentResult": null,
        "itemsPrice": 599.98,
        "taxPrice": 59.99,
        "shippingPrice": 50.00,
        "totalPrice": 709.97,
        "isPaid": false,
        "paidAt": null,
        "isDelivered": false,
        "deliveredAt": null,
        "status": "pending",
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:30:00.000Z"
    },
    "message": "Order created successfully"
}
```

---

## 3. Online Payment Flow (Razorpay)

### 3.1 Create Razorpay Order

#### Endpoint
```
POST /payments/create-order
```

#### Description
Create a Razorpay payment order for online payment processing.

#### Request Body
```json
{
    "orderId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "amount": 70997, // Amount in paise (₹709.97 * 100)
    "currency": "INR",
    "receipt": "YT-20241201-0001"
}
```

#### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": {
        "id": "order_ABC123XYZ",
        "entity": "order",
        "amount": 70997,
        "amount_paid": 0,
        "amount_due": 70997,
        "currency": "INR",
        "receipt": "YT-20241201-0001",
        "status": "created",
        "attempts": 0,
        "notes": {},
        "created_at": 1701432600
    },
    "message": "Razorpay order created successfully"
}
```

### 3.2 Frontend Payment Integration

#### HTML/JavaScript Example
```html
<!DOCTYPE html>
<html>
<head>
    <title>Payment</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
    <button id="payButton">Pay Now</button>

    <script>
        document.getElementById('payButton').onclick = async function() {
            try {
                // 1. Create Razorpay order
                const orderResponse = await fetch('/api/v1/payments/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        orderId: '64f8a1b2c3d4e5f6a7b8c9d1',
                        amount: 70997,
                        currency: 'INR',
                        receipt: 'YT-20241201-0001'
                    })
                });
                
                const orderData = await orderResponse.json();
                
                // 2. Initialize Razorpay checkout
                const options = {
                    key: 'rzp_test_YOUR_KEY_ID', // Your Razorpay key
                    amount: orderData.data.amount,
                    currency: orderData.data.currency,
                    name: 'Yellow Tea',
                    description: 'Premium Tea Products',
                    image: 'https://your-logo-url.com/logo.png',
                    order_id: orderData.data.id,
                    handler: async function(response) {
                        // 3. Verify payment on backend
                        const verifyResponse = await fetch('/api/v1/payments/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        
                        const verifyData = await verifyResponse.json();
                        
                        if (verifyData.status === 'success') {
                            alert('Payment successful!');
                            window.location.href = '/order-success';
                        } else {
                            alert('Payment verification failed!');
                        }
                    },
                    prefill: {
                        name: 'John Doe',
                        email: 'john@example.com',
                        contact: '+919876543210'
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };
                
                const rzp = new Razorpay(options);
                rzp.open();
                
            } catch (error) {
                console.error('Payment error:', error);
                alert('Payment failed!');
            }
        };
    </script>
</body>
</html>
```

### 3.3 Verify Payment

#### Endpoint
```
POST /payments/verify
```

#### Description
Verify the payment signature and update order status.

#### Request Body
```json
{
    "razorpay_order_id": "order_ABC123XYZ",
    "razorpay_payment_id": "pay_XYZ789ABC",
    "razorpay_signature": "calculated_signature_hash"
}
```

#### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": {
        "order": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
            "orderNumber": "YT-20241201-0001",
            "isPaid": true,
            "paidAt": "2024-12-01T10:35:00.000Z",
            "status": "processing",
            "paymentResult": {
                "id": "pay_XYZ789ABC",
                "status": "captured",
                "update_time": "2024-12-01T10:35:00.000Z",
                "email_address": "john@example.com",
                "razorpay_order_id": "order_ABC123XYZ",
                "razorpay_payment_id": "pay_XYZ789ABC"
            }
        }
    },
    "message": "Payment verified successfully"
}
```

### 3.4 Get Payment Status

#### Endpoint
```
GET /payments/status/:orderId
```

#### Description
Check the current payment status of an order.

#### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": {
        "orderId": "64f8a1b2c3d4e5f6a7b8c9d1",
        "orderNumber": "YT-20241201-0001",
        "paymentStatus": "paid",
        "isPaid": true,
        "paidAt": "2024-12-01T10:35:00.000Z",
        "paymentMethod": "razorpay",
        "amount": 709.97
    },
    "message": "Payment status retrieved successfully"
}
```

---

## 4. Cash on Delivery (COD) Flow

### 4.1 Create COD Order

#### Process
1. Create order with `paymentMethod: "cod"`
2. Order is created with `isPaid: false`
3. Order status remains `pending` until delivery

#### Example Request
```json
{
    "orderItems": [...],
    "shippingAddress": {...},
    "paymentMethod": "cod",
    "itemsPrice": 599.98,
    "taxPrice": 59.99,
    "shippingPrice": 50.00,
    "totalPrice": 709.97
}
```

#### Response
```json
{
    "status": "success",
    "statusCode": 201,
    "data": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "orderNumber": "YT-20241201-0002",
        "paymentMethod": "cod",
        "isPaid": false,
        "status": "pending",
        "totalPrice": 709.97
    },
    "message": "COD order created successfully"
}
```

### 4.2 Mark COD Order as Paid (Admin Only)

#### Endpoint
```
PUT /orders/:id/mark-cod-paid
```

#### Description
Mark a COD order as paid when cash is collected during delivery.

#### Request
```javascript
const response = await fetch(`/api/v1/orders/${orderId}/mark-cod-paid`, {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer ' + adminToken
    }
});
```

#### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "orderNumber": "YT-20241201-0002",
        "isPaid": true,
        "paidAt": "2024-12-01T15:30:00.000Z",
        "status": "processing",
        "paymentResult": {
            "id": "COD",
            "status": "paid",
            "update_time": "2024-12-01T15:30:00.000Z",
            "email_address": "john@example.com",
            "method": "cod"
        }
    },
    "message": "COD order marked as paid"
}
```

---

## 5. Order Management

### 5.1 Get User Orders

#### Endpoint
```
GET /orders/my-orders
```

#### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": {
        "orders": [
            {
                "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
                "orderNumber": "YT-20241201-0001",
                "totalPrice": 709.97,
                "isPaid": true,
                "isDelivered": false,
                "status": "processing",
                "paymentMethod": "razorpay",
                "createdAt": "2024-12-01T10:30:00.000Z"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalOrders": 1
        }
    },
    "message": "Orders retrieved successfully"
}
```

### 5.2 Get Order Details

#### Endpoint
```
GET /orders/:id
```

#### Response
```json
{
    "status": "success",
    "statusCode": 200,
    "data": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "orderNumber": "YT-20241201-0001",
        "user": {
            "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
            "name": "John Doe",
            "email": "john@example.com"
        },
        "orderItems": [
            {
                "product": {
                    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
                    "name": "Premium Green Tea",
                    "image": "https://example.com/tea.jpg",
                    "price": 299.99
                },
                "quantity": 2,
                "price": 599.98
            }
        ],
        "shippingAddress": {
            "address": "123 Main Street",
            "city": "Mumbai",
            "postalCode": "400001",
            "country": "India",
            "phone": "+919876543210"
        },
        "paymentMethod": "razorpay",
        "paymentResult": {
            "id": "pay_XYZ789ABC",
            "status": "captured",
            "razorpay_order_id": "order_ABC123XYZ",
            "razorpay_payment_id": "pay_XYZ789ABC"
        },
        "itemsPrice": 599.98,
        "taxPrice": 59.99,
        "shippingPrice": 50.00,
        "totalPrice": 709.97,
        "isPaid": true,
        "paidAt": "2024-12-01T10:35:00.000Z",
        "isDelivered": false,
        "deliveredAt": null,
        "status": "processing",
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:35:00.000Z"
    },
    "message": "Order details retrieved successfully"
}
```

---

## 6. Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
    "status": "error",
    "statusCode": 400,
    "message": "Invalid payment method",
    "error": "ValidationError"
}
```

#### 401 Unauthorized
```json
{
    "status": "error",
    "statusCode": 401,
    "message": "Not authorized to access this resource"
}
```

#### 404 Not Found
```json
{
    "status": "error",
    "statusCode": 404,
    "message": "Order not found"
}
```

#### 500 Internal Server Error
```json
{
    "status": "error",
    "statusCode": 500,
    "message": "Payment verification failed"
}
```

---

## 7. Frontend Implementation Guide

### 7.1 Complete Checkout Flow

```javascript
class CheckoutService {
    constructor() {
        this.baseURL = '/api/v1';
        this.token = localStorage.getItem('token');
    }

    async getPaymentMethods() {
        const response = await fetch(`${this.baseURL}/payments/methods`);
        return response.json();
    }

    async createOrder(orderData) {
        const response = await fetch(`${this.baseURL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(orderData)
        });
        return response.json();
    }

    async processOnlinePayment(orderId, amount) {
        // 1. Create Razorpay order
        const orderResponse = await fetch(`${this.baseURL}/payments/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({
                orderId,
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: `order_${orderId}`
            })
        });

        const orderData = await orderResponse.json();
        
        // 2. Initialize Razorpay
        return new Promise((resolve, reject) => {
            const options = {
                key: 'rzp_test_YOUR_KEY_ID',
                amount: orderData.data.amount,
                currency: orderData.data.currency,
                name: 'Yellow Tea',
                description: 'Premium Tea Products',
                order_id: orderData.data.id,
                handler: async (response) => {
                    try {
                        // 3. Verify payment
                        const verifyResponse = await fetch(`${this.baseURL}/payments/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        
                        const verifyData = await verifyResponse.json();
                        resolve(verifyData);
                    } catch (error) {
                        reject(error);
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '+919876543210'
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        });
    }

    async processCODOrder(orderData) {
        // For COD, just create the order
        return this.createOrder({
            ...orderData,
            paymentMethod: 'cod'
        });
    }

    async getOrderStatus(orderId) {
        const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return response.json();
    }
}

// Usage Example
const checkout = new CheckoutService();

// Get payment methods
const methods = await checkout.getPaymentMethods();

// Process checkout based on payment method
if (selectedPaymentMethod === 'razorpay') {
    const order = await checkout.createOrder(orderData);
    const paymentResult = await checkout.processOnlinePayment(order.data._id, order.data.totalPrice);
    console.log('Payment successful:', paymentResult);
} else if (selectedPaymentMethod === 'cod') {
    const order = await checkout.processCODOrder(orderData);
    console.log('COD order created:', order);
}
```

### 7.2 React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const CheckoutComponent = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch('/api/v1/payments/methods');
            const data = await response.json();
            setPaymentMethods(data.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const handleCheckout = async (orderData) => {
        setLoading(true);
        try {
            if (selectedMethod === 'razorpay') {
                await processOnlinePayment(orderData);
            } else if (selectedMethod === 'cod') {
                await processCODOrder(orderData);
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Select Payment Method</h2>
            {paymentMethods.map(method => (
                <div key={method.id}>
                    <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                    />
                    <label htmlFor={method.id}>
                        {method.name} - {method.description}
                    </label>
                </div>
            ))}
            
            <button 
                onClick={() => handleCheckout(orderData)}
                disabled={!selectedMethod || loading}
            >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
        </div>
    );
};

export default CheckoutComponent;
```

---

## 8. Testing

### 8.1 Test Card Details (Razorpay Test Mode)
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### 8.2 Test UPI
- **UPI ID**: success@razorpay

### 8.3 Test Scenarios
1. **Successful Payment**: Use test card details
2. **Failed Payment**: Use any invalid card
3. **COD Order**: Select COD payment method
4. **Payment Verification**: Test signature verification

---

## 9. Environment Variables

### Required for Production
```env
# Razorpay
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# WhatsApp (optional)
TWILIO_ACCOUNT_SID=ACyour_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## 10. Support

For technical support or questions about the API:
- Email: support@yellowtea.com
- Documentation: https://docs.yellowtea.com
- GitHub Issues: https://github.com/yellowtea/backend/issues 
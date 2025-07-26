# Razorpay Payment Gateway Integration Guide

## Overview
This guide explains how to use the Razorpay payment gateway integration in your Yellow Tea ecommerce backend.

## Setup Instructions

### 1. Environment Variables
Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Get Razorpay Credentials
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings > API Keys
3. Generate a new key pair
4. Copy the Key ID and Key Secret to your environment variables

## API Endpoints

### 1. Get Available Payment Methods
```http
GET /api/v1/payments/methods
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "razorpay",
      "name": "Razorpay",
      "description": "Pay securely with cards, UPI, net banking, and wallets",
      "methods": [
        { "id": "card", "name": "Credit/Debit Card", "icon": "💳" },
        { "id": "upi", "name": "UPI", "icon": "📱" },
        { "id": "netbanking", "name": "Net Banking", "icon": "🏦" },
        { "id": "wallet", "name": "Digital Wallets", "icon": "👛" },
        { "id": "cod", "name": "Cash on Delivery", "icon": "💵" }
      ],
      "isActive": true
    }
  ],
  "message": "Payment methods retrieved successfully"
}
```

### 2. Create Razorpay Order
```http
POST /api/v1/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id_from_your_system"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_1234567890",
    "amount": 50000,
    "currency": "INR",
    "receipt": "YT-20241201-0001",
    "key": "rzp_test_your_key_id",
    "order": {
      "id": "order_id_from_your_system",
      "orderNumber": "YT-20241201-0001",
      "totalPrice": 500,
      "items": [...]
    }
  },
  "message": "Razorpay order created successfully"
}
```

### 3. Verify Payment
```http
POST /api/v1/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_1234567890",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "signature_from_razorpay",
  "orderId": "order_id_from_your_system"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_id_from_your_system",
      "orderNumber": "YT-20241201-0001",
      "isPaid": true,
      "paidAt": "2024-12-01T10:30:00.000Z",
      "paymentMethod": "razorpay",
      "orderStatus": "processing"
    },
    "payment": {
      "id": "pay_1234567890",
      "status": "captured",
      "amount": 500,
      "currency": "INR"
    }
  },
  "message": "Payment verified and order updated successfully"
}
```

### 4. Get Payment Status
```http
GET /api/v1/payments/status/:orderId
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "isPaid": true,
    "paymentMethod": "razorpay",
    "paidAt": "2024-12-01T10:30:00.000Z",
    "orderStatus": "processing",
    "razorpayDetails": {
      "paymentId": "pay_1234567890",
      "status": "captured",
      "method": "card",
      "bank": "HDFC",
      "cardId": "card_1234567890",
      "email": "customer@example.com",
      "contact": "+919876543210"
    }
  },
  "message": "Payment status retrieved successfully"
}
```

### 5. Process Refund (Admin Only)
```http
POST /api/v1/payments/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "orderId": "order_id_from_your_system",
  "refundAmount": 500,
  "reason": "Customer request"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "refund": {
      "id": "rfnd_1234567890",
      "amount": 500,
      "status": "processed",
      "processedAt": "2024-12-01T11:00:00.000Z"
    },
    "order": {
      "id": "order_id_from_your_system",
      "refundStatus": "completed",
      "refundDetails": {
        "amount": 500,
        "id": "rfnd_1234567890",
        "status": "processed",
        "processedAt": "2024-12-01T11:00:00.000Z",
        "reason": "Customer request"
      }
    }
  },
  "message": "Refund processed successfully"
}
```

### 6. Get Payment Analytics (Admin Only)
```http
GET /api/v1/payments/analytics?startDate=2024-11-01&endDate=2024-12-01
Authorization: Bearer <admin_token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalOrders": 100,
      "paidOrders": 85,
      "failedPayments": 15,
      "successRate": 85.0
    },
    "paymentMethods": [
      {
        "method": "razorpay",
        "count": 85,
        "total": 42500,
        "percentage": 100
      }
    ],
    "dailyPayments": [...],
    "period": {
      "startDate": "2024-11-01T00:00:00.000Z",
      "endDate": "2024-12-01T00:00:00.000Z"
    }
  },
  "message": "Payment analytics retrieved successfully"
}
```

### 7. Cash on Delivery (COD)

#### How it works:
- Customers can select "Cash on Delivery" at checkout.
- The order is created with `paymentMethod: 'cod'` and `isPaid: false`.
- After delivery, an admin/staff can mark the order as paid using the following endpoint:

```http
PUT /api/v1/orders/:id/cod-paid
Authorization: Bearer <admin_token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    ...orderFields,
    "isPaid": true,
    "paymentMethod": "cod",
    "paymentResult": {
      "id": "COD",
      "status": "paid",
      "update_time": 1710000000000,
      "email_address": "customer@example.com",
      "method": "cod"
    }
  },
  "message": "COD order marked as paid"
}
```

- COD is also returned in `/api/v1/payments/methods` as an available payment method.

## Frontend Integration

### 1. Include Razorpay Script
Add this to your HTML:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Create Payment Flow
```javascript
// Step 1: Create order in your backend
const createOrder = async (orderData) => {
  const response = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};

// Step 2: Create Razorpay order
const createRazorpayOrder = async (orderId) => {
  const response = await fetch('/api/v1/payments/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ orderId })
  });
  return response.json();
};

// Step 3: Initialize Razorpay checkout
const initializePayment = (razorpayData) => {
  const options = {
    key: razorpayData.key,
    amount: razorpayData.amount,
    currency: razorpayData.currency,
    name: 'Yellow Tea',
    description: 'Premium Tea Products',
    order_id: razorpayData.orderId,
    handler: function (response) {
      // Step 4: Verify payment
      verifyPayment(response, razorpayData.order.id);
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone
    },
    theme: {
      color: '#3399cc'
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

// Step 4: Verify payment
const verifyPayment = async (response, orderId) => {
  const verifyData = {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    orderId: orderId
  };

  const result = await fetch('/api/v1/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(verifyData)
  });

  const verificationResult = await result.json();
  
  if (verificationResult.success) {
    // Payment successful
    showSuccessMessage('Payment successful!');
    // Redirect to order confirmation page
    window.location.href = `/orders/${orderId}`;
  } else {
    // Payment failed
    showErrorMessage('Payment verification failed');
  }
};

// Complete payment flow
const processPayment = async (orderData) => {
  try {
    // Create order
    const orderResult = await createOrder(orderData);
    if (!orderResult.success) {
      throw new Error(orderResult.message);
    }

    // Create Razorpay order
    const razorpayResult = await createRazorpayOrder(orderResult.data._id);
    if (!razorpayResult.success) {
      throw new Error(razorpayResult.message);
    }

    // Initialize payment
    initializePayment(razorpayResult.data);
  } catch (error) {
    console.error('Payment error:', error);
    showErrorMessage(error.message);
  }
};
```

## Error Handling

### Common Error Responses

#### 1. Invalid Payment Signature
```json
{
  "success": false,
  "message": "Invalid payment signature"
}
```

#### 2. Payment Not Captured
```json
{
  "success": false,
  "message": "Payment not captured"
}
```

#### 3. Order Not Found
```json
{
  "success": false,
  "message": "Order not found"
}
```
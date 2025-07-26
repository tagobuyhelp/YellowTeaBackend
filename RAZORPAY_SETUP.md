# Razorpay Payment Gateway Setup

## Quick Setup Guide

### 1. Install Dependencies
The Razorpay package has been installed. If you need to reinstall:
```bash
npm install razorpay
```

### 2. Environment Variables
Add these variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### 3. Get Razorpay Credentials

#### Step 1: Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for a new account
3. Complete the verification process

#### Step 2: Get API Keys
1. Login to your Razorpay Dashboard
2. Go to **Settings** > **API Keys**
3. Click **Generate Key Pair**
4. Copy the **Key ID** and **Key Secret**
5. Add them to your `.env` file

#### Step 3: Set Up Webhooks (Optional but Recommended)
1. Go to **Settings** > **Webhooks**
2. Click **Add New Webhook**
3. Set the webhook URL: `https://your-domain.com/api/v1/webhooks/razorpay`
4. Select these events:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
   - `order.paid`
5. Copy the webhook secret and add it to your `.env` file

### 4. Test the Integration

#### Test Cards
Use these test card numbers:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **Network Error**: 4000 0000 0000 9995

#### Test UPI IDs
- **Success**: success@razorpay
- **Failure**: failure@razorpay

### 5. API Endpoints Available

#### Payment Methods
- `GET /api/v1/payments/methods` - Get available payment methods

#### Payment Processing
- `POST /api/v1/payments/create-order` - Create Razorpay order
- `POST /api/v1/payments/verify` - Verify payment
- `GET /api/v1/payments/status/:orderId` - Get payment status

#### Admin Functions
- `POST /api/v1/payments/refund` - Process refund
- `GET /api/v1/payments/analytics` - Get payment analytics

#### Webhooks
- `POST /api/v1/webhooks/razorpay` - Handle Razorpay webhooks
- `POST /api/v1/webhooks/test` - Test webhook endpoint

### 6. Frontend Integration

Include the Razorpay script in your HTML:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 7. Production Checklist

- [ ] Switch to live Razorpay keys
- [ ] Set up webhook endpoints
- [ ] Configure SSL certificates
- [ ] Test all payment methods
- [ ] Set up monitoring and logging
- [ ] Test refund functionality
- [ ] Verify webhook signatures
- [ ] Set up error handling

### 8. Security Notes

1. **Never expose your secret key** in frontend code
2. **Always verify payment signatures** on the server
3. **Use HTTPS** in production
4. **Validate all input data** before processing
5. **Log payment activities** for audit purposes

### 9. Support

- **Razorpay Support**: [support@razorpay.com](mailto:support@razorpay.com)
- **Documentation**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **API Reference**: [https://razorpay.com/docs/api/](https://razorpay.com/docs/api/)

### 10. Common Issues

#### Payment Verification Fails
- Check if the signature is being generated correctly
- Verify that the webhook secret is correct
- Ensure the payment amount matches exactly

#### Webhook Not Working
- Check if the webhook URL is accessible
- Verify the webhook secret in your environment
- Check server logs for signature verification errors

#### Order Not Found
- Ensure the Razorpay order ID is being saved correctly
- Check if the order exists in your database
- Verify the order belongs to the correct user 
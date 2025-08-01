# YellowTeaBackend

## WhatsApp Notification Setup (Twilio)

1. Sign up at [Twilio](https://www.twilio.com/whatsapp) and get approved for WhatsApp Business API.
2. Get your Twilio Account SID, Auth Token, and WhatsApp-enabled number (e.g. whatsapp:+14155238886).
3. Add these to your `.env` file:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

4. Make sure your users have a valid phone number in the `phone` field (with country code, e.g. +919876543210).
5. The system will now send WhatsApp notifications for order/payment events automatically.

## Dual Notification System (Email + WhatsApp)

The system now supports **dual notifications** with automatic fallback:

### Features:
- **WhatsApp Notifications**: Instant messaging via Twilio WhatsApp API
- **Email Notifications**: Professional email notifications with templates
- **Automatic Fallback**: If WhatsApp fails, email is automatically sent
- **Configurable**: Enable/disable each notification type independently

### Configuration:
Edit `src/utils/responseHandler.js` to control notification behavior:

```javascript
const NOTIFICATION_CONFIG = {
    enableWhatsApp: true,    // Enable WhatsApp notifications
    enableEmail: true,       // Enable email notifications
    emailFallback: true,     // Send email if WhatsApp fails
    inAppFallback: true      // Always save in-app notifications
};
```

### Notification Types:
- Order placed, processing, shipped, delivered, cancelled
- Payment successful, failed
- Refund processed

### Requirements:
- **For WhatsApp**: Valid phone number in user profile
- **For Email**: Valid email address in user profile
- **For Both**: Proper Twilio and email configuration

### Fallback Logic:
1. **Primary**: Send WhatsApp notification
2. **Fallback**: If WhatsApp fails, automatically send email
3. **Always**: Save in-app notification for user dashboard

This ensures customers **always receive notifications** even if one channel fails.

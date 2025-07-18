# Yellow Tea Backend - User Authentication API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.yellowtea.com/api/v1
```

## Authentication
Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "stack": "Error stack trace (development only)",
    "details": {}
  }
}
```

---

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "created_at": "2023-09-06T10:30:00.000Z",
      "updated_at": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Notes:**
- Password must be at least 8 characters long
- Email must be unique
- A verification email will be sent to the provided email address
- JWT token is returned immediately for login

---

### 2. User Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "created_at": "2023-09-06T10:30:00.000Z",
      "updated_at": "2023-09-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400`: Email or password missing
- `401`: Incorrect email or password

---

### 3. User Logout
**GET** `/auth/logout`

Logout user by clearing JWT cookie.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

### 4. Email Verification
**GET** `/auth/verify-email/:token`

Verify user's email address using the token sent via email.

**URL Parameters:**
- `token`: Email verification token

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

**Error Responses:**
- `400`: Token is invalid or has expired

---

### 5. Forgot Password
**POST** `/auth/forgot-password`

Send password reset email to user.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset token sent to email",
  "data": null
}
```

**Error Responses:**
- `404`: No user found with that email
- `500`: Error sending email

---

### 6. Reset Password
**PATCH** `/auth/reset-password/:token`

Reset user password using the token from email.

**URL Parameters:**
- `token`: Password reset token

**Request Body:**
```json
{
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400`: Token is invalid or has expired

---

### 7. Update Password (Authenticated)
**PATCH** `/auth/update-password`

Update user's password (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401`: Current password is incorrect

---

### 8. Get Current User (Authenticated)
**GET** `/auth/me`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer",
    "wishlist": [],
    "addresses": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "line1": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400001",
        "country": "India"
      }
    ],
    "created_at": "2023-09-06T10:30:00.000Z",
    "updated_at": "2023-09-06T10:30:00.000Z"
  }
}
```

---

### 9. Update User Profile (Authenticated)
**PATCH** `/auth/update-me`

Update current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phone": "9876543210",
    "role": "customer",
    "created_at": "2023-09-06T10:30:00.000Z",
    "updated_at": "2023-09-06T10:35:00.000Z"
  }
}
```

**Notes:**
- Cannot update password through this endpoint (use `/update-password`)
- Only `name`, `email`, and `phone` fields can be updated

---

### 10. Delete User Account (Authenticated)
**DELETE** `/auth/delete-me`

Soft delete current user's account (sets active to false).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (204):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

## OTP Authentication Endpoints

### 11. Send OTP
**POST** `/auth/send-otp`

> **Note:**
> Sending OTP is handled entirely on the frontend/mobile app using the Firebase Auth client SDK. The backend does **not** send OTPs. This endpoint will return an error if called.

**Request Body:**
```json
{
  "phoneNumber": "9876543210"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Send OTP using Firebase Auth client SDK on the frontend.",
  "data": null
}
```

---

### 12. Verify OTP (Login/Register with Phone)
**POST** `/auth/verify-otp`

After the user enters the OTP and it is verified on the frontend using Firebase Auth client SDK, obtain the Firebase ID token and send it to the backend for authentication.

**Request Body:**
```json
{
  "idToken": "<FIREBASE_ID_TOKEN>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "phoneNumber": "9876543210",
      "isPhoneVerified": true,
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400`: Firebase ID token is required
- `400`: Invalid ID token: phone number not found

---

### 13. Link Phone to Account (Authenticated)
**POST** `/auth/link-phone`

Link a phone number to an existing authenticated account. The phone number must be verified on the frontend using Firebase Auth client SDK, and the resulting Firebase ID token must be sent to the backend.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "idToken": "<FIREBASE_ID_TOKEN>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Phone number linked successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "isPhoneVerified": true,
    "role": "customer"
  }
}
```

**Error Responses:**
- `400`: Firebase ID token is required
- `400`: Invalid ID token: phone number not found
- `400`: Phone number is already linked to another account
- `404`: User not found

---

## 🔄 OTP Authentication Flow (Frontend + Backend)

1. **Frontend:** Use Firebase Auth client SDK to send OTP to the user's phone number.
2. **Frontend:** User enters OTP and verifies it using Firebase Auth client SDK.
3. **Frontend:** After successful verification, obtain the Firebase ID token from the client SDK.
4. **Frontend:** Send the ID token to the backend via `/auth/verify-otp` (for login/register) or `/auth/link-phone` (to link phone to existing account).
5. **Backend:** Verifies the ID token using Firebase Admin SDK, extracts the phone number, and updates/creates the user as needed.

---

## User Data Models

### User Object
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "customer",
  "wishlist": ["64f8a1b2c3d4e5f6a7b8c9d2"],
  "addresses": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "line1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    }
  ],
  "created_at": "2023-09-06T10:30:00.000Z",
  "updated_at": "2023-09-06T10:30:00.000Z"
}
```

### Address Object
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "line1": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India"
}
```

---

## Validation Rules

### Email
- Must be a valid email format
- Must be unique across all users
- Automatically converted to lowercase

### Password
- Minimum 8 characters
- Must match passwordConfirm during registration

### Phone Number
- Must be exactly 10 digits (Indian format)
- Optional field

### Pincode
- Must be exactly 6 digits (Indian format)
- Required for addresses

### Name
- Required field
- Trimmed of whitespace

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers
- **Error**: Returns 429 status code when limit is exceeded

---

## CORS Configuration

The API supports CORS with the following origins:
- Development: All origins (`*`)
- Production: 
  - `https://yellowtea.com`
  - `https://admin.yellowtea.com`
  - `https://preview--yellow-tea-site.lovable.app`

---

## Security Features

- JWT tokens with configurable expiration
- Password hashing using bcrypt
- Rate limiting to prevent abuse
- CORS protection
- XSS protection
- NoSQL injection protection
- Parameter pollution protection
- Security headers (Helmet)
- HTTP-only cookies for JWT storage

---

## Frontend Integration Examples

### JavaScript/TypeScript Example

```javascript
// Login example
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token
      localStorage.setItem('token', data.data.token);
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Authenticated request example
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/v1/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

### React Hook Example

```javascript
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then(data => {
          if (data.success) {
            setUser(data.data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};
```

---

## Important Notes

1. **JWT Token Storage**: Tokens are automatically set as HTTP-only cookies for security
2. **Password Requirements**: Minimum 8 characters, no specific complexity requirements
3. **Phone Verification**: Uses Firebase for OTP functionality
4. **Email Verification**: Required for new registrations
5. **Soft Delete**: User deletion sets `active: false` but doesn't remove from database
6. **Address Validation**: Pincode must be 6 digits (Indian format)
7. **Role System**: Supports 'customer' and 'admin' roles

---

## Known Issues

⚠️ **Important**: There are some inconsistencies in the current codebase:

1. The user model is missing some fields referenced in controllers:
   - `isEmailVerified`
   - `emailVerificationToken`
   - `emailVerificationExpires`
   - `isPhoneVerified`
   - `phoneNumber` (different from `phone`)

2. Missing methods in user model:
   - `createEmailVerificationToken()`
   - `isPasswordCorrect()` (controller uses this but model has `correctPassword()`)

3. OTP controller references Firebase but implementation may be incomplete

**Recommendation**: These issues should be resolved before production deployment to ensure all authentication features work correctly. 
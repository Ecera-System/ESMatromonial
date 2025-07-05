# Email Verification System - Backend Only

## Overview

The email verification system now works entirely in the backend. Users must verify their email before they can login to the application.

## How It Works

### 1. Registration Flow
1. User registers with email and password
2. Backend generates verification token
3. Verification email sent with backend URL
4. User clicks link → Backend HTML page → API verification → Success page

### 2. Login Validation
- Users cannot login until email is verified
- Login returns error with `needsVerification: true` if email not verified
- Only verified users can access the application

### 3. Verification Process
1. User clicks email link: `http://localhost:5000/verify-email/{token}`
2. Backend serves HTML page with verification logic
3. JavaScript calls API: `/api/v1/auth/verify-email/{token}`
4. Backend verifies token and marks email as verified
5. User sees success page with login link

## API Endpoints

### Registration
```
POST /api/v1/auth/register
```
- Creates user with `isEmailVerified: false`
- Sends welcome and verification emails
- Returns success message about email verification

### Login (with verification check)
```
POST /api/v1/auth/login
```
**Success Response:**
```json
{
  "token": "jwt_token",
  "refreshToken": "refresh_token", 
  "user": { ... }
}
```

**Unverified Email Response:**
```json
{
  "error": "Please verify your email before logging in. Check your inbox for verification email.",
  "needsVerification": true,
  "email": "user@example.com"
}
```

### Email Verification
```
GET /api/v1/auth/verify-email/:token
```
**Success Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login to your account.",
  "loginUrl": "http://localhost:5173/login",
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Resend Verification
```
POST /api/v1/auth/resend-verification
Body: { "email": "user@example.com" }
```

## Frontend Integration

### Login Error Handling
```javascript
// Handle login response
if (response.needsVerification) {
  // Show verification required message
  alert("Please verify your email before logging in");
  // Optionally show resend verification form
}
```

### Registration Success
```javascript
// After successful registration
alert("Registration successful! Please check your email for verification.");
// Redirect to login page
```

## Environment Variables

Add to your `.env` file:

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server URLs
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

## Testing

### 1. Test Registration
```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "test@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### 2. Test Login (Before Verification)
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected:** `needsVerification: true` error

### 3. Test Email Verification
1. Check email for verification link
2. Click link: `http://localhost:5000/verify-email/{token}`
3. Should see success page with login button

### 4. Test Login (After Verification)
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected:** Success with JWT token

## User Experience Flow

1. **Registration** → User fills form and submits
2. **Email Sent** → Welcome + verification emails sent
3. **User Clicks Link** → Opens backend verification page
4. **Verification** → Backend validates token and marks email verified
5. **Success Page** → Shows success message with login link
6. **Login** → User can now login successfully

## Security Features

- ✅ **Email verification required** before login
- ✅ **Token expiration** (24 hours)
- ✅ **Secure token hashing** using SHA256
- ✅ **Backend-only verification** (no frontend redirects)
- ✅ **Resend verification** for expired tokens
- ✅ **Proper error handling** for invalid tokens

## Troubleshooting

### Email Not Sent
- Check `.env` email configuration
- Test with `/api/v1/auth/test-email` endpoint
- Check server logs for email errors

### Verification Link Not Working
- Check token expiration (24 hours)
- Verify email configuration
- Check server logs for verification errors

### Login Still Blocked After Verification
- Check database: `isEmailVerified` should be `true`
- Verify token was properly processed
- Check server logs for verification success

## Database Schema

User model includes:
```javascript
{
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date
}
```

## Benefits

1. **Security**: Email verification prevents fake accounts
2. **User Experience**: Clear verification flow with helpful messages
3. **Backend Control**: All verification handled server-side
4. **Flexibility**: Easy to customize verification process
5. **Reliability**: Proper error handling and fallbacks 
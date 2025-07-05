# Password Reset System - Backend Only

## Overview

The password reset system works entirely in the backend, similar to email verification. Users request a password reset, receive an email with a backend link, and reset their password through a secure backend page.

## How It Works

### 1. Password Reset Request Flow
1. User enters email in frontend
2. Frontend calls `/api/v1/auth/forgot-password`
3. Backend generates reset token and sends email
4. Email contains backend URL: `http://localhost:5000/reset-password/{token}`

### 2. Password Reset Process
1. User clicks email link → Opens backend HTML page
2. JavaScript validates token with API
3. User enters new password (with validation)
4. Backend processes password reset
5. User sees success page with login link

### 3. Security Features
- ✅ **Token expiration** (1 hour)
- ✅ **Secure token hashing** using SHA256
- ✅ **Password strength validation**
- ✅ **One-time use tokens**
- ✅ **Backend-only processing**

## API Endpoints

### Request Password Reset
```
POST /api/v1/auth/forgot-password
Body: { "email": "user@example.com" }
```

**Success Response:**
```json
{
  "message": "Password reset email sent. Please check your inbox.",
  "email": "user@example.com"
}
```

**Error Response:**
```json
{
  "error": "User not found"
}
```

### Validate Reset Token
```
GET /api/v1/auth/validate-reset-token/:token
```

**Valid Token Response:**
```json
{
  "valid": true,
  "message": "Token is valid",
  "email": "user@example.com"
}
```

**Invalid Token Response:**
```json
{
  "valid": false,
  "message": "Invalid or expired reset token"
}
```

### Reset Password
```
POST /api/v1/auth/reset-password/:token
Body: { "password": "newPassword123!" }
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid or expired reset token"
}
```

## Frontend Integration

### Request Password Reset
```javascript
// Frontend forgot password form
const requestPasswordReset = async (email) => {
  try {
    const response = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Password reset email sent! Please check your inbox.');
    } else {
      alert(data.error || 'Failed to send reset email.');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
};
```

### Handle Reset Response
```javascript
// After user clicks email link
// They'll be taken to: http://localhost:5000/reset-password/{token}
// The backend HTML page handles everything automatically
```

## Password Requirements

The password reset form validates:
- ✅ **Minimum 8 characters**
- ✅ **At least one uppercase letter**
- ✅ **At least one lowercase letter**
- ✅ **At least one number**
- ✅ **At least one special character**

## User Experience Flow

1. **User enters email** → Frontend form submission
2. **Backend processes** → Generates token, sends email
3. **User receives email** → Clicks reset link
4. **Backend page loads** → Validates token, shows form
5. **User enters password** → Frontend validation + backend processing
6. **Success page** → Shows success with login link
7. **User logs in** → With new password

## Testing

### 1. Test Password Reset Request
```bash
POST http://localhost:5000/api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 2. Test Token Validation
```bash
GET http://localhost:5000/api/v1/auth/validate-reset-token/{token}
```

### 3. Test Password Reset
1. Check email for reset link
2. Click link: `http://localhost:5000/reset-password/{token}`
3. Enter new password in form
4. Should see success page

### 4. Test Login with New Password
```bash
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "newPassword123!"
}
```

## Database Schema

User model includes:
```javascript
{
  passwordResetToken: String,
  passwordResetExpires: Date
}
```

## Security Features

- 🔒 **Token expiration** (1 hour)
- 🔒 **Secure token hashing** (SHA256)
- 🔒 **One-time use** (token cleared after use)
- 🔒 **Password strength validation**
- 🔒 **Backend-only processing**
- 🔒 **No frontend token exposure**

## Error Handling

### Common Errors:
1. **"User not found"** → Email doesn't exist
2. **"Invalid or expired token"** → Token expired or invalid
3. **"Password requirements not met"** → Weak password
4. **"Passwords don't match"** → Confirmation mismatch

### Frontend Error Handling:
```javascript
// Handle different error types
if (error.includes('User not found')) {
  // Show user-friendly message
} else if (error.includes('Invalid or expired')) {
  // Show resend option
} else {
  // Show generic error
}
```

## Environment Variables

Required in `.env`:
```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server URLs
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

## Benefits

1. **Security**: All processing on backend
2. **User Experience**: Clear, professional interface
3. **Flexibility**: Easy to customize requirements
4. **Reliability**: Proper error handling
5. **Validation**: Client and server-side password validation

## Troubleshooting

### Email Not Sent
- Check email configuration in `.env`
- Test with `/api/v1/auth/test-email`
- Check server logs

### Reset Link Not Working
- Check token expiration (1 hour)
- Verify email configuration
- Check server logs

### Password Reset Fails
- Check password requirements
- Verify token is valid
- Check server logs for errors

## Integration with Frontend

### Forgot Password Form
```javascript
const handleForgotPassword = async (email) => {
  const response = await fetch('/api/v1/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Show success message
    setMessage('Password reset email sent! Check your inbox.');
  } else {
    // Show error message
    setError(data.error);
  }
};
```

The password reset system is now fully backend-driven and secure! 
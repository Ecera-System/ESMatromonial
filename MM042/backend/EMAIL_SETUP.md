# Email Setup Guide

## Problem: Emails not being sent after signup

The email service requires proper configuration to work. Here's how to fix it:

## 1. Create/Update .env file

Add these variables to your `.env` file in the backend directory:

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLIENT_URL=http://localhost:5173
```

## 2. Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to Google Account → Security
2. Find "App passwords" under 2-Step Verification
3. Generate a new app password for "Mail"
4. Use this password as `EMAIL_PASSWORD`

### Step 3: Update .env
```bash
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

## 3. Test Email Service

Use this endpoint to test if emails are working:

**POST** `http://localhost:5000/api/v1/auth/test-email`

**Body:**
```json
{
  "email": "test@example.com"
}
```

## 4. Common Issues

### Issue 1: "Email service not configured"
**Solution:** Add EMAIL_USER and EMAIL_PASSWORD to .env

### Issue 2: "Invalid login" or "Authentication failed"
**Solution:** 
- Use App Password, not your regular Gmail password
- Make sure 2-Factor Authentication is enabled

### Issue 3: "Less secure app access"
**Solution:** Use App Passwords instead of regular passwords

## 5. Alternative Email Services

### Outlook/Hotmail
```bash
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Custom SMTP
```bash
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 6. Debug Steps

1. **Check .env file exists** in backend directory
2. **Verify email credentials** are correct
3. **Test with test endpoint** first
4. **Check server logs** for detailed error messages
5. **Restart server** after updating .env

## 7. Expected Behavior

After successful setup:
- ✅ Registration sends welcome email
- ✅ Registration sends verification email
- ✅ Password reset sends reset email
- ✅ All emails have professional ESMatrimonial branding

## 8. Troubleshooting

If emails still don't work:

1. **Check server logs** for specific error messages
2. **Test with Gmail** first (most reliable)
3. **Use App Passwords** not regular passwords
4. **Check spam folder** for test emails
5. **Verify .env file** is in the correct location

## 9. Quick Test

Run this in Postman to test email:

```
POST http://localhost:5000/api/v1/auth/test-email
Content-Type: application/json

{
  "email": "your-test-email@gmail.com"
}
```

If this works, registration emails will also work! 
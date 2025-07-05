# ESMatrimonial API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Daily Recommendation System](#daily-recommendation-system)
4. [Profile Completion System](#profile-completion-system)
5. [User Management](#user-management)
6. [Admin Endpoints](#admin-endpoints)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

## Overview

The ESMatrimonial API provides comprehensive functionality for a matrimonial platform, including user management, profile completion tracking, and automated daily recommendations.

**Base URL**: `http://localhost:5000/api/v1`

## Authentication

All protected endpoints require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Token Format
- **User Tokens**: Standard JWT for regular users
- **Admin Tokens**: JWT with admin privileges

---

## Daily Recommendation System

The daily recommendation system automatically generates personalized match suggestions for users every 24 hours.

### Features
- **Automated Generation**: Runs daily at 6:00 AM (IST)
- **Smart Matching**: Uses advanced algorithms based on user preferences
- **Fallback System**: On-demand generation if pre-generated recommendations are unavailable
- **Interaction Tracking**: Records user actions (view, like, skip)

### Endpoints

#### 1. Get Daily Recommendation
```http
GET /users/daily-recommendation
Authorization: Bearer <user_token>
```

**Response (Pre-generated)**:
```json
{
  "recommendation": {
    "_id": "user_id",
    "firstName": "Priya",
    "lastName": "Sharma",
    "age": 26,
    "location": "Mumbai, Maharashtra",
    "education": "MBA",
    "occupation": "Software Engineer",
    "photos": ["photo_url_1", "photo_url_2"],
    "aboutMe": "Looking for a life partner who believes in growing together..."
  },
  "matchPercentage": 85,
  "isOnDemand": false,
  "recommendationId": "recommendation_id"
}
```

**Response (On-demand)**:
```json
{
  "recommendation": {
    "_id": "user_id",
    "firstName": "Arjun",
    "lastName": "Patel",
    "age": 29,
    "location": "Ahmedabad, Gujarat",
    "education": "MBBS",
    "occupation": "Doctor",
    "photos": ["photo_url_1"],
    "aboutMe": "Believe in traditional values with a modern outlook..."
  },
  "matchPercentage": 78,
  "isOnDemand": true
}
```

#### 2. Skip Recommendation
```http
POST /users/skip
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "skippedUserId": "user_id_to_skip",
  "recommendationId": "recommendation_id"
}
```

**Response**:
```json
{
  "message": "User skipped successfully"
}
```

#### 3. Like Recommendation
```http
POST /users/like
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "recommendedUserId": "user_id_to_like",
  "recommendationId": "recommendation_id"
}
```

**Response**:
```json
{
  "message": "Recommendation liked successfully"
}
```

### Recommendation Algorithm

The system uses a multi-factor scoring algorithm:

1. **Core Matching (6 points)**:
   - Religion match: +3 points
   - Caste match: +3 points

2. **Professional Matching (4 points)**:
   - Education match: +2 points
   - Occupation match: +2 points

3. **Profile Quality (2 points)**:
   - Has photos: +1 point
   - Has about me: +1 point

4. **Activity Bonus (2 points)**:
   - Active within 7 days: +2 points
   - Active within 30 days: +1 point

---

## Profile Completion System

The profile completion system tracks how complete a user's profile is and provides guidance for improvement.

### Features
- **Real-time Calculation**: Calculates completion percentage on demand
- **Detailed Tracking**: Identifies specific missing fields
- **Verification Integration**: Includes verification status in completion
- **Visual Feedback**: Provides progress indicators and suggestions

### Endpoints

#### 1. Get Profile Completion
```http
GET /users/profile-completion/:userId
```

**Response**:
```json
{
  "completion": 75,
  "missingFields": [
    "photos",
    "aboutMe",
    "partnerPreferences",
    "isVerified"
  ]
}
```

### Profile Fields

The system tracks **50+ fields** across multiple categories:

#### Personal Information
- `firstName`, `lastName`, `dateOfBirth`, `gender`
- `height`, `weight`, `maritalStatus`
- `religion`, `caste`, `motherTongue`, `manglik`
- `bodyType`, `complexion`, `physicalStatus`

#### Contact & Location
- `email`, `phone`, `country`, `state`, `city`
- `residentialStatus`

#### Professional
- `education`, `educationDetails`
- `occupation`, `occupationDetails`
- `annualIncome`, `workLocation`

#### Family
- `familyType`, `familyStatus`, `familyValues`
- `fatherOccupation`, `motherOccupation`
- `siblings`, `familyLocation`

#### Lifestyle
- `diet`, `smoking`, `drinking`
- `hobbies`, `interests`, `aboutMe`

#### Partner Preferences
- `partnerAgeMin`, `partnerAgeMax`
- `partnerHeightMin`, `partnerHeightMax`
- `partnerEducation`, `partnerOccupation`
- `partnerIncome`, `partnerLocation`
- `partnerReligion`, `partnerCaste`
- `partnerMaritalStatus`, `partnerAbout`

#### Media
- `photos` (array)

#### Verification
- `isVerified` (boolean)

### Completion Calculation

```javascript
// Formula
const percentage = Math.round((filledFields / totalFields) * 100);

// Total fields = 50 + 1 (isVerified) = 51 fields
// 100% completion requires all fields + verification
```

---

## User Management

### Endpoints

#### 1. Get All Users
```http
GET /users
```

#### 2. Get User by ID
```http
GET /users/:id
```

#### 3. Update User
```http
PUT /users/:id
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "email": "updated@email.com"
}
```

#### 4. Delete User
```http
DELETE /users/:id
Authorization: Bearer <user_token>
```

---

## Admin Endpoints

### Daily Recommendation Management

#### 1. Trigger Daily Recommendations (Manual)
```http
POST /admin/trigger-daily-recommendations
Authorization: Bearer <admin_token>
```

**Response**:
```json
{
  "message": "Daily recommendations generation triggered successfully",
  "timestamp": "2024-01-15T06:00:00.000Z"
}
```

#### 2. Get Scheduler Status
```http
GET /admin/scheduler-status
Authorization: Bearer <admin_token>
```

**Response**:
```json
{
  "message": "Daily recommendation scheduler is running",
  "schedule": "Every day at 6:00 AM (IST)",
  "cleanupSchedule": "Every Sunday at 2:00 AM (IST)",
  "lastRun": "2024-01-15T06:00:00.000Z",
  "status": "active"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Examples

#### 404 - User Not Found
```json
{
  "error": "User not found"
}
```

#### 500 - Server Error
```json
{
  "error": "Failed to generate recommendations",
  "details": "Database connection failed"
}
```

---

## Rate Limiting

- **General Endpoints**: 100 requests per minute
- **Authentication Endpoints**: 10 requests per minute
- **Admin Endpoints**: 50 requests per minute

---

## Database Schema

### DailyRecommendation Model
```javascript
{
  userId: ObjectId,           // User who gets the recommendation
  recommendedUserId: ObjectId, // Recommended user
  matchScore: Number,         // Raw match score (0-10)
  matchPercentage: Number,    // Percentage (0-100)
  date: Date,                 // Date of recommendation
  isViewed: Boolean,          // Whether user viewed it
  isSkipped: Boolean,         // Whether user skipped it
  isLiked: Boolean,          // Whether user liked it
  createdAt: Date,
  updatedAt: Date
}
```

### User Model (Key Fields)
```javascript
{
  // Personal Information
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String,
  
  // Contact
  email: String,
  phone: String,
  
  // Preferences
  partnerAgeMin: Number,
  partnerAgeMax: Number,
  partnerReligion: String,
  partnerCaste: String,
  
  // Verification
  isVerified: Boolean,
  
  // Activity
  skippedUsers: [ObjectId],
  lastActive: Date
}
```

---

## Testing

### Using cURL

#### Get Daily Recommendation
```bash
curl -X GET http://localhost:5000/api/v1/users/daily-recommendation \
  -H "Authorization: Bearer <user_token>"
```

#### Get Profile Completion
```bash
curl -X GET http://localhost:5000/api/v1/users/profile-completion/user_id
```

#### Trigger Daily Recommendations (Admin)
```bash
curl -X POST http://localhost:5000/api/v1/admin/trigger-daily-recommendations \
  -H "Authorization: Bearer <admin_token>"
```

### Using Postman

1. **Set Base URL**: `http://localhost:5000/api/v1`
2. **Add Authorization Header**: `Bearer <token>`
3. **Set Content-Type**: `application/json`

---

## Monitoring & Logging

### Log Levels
- **INFO**: Normal operations, successful requests
- **WARN**: Non-critical issues, missing data
- **ERROR**: Critical errors, system failures

### Key Metrics
- Daily recommendation generation success rate
- Profile completion distribution
- User engagement with recommendations
- System performance metrics

---

## Security Considerations

1. **JWT Token Validation**: All protected endpoints validate tokens
2. **Input Validation**: All user inputs are validated and sanitized
3. **Rate Limiting**: Prevents abuse and ensures fair usage
4. **Error Handling**: Secure error messages without exposing system details
5. **Data Privacy**: User data is protected and not exposed unnecessarily

---

## Future Enhancements

### Daily Recommendation System
- [ ] Machine learning-based matching
- [ ] Real-time recommendation updates
- [ ] A/B testing for algorithms
- [ ] Push notifications for new recommendations

### Profile Completion System
- [ ] Gamification elements
- [ ] Progressive profile building
- [ ] Smart suggestions based on completion
- [ ] Social proof indicators

### General Improvements
- [ ] GraphQL API
- [ ] WebSocket support for real-time features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support 
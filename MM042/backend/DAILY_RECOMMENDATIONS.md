# Daily Recommendation System

## Overview

The daily recommendation system automatically generates personalized match recommendations for all active users every 24 hours. This ensures users receive fresh, relevant matches daily without having to manually request them.

## How It Works

### 1. Scheduled Generation
- **Schedule**: Every day at 6:00 AM (IST)
- **Process**: Generates recommendations for all active, verified users
- **Storage**: Saves recommendations in the `DailyRecommendation` collection

### 2. Recommendation Retrieval
- **Primary**: Users get pre-generated recommendations from the database
- **Fallback**: If no pre-generated recommendation exists, generates on-demand
- **Tracking**: Marks recommendations as viewed, liked, or skipped

### 3. Data Cleanup
- **Schedule**: Every Sunday at 2:00 AM (IST)
- **Process**: Removes recommendations older than 30 days

## API Endpoints

### User Endpoints

#### Get Daily Recommendation
```
GET /api/v1/users/daily-recommendation
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recommendation": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    // ... other user fields
  },
  "matchPercentage": 85,
  "isOnDemand": false,
  "recommendationId": "recommendation_id"
}
```

#### Skip Recommendation
```
POST /api/v1/users/skip
Authorization: Bearer <token>
Content-Type: application/json

{
  "skippedUserId": "user_id",
  "recommendationId": "recommendation_id"
}
```

#### Like Recommendation
```
POST /api/v1/users/like
Authorization: Bearer <token>
Content-Type: application/json

{
  "recommendedUserId": "user_id",
  "recommendationId": "recommendation_id"
}
```

### Admin Endpoints

#### Trigger Daily Recommendations (Manual)
```
POST /api/v1/admin/trigger-daily-recommendations
Authorization: Bearer <admin_token>
```

#### Get Scheduler Status
```
GET /api/v1/admin/scheduler-status
Authorization: Bearer <admin_token>
```

## Database Schema

### DailyRecommendation Model
```javascript
{
  userId: ObjectId,           // User who gets the recommendation
  recommendedUserId: ObjectId, // Recommended user
  matchScore: Number,         // Raw match score
  matchPercentage: Number,    // Percentage (0-100)
  date: Date,                 // Date of recommendation
  isViewed: Boolean,          // Whether user viewed it
  isSkipped: Boolean,         // Whether user skipped it
  isLiked: Boolean,          // Whether user liked it
  createdAt: Date,
  updatedAt: Date
}
```

## Configuration

### Timezone
The scheduler uses "Asia/Kolkata" timezone. To change:
1. Update `timezone` in `schedulerService.js`
2. Restart the server

### Schedule Times
- **Generation**: `"0 6 * * *"` (6:00 AM daily)
- **Cleanup**: `"0 2 * * 0"` (2:00 AM Sundays)

### Cron Expression Format
```
┌───────────── second (0 - 59)
│ ┌───────────── minute (0 - 59)
│ │ ┌───────────── hour (0 - 23)
│ │ │ ┌───────────── day of month (1 - 31)
│ │ │ │ ┌───────────── month (1 - 12)
│ │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │ │
* * * * * *
```

## Monitoring

### Logs
The system logs all activities:
- Recommendation generation start/completion
- Individual user processing
- Errors and warnings
- Cleanup operations

### Error Handling
- Individual user failures don't stop the entire process
- Failed recommendations are logged with user ID
- On-demand generation provides fallback for missing recommendations

## Testing

### Manual Trigger
Use the admin endpoint to manually trigger recommendations:
```bash
curl -X POST http://localhost:5000/api/v1/admin/trigger-daily-recommendations \
  -H "Authorization: Bearer <admin_token>"
```

### Check Status
```bash
curl http://localhost:5000/api/v1/admin/scheduler-status \
  -H "Authorization: Bearer <admin_token>"
```

## Performance Considerations

1. **Batch Processing**: Recommendations are generated for all users in a single run
2. **Database Indexes**: Compound index on `userId` and `date` for efficient queries
3. **Memory Management**: Processes users one by one to avoid memory issues
4. **Error Isolation**: Individual user failures don't affect others

## Future Enhancements

1. **Priority Queue**: Process premium users first
2. **Parallel Processing**: Use worker threads for large user bases
3. **Analytics**: Track recommendation performance and user engagement
4. **A/B Testing**: Test different recommendation algorithms
5. **Notifications**: Send push notifications when new recommendations are ready 
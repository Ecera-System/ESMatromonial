# Technical Implementation Guide

## Daily Recommendation System

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Scheduler     │    │  Match Service   │    │   Database      │
│   Service       │───▶│                  │───▶│                 │
│                 │    │  - Algorithm     │    │  - Users        │
│  - Cron Jobs    │    │  - Scoring       │    │  - Daily Recs   │
│  - Triggers     │    │  - Filtering     │    │  - Interactions │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User API      │    │  Admin API       │    │   Frontend      │
│                 │    │                  │    │                 │
│  - Get Daily    │    │  - Manual Trigger│    │  - Display      │
│  - Skip/Like    │    │  - Status Check  │    │  - Interactions │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

#### 1. Scheduler Service (`schedulerService.js`)

**Key Functions:**
```javascript
// Main scheduler initialization
export const initializeScheduler = () => {
  // Daily recommendation generation at 6:00 AM
  cron.schedule("0 6 * * *", generateDailyRecommendations);
  
  // Cleanup old recommendations on Sundays
  cron.schedule("0 2 * * 0", cleanOldRecommendations);
};

// Generate recommendations for all active users
const generateDailyRecommendations = async () => {
  const activeUsers = await User.find({ 
    accountStatus: "active", 
    isVerified: true 
  });
  
  for (const user of activeUsers) {
    // Check for existing recommendation
    // Generate new recommendation if needed
    // Save to database
  }
};
```

**Configuration:**
- **Timezone**: Asia/Kolkata (configurable)
- **Schedule**: `"0 6 * * *"` (6:00 AM daily)
- **Cleanup**: `"0 2 * * 0"` (2:00 AM Sundays)

#### 2. Match Service (`matchService.js`)

**Algorithm Implementation:**
```javascript
export const getDailyRecommendations = async (userId, limit = 1) => {
  const user = await User.findById(userId).lean();
  
  // 1. Build base query with filters
  const query = buildBaseQuery(user);
  
  // 2. Find candidates with fallback strategies
  let candidates = await findCandidates(query, user);
  
  // 3. Score and sort candidates
  candidates = scoreAndSortCandidates(candidates, user);
  
  return candidates.slice(0, limit);
};
```

**Scoring Algorithm:**
```javascript
const scoreAndSortCandidates = (candidates, user) => {
  return candidates.map((candidate) => {
    let score = 0;
    
    // Core matching (6 points)
    if (candidate.religion === user.partnerReligion) score += 3;
    if (candidate.caste === user.partnerCaste) score += 3;
    
    // Professional matching (4 points)
    if (candidate.education === user.partnerEducation) score += 2;
    if (candidate.occupation === user.partnerOccupation) score += 2;
    
    // Profile quality (2 points)
    if (candidate.photos?.length > 0) score += 1;
    if (candidate.aboutMe) score += 1;
    
    // Activity bonus (2 points)
    if (candidate.lastActive) {
      const daysSinceActive = (Date.now() - new Date(candidate.lastActive)) / (1000 * 60 * 60 * 24);
      if (daysSinceActive < 7) score += 2;
      else if (daysSinceActive < 30) score += 1;
    }
    
    return { ...candidate, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
```

#### 3. Database Models

**DailyRecommendation Schema:**
```javascript
const dailyRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recommendedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  matchPercentage: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
  isSkipped: {
    type: Boolean,
    default: false,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
dailyRecommendationSchema.index({ userId: 1, date: 1 }, { unique: true });
```

### API Implementation

#### User Controller (`userController.js`)

**Get Daily Recommendation:**
```javascript
export const getDailyRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Try to get pre-generated recommendation
    let todayRecommendation = await getTodayRecommendation(userId);
    
    if (!todayRecommendation) {
      // 2. Fallback to on-demand generation
      const recommendations = await getDailyRecommendations(userId, 1);
      
      if (!recommendations.length) {
        return res.status(404).json({
          message: "No recommendations found",
          suggestion: "Complete your profile for better matches"
        });
      }
      
      return res.json({
        recommendation: recommendations[0],
        matchPercentage: calculateMatchPercentage(recommendations[0].matchScore),
        isOnDemand: true
      });
    }
    
    // 3. Mark as viewed and return
    await todayRecommendation.updateOne({ isViewed: true });
    
    res.json({
      recommendation: todayRecommendation.recommendedUserId,
      matchPercentage: todayRecommendation.matchPercentage,
      isOnDemand: false,
      recommendationId: todayRecommendation._id
    });
  } catch (err) {
    logger.error(`Recommendation error: ${err.message}`);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
```

---

## Profile Completion System

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   User API       │    │   Database      │
│                 │    │                  │    │                 │
│  - Progress Bar │    │  - Calculation   │    │  - User Model   │
│  - Suggestions  │───▶│  - Field Check   │    │  - 50+ Fields   │
│  - Guidance     │    │  - Percentage    │    │  - Validation   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

#### 1. Profile Completion Controller

**Field Categories:**
```javascript
const fieldCategories = {
  personal: [
    "firstName", "lastName", "dateOfBirth", "gender",
    "height", "weight", "maritalStatus", "religion",
    "caste", "motherTongue", "manglik", "bodyType",
    "complexion", "physicalStatus"
  ],
  contact: [
    "email", "phone", "country", "state", "city",
    "residentialStatus"
  ],
  professional: [
    "education", "educationDetails", "occupation",
    "occupationDetails", "annualIncome", "workLocation"
  ],
  family: [
    "familyType", "familyStatus", "familyValues",
    "fatherOccupation", "motherOccupation", "siblings",
    "familyLocation"
  ],
  lifestyle: [
    "diet", "smoking", "drinking", "hobbies",
    "interests", "aboutMe"
  ],
  partnerPreferences: [
    "partnerAgeMin", "partnerAgeMax", "partnerHeightMin",
    "partnerHeightMax", "partnerEducation", "partnerOccupation",
    "partnerIncome", "partnerLocation", "partnerReligion",
    "partnerCaste", "partnerMaritalStatus", "partnerAbout"
  ],
  media: ["photos"],
  verification: ["isVerified"]
};
```

**Completion Calculation:**
```javascript
export const getProfileCompletion = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const fields = [
      // All 50+ fields listed here
    ];

    let filled = 0;
    let missingFields = [];

    fields.forEach((field) => {
      if (Array.isArray(user[field])) {
        // Handle array fields (like photos)
        if (user[field] && user[field].length > 0) {
          filled++;
        } else {
          missingFields.push(field);
        }
      } else if (
        user[field] !== undefined &&
        user[field] !== null &&
        user[field] !== ""
      ) {
        filled++;
      } else {
        missingFields.push(field);
      }
    });

    // Add verification as required field
    const totalFields = fields.length + 1;
    if (user.isVerified) {
      filled++;
    } else {
      missingFields.push("isVerified");
    }

    const percentage = Math.round((filled / totalFields) * 100);

    res.json({ completion: percentage, missingFields });
  } catch (err) {
    logger.error(`Error calculating profile completion: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};
```

#### 2. Frontend Implementation

**Progress Component:**
```javascript
function ProfileCompletion() {
  const [completion, setCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    // Fetch completion data
    fetchProfileCompletion();
  }, []);

  const getSuggestions = () => {
    const suggestions = [];
    
    if (missingFields.includes("photos")) {
      suggestions.push({
        icon: "📷",
        text: "Upload More Photos",
        priority: "high"
      });
    }
    
    if (missingFields.includes("aboutMe")) {
      suggestions.push({
        icon: "💬",
        text: "Add About Me",
        priority: "medium"
      });
    }
    
    return suggestions;
  };

  return (
    <section className="bg-white rounded-2xl p-8 shadow-lg">
      <h2>Profile Completion</h2>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          style={{ width: `${completion}%` }}
        />
      </div>
      
      <div className="text-center mb-6">
        <span className="text-2xl font-bold">{completion}%</span>
        <span className="text-gray-500 ml-2">Complete</span>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {getSuggestions().map((suggestion, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <span className="text-2xl">{suggestion.icon}</span>
            <span className="text-base font-medium">{suggestion.text}</span>
            <span className="text-gray-400">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Database Schema

#### User Model (Key Fields)
```javascript
const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  height: { type: String },
  weight: { type: String },
  maritalStatus: { type: String, required: true },
  religion: { type: String, required: true },
  caste: { type: String },
  motherTongue: { type: String },
  manglik: { type: String },
  bodyType: { type: String },
  complexion: { type: String },
  physicalStatus: { type: String },

  // Contact & Location
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  residentialStatus: { type: String },

  // Professional
  education: { type: String, required: true },
  educationDetails: { type: String },
  occupation: { type: String, required: true },
  occupationDetails: { type: String },
  annualIncome: { type: String },
  workLocation: { type: String },

  // Family
  familyType: { type: String },
  familyStatus: { type: String },
  familyValues: { type: String },
  fatherOccupation: { type: String },
  motherOccupation: { type: String },
  siblings: { type: String },
  familyLocation: { type: String },

  // Lifestyle
  diet: { type: String },
  smoking: { type: String },
  drinking: { type: String },
  hobbies: { type: String },
  interests: { type: String },
  aboutMe: { type: String },

  // Partner Preferences
  partnerAgeMin: { type: Number },
  partnerAgeMax: { type: Number },
  partnerHeightMin: { type: String },
  partnerHeightMax: { type: String },
  partnerEducation: { type: String },
  partnerOccupation: { type: String },
  partnerIncome: { type: String },
  partnerLocation: { type: String },
  partnerReligion: { type: String },
  partnerCaste: { type: String },
  partnerMaritalStatus: { type: String },
  partnerAbout: { type: String },

  // Media
  photos: [{ type: String }],

  // Verification & Status
  isVerified: { type: Boolean, default: false },
  accountStatus: { type: String, default: "active" },

  // Activity Tracking
  skippedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastActive: { type: Date, default: Date.now },

}, {
  timestamps: true
});
```

---

## Testing Strategy

### Unit Tests

#### Daily Recommendation System
```javascript
describe("Daily Recommendation System", () => {
  test("should generate recommendations for active users", async () => {
    // Mock user data
    const mockUser = {
      _id: "user123",
      accountStatus: "active",
      isVerified: true,
      partnerReligion: "Hindu",
      partnerCaste: "Brahmin"
    };

    // Mock candidate data
    const mockCandidates = [
      {
        _id: "candidate1",
        religion: "Hindu",
        caste: "Brahmin",
        education: "MBA",
        occupation: "Software Engineer",
        photos: ["photo1.jpg"],
        aboutMe: "Looking for a life partner"
      }
    ];

    // Test recommendation generation
    const recommendations = await getDailyRecommendations(mockUser._id, 1);
    expect(recommendations).toHaveLength(1);
    expect(recommendations[0].matchScore).toBeGreaterThan(0);
  });
});
```

#### Profile Completion System
```javascript
describe("Profile Completion System", () => {
  test("should calculate completion percentage correctly", () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      // ... other fields
    };

    const completion = calculateProfileCompletion(user);
    expect(completion.percentage).toBeGreaterThan(0);
    expect(completion.percentage).toBeLessThanOrEqual(100);
  });
});
```

### Integration Tests

```javascript
describe("API Integration Tests", () => {
  test("GET /users/daily-recommendation", async () => {
    const response = await request(app)
      .get("/api/v1/users/daily-recommendation")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recommendation");
    expect(response.body).toHaveProperty("matchPercentage");
  });

  test("GET /users/profile-completion/:id", async () => {
    const response = await request(app)
      .get("/api/v1/users/profile-completion/user123");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("completion");
    expect(response.body).toHaveProperty("missingFields");
  });
});
```

---

## Performance Optimization

### Database Indexes
```javascript
// User model indexes
userSchema.index({ accountStatus: 1, isVerified: 1 });
userSchema.index({ gender: 1, religion: 1, caste: 1 });
userSchema.index({ lastActive: -1 });

// DailyRecommendation model indexes
dailyRecommendationSchema.index({ userId: 1, date: 1 }, { unique: true });
dailyRecommendationSchema.index({ recommendedUserId: 1 });
dailyRecommendationSchema.index({ date: -1 });
```

### Caching Strategy
```javascript
// Redis caching for frequently accessed data
const cacheRecommendations = async (userId, recommendations) => {
  await redis.setex(`recommendations:${userId}`, 3600, JSON.stringify(recommendations));
};

const getCachedRecommendations = async (userId) => {
  const cached = await redis.get(`recommendations:${userId}`);
  return cached ? JSON.parse(cached) : null;
};
```

### Query Optimization
```javascript
// Use lean() for read-only operations
const users = await User.find(query).lean();

// Select only needed fields
const users = await User.find(query).select("firstName lastName email").lean();

// Use aggregation for complex calculations
const completionStats = await User.aggregate([
  { $match: { accountStatus: "active" } },
  { $project: { completion: { $divide: ["$filledFields", "$totalFields"] } } },
  { $group: { _id: null, avgCompletion: { $avg: "$completion" } } }
]);
```

---

## Monitoring & Alerting

### Key Metrics
```javascript
// Daily recommendation metrics
const metrics = {
  recommendationsGenerated: 0,
  recommendationsViewed: 0,
  recommendationsLiked: 0,
  recommendationsSkipped: 0,
  averageMatchScore: 0,
  generationTime: 0
};

// Profile completion metrics
const completionMetrics = {
  averageCompletion: 0,
  completionDistribution: {},
  mostMissingFields: [],
  verificationRate: 0
};
```

### Health Checks
```javascript
export const healthCheck = async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    // Check scheduler status
    const schedulerStatus = await getSchedulerStatus();
    
    // Check recommendation generation
    const lastRecommendation = await DailyRecommendation.findOne()
      .sort({ createdAt: -1 });
    
    res.json({
      status: "healthy",
      database: "connected",
      scheduler: schedulerStatus.status,
      lastRecommendation: lastRecommendation?.createdAt,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message
    });
  }
};
```

---

## Deployment Considerations

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/esmatrimonial

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Scheduler
SCHEDULER_TIMEZONE=Asia/Kolkata
DAILY_RECOMMENDATION_TIME=0 6 * * *
CLEANUP_SCHEDULE=0 2 * * 0

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

### Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "esmatrimonial-api",
    script: "server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true
  }]
};
```

This technical guide provides comprehensive implementation details for both the daily recommendation system and profile completion system, including architecture, code examples, testing strategies, and deployment considerations. 
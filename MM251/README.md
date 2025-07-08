# Matrimonial Profile Application

A comprehensive matrimonial profile creation and management system built with React, Node.js, Express, and MongoDB.

## Features

- **Multi-step Profile Creation**: 6-step guided profile creation process
- **Photo Upload**: Support for multiple photo uploads with Cloudinary integration
- **Database Storage**: MongoDB integration for persistent data storage
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Form Validation**: Client-side and server-side validation
- **Search & Filter**: Advanced profile search capabilities
- **Profile Management**: View, edit, and delete profiles

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer (file uploads)
- Cloudinary (image storage)
- CORS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd matrimonial-profile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/matrimonial
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Database Setup**
   
   Make sure MongoDB is running on your system. The application will automatically create the database and collections.

5. **Cloudinary Setup**
   
   - Sign up for a free Cloudinary account at https://cloudinary.com
   - Get your cloud name, API key, and API secret from the dashboard
   - Update the `.env` file with your Cloudinary credentials

### Running the Application

#### Development Mode

**Option 1: Run both frontend and backend together**
```bash
npm run dev:full
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm run preview
```

### API Endpoints

#### Profiles
- `POST /api/profiles` - Create a new profile
- `GET /api/profiles` - Get all profiles with filtering
- `GET /api/profiles/:id` - Get a specific profile
- `PUT /api/profiles/:id` - Update a profile
- `DELETE /api/profiles/:id` - Delete a profile
- `POST /api/profiles/search` - Advanced profile search

### Database Schema

The application uses a comprehensive profile schema including:

- **Personal Information**: Name, age, gender, height, marital status, religion, etc.
- **Contact Information**: Email, phone, address details
- **Professional Information**: Education, occupation, income
- **Family Information**: Family type, parents' occupation, siblings
- **Lifestyle**: Diet preferences, habits, hobbies
- **Partner Preferences**: Age range, education, occupation preferences
- **Photos**: Multiple photo uploads with Cloudinary URLs

### Features in Detail

#### Profile Creation
- 6-step guided process
- Real-time validation
- Progress tracking
- Photo upload with preview
- Partner preference settings

#### Photo Management
- Multiple photo uploads (max 10)
- Automatic image optimization
- Cloud storage with Cloudinary
- Image preview and removal

#### Search & Filtering
- Filter by gender, religion, location, education
- Age range filtering
- Text search across multiple fields
- Pagination support

#### Data Validation
- Client-side form validation
- Server-side data validation
- Email format validation
- Phone number validation
- Required field validation

## Project Structure

```
matrimonial-profile-app/
├── src/
│   ├── components/
│   │   ├── CreateProfile.jsx
│   │   └── ViewProfile.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   ├── models/
│   │   └── Profile.js
│   ├── routes/
│   │   └── profiles.js
│   ├── utils/
│   │   └── cloudinary.js
│   └── index.js
├── public/
├── .env
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


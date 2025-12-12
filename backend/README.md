# Neuro Verse Backend API

Mental Health Monitoring System Backend built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

### 3. Start MongoDB
Make sure MongoDB is running on your system or use MongoDB Atlas.

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile

### Mood Tracking
- `POST /api/mood` - Log mood entry
- `GET /api/mood` - Get all mood entries
- `GET /api/mood/analytics` - Get mood analytics
- `DELETE /api/mood/:id` - Delete mood entry

### Journal
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get all journal entries
- `GET /api/journal/:id` - Get single journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Goals
- `POST /api/goals` - Create goal
- `GET /api/goals` - Get all goals
- `PUT /api/goals/:id/progress` - Update goal progress
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get user feedback
- `GET /api/feedback/all` - Get all feedback (Admin)

### Specialists
- `GET /api/specialists` - Get all specialists
- `GET /api/specialists/:id` - Get single specialist
- `POST /api/specialists` - Create specialist profile
- `POST /api/specialists/:id/review` - Add review

### Chatbot
- `POST /api/chatbot` - Get chatbot response

### User Dashboard
- `GET /api/users/dashboard` - Get dashboard statistics

## Features
✅ JWT Authentication
✅ Role-based Access Control
✅ Mood Tracking with Analytics
✅ Digital Journaling
✅ Goal Setting & Progress Tracking
✅ Feedback System
✅ Specialist Connection
✅ AI Chatbot Support
✅ Dashboard Statistics

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing

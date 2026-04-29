# 🧠 NeuroVerse 2.0

A comprehensive mental wellness web application that combines modern technology with compassionate care to support users on their mental health journey.

## ✨ Features

### 🎯 Core Wellness Tools
- **Mood Tracking** - Daily emotion logging with detailed analytics and insights
- **Goal Setting** - Personal wellness goals with progress tracking and streaks
- **Journaling** - Private journal with mood integration and reflection prompts
- **AI Chatbot** - 24/7 mental health support powered by Llama 3.2
- **Dashboard** - Comprehensive wellness overview with real-time metrics
- **Brain Games** - Cognitive training games for mental fitness

### 🎨 User Experience
- **Dark Theme** - Easy on the eyes with cyan/purple gradient accents
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation** - Clean, modern interface with smooth animations
- **Real-time Updates** - Instant feedback and data synchronization

### 🔧 Technical Excellence
- **Firebase Authentication** - Secure, scalable user management
- **MongoDB Atlas** - Reliable cloud database storage
- **RESTful API** - Well-documented endpoints with proper error handling
- **Modern Tech Stack** - React 18, Node.js, Express, Tailwind CSS

## 🚀 Live Demo

- **Frontend (Netlify):** [https://neuroversemind.netlify.app](https://neuroversemind.netlify.app)
- **Backend (Render):** [https://neuroverse2-0-1.onrender.com](https://neuroverse2-0-1.onrender.com)

> The frontend seamlessly integrates with the backend through Netlify API redirects.

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project
- Git

### One-Command Setup
```bash
git clone https://github.com/23scse1040541/NeuroVerse2.0.git
cd NeuroVerse2.0
npm run setup
npm run dev
```

Visit [SETUP.md](./SETUP.md) for detailed installation instructions.

---

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── pages/          # Main application pages
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts for state
│   ├── utils/          # Helper functions
│   └── styles/         # Tailwind CSS + custom styles
```

### Backend (Node.js + Express)
```
backend/
├── models/            # MongoDB schemas (User, Mood, Goal, etc.)
├── routes/            # API endpoints
├── middleware/        # Authentication & validation
├── utils/             # Database connection & helpers
└── server.js          # Main application server
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Firebase Web SDK** - Authentication and cloud services
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Recharts** - Data visualization library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database with Mongoose ODM
- **Firebase Admin SDK** - Server-side Firebase integration
- **HuggingFace Inference** - AI chatbot integration
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

---

## 📊 Data Models

### User Schema
```javascript
{
  firebaseUid: String,
  name: String,
  email: String,
  role: ['user', 'specialist', 'admin'],
  avatar: String,
  bio: String,
  preferences: {
    notifications: Boolean,
    moodReminder: Boolean,
    meditationReminder: Boolean
  },
  streaks: {
    journalStreak: Number,
    moodStreak: Number,
    meditationStreak: Number
  },
  exp: Number
}
```

### Mood Schema
```javascript
{
  user: ObjectId,
  emotion: String, // ['happy', 'sad', 'anxious', 'stressed', 'calm', 'angry', 'excited', 'tired', 'neutral']
  intensity: Number, // 1-10
  note: String,
  trackingType: String, // ['question', 'camera']
  source: String, // ['micro-reflection', 'manual', 'imported', 'questionnaire']
  challengeType: String, // ['work', 'social', 'health', 'none', 'other']
  helpedBy: [String],
  date: Date
}
```

### Goal Schema
```javascript
{
  user: ObjectId,
  title: String,
  description: String,
  category: String, // ['meditation', 'journal', 'exercise', 'sleep', 'mindfulness', 'social', 'custom']
  targetFrequency: Number,
  frequencyUnit: String, // ['daily', 'weekly', 'monthly']
  currentProgress: Number,
  startDate: Date,
  endDate: Date,
  status: String, // ['active', 'completed', 'paused', 'cancelled']
  streak: Number,
  completionDates: [Date],
  reminders: {
    enabled: Boolean,
    time: String
  }
}
```

---

## 🔐 Authentication Flow

### Firebase-First Authentication
1. **Frontend** authenticates user with Firebase
2. **Frontend** receives Firebase ID token
3. **Frontend** sends token in Authorization header: `Bearer <token>`
4. **Backend** verifies token using Firebase Admin SDK
5. **Backend** creates/updates user in MongoDB
6. **Backend** attaches `req.user` to request context

### Security Features
- Firebase ID token verification
- Protected routes with middleware
- Role-based access control
- CORS configuration
- Input validation and sanitization

---

## 📡 API Documentation

### Authentication
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/sync` - Sync Firebase user with MongoDB

### Mood Management
- `GET /api/mood` - Get user mood entries
- `POST /api/mood` - Create new mood entry
- `GET /api/mood/analytics` - Get mood analytics
- `DELETE /api/mood/:id` - Delete mood entry

### Goal Management
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `PUT /api/goals/:id/progress` - Update goal progress
- `DELETE /api/goals/:id` - Delete goal

### Journal Management
- `GET /api/journal` - Get journal entries
- `POST /api/journal` - Create journal entry
- `GET /api/journal/:id` - Get specific entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Dashboard
- `GET /api/users/dashboard` - Get dashboard statistics

### AI Chatbot
- `POST /api/chatbot` - Get AI response

### Specialists
- `GET /api/specialists` - Get list of specialists
- `GET /api/specialists/:id` - Get specialist details

---

## 🚀 Deployment

### Production Environment

#### Backend (Render)
1. Connect GitHub repository
2. Set root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_uri`
   - `FIREBASE_SERVICE_ACCOUNT_JSON=your_firebase_credentials`
   - `HUGGINGFACE_TOKEN=your_huggingface_token`

#### Frontend (Netlify)
1. Connect GitHub repository
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Environment variables:
   - `VITE_FIREBASE_API_KEY=your_api_key`
   - `VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID=your_project_id`
   - Other Firebase config variables

---

## 🧪 Development

### Local Development
```bash
# Install all dependencies
npm run setup

# Start both backend and frontend
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend
```

### Testing
- Backend health check: `GET http://localhost:5000/api/health`
- Frontend: Visit `http://localhost:3000`

### Code Quality
- ESLint configuration for consistent code style
- Prettier for code formatting
- Proper error handling with meaningful messages
- Comprehensive logging for debugging

---

## 🔧 Troubleshooting

### Common Issues

#### Authentication Problems
- Verify Firebase configuration in frontend `.env`
- Check Firebase project settings
- Ensure CORS origins are properly configured

#### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

#### Build/Deployment Issues
- Clear node_modules and reinstall: `npm run clean && npm run setup`
- Check Node.js version (requires 18+)
- Verify all environment variables are set

### Health Checks
- Backend API: `GET /api/health`
- Database connection status included in health check
- Firebase authentication status logged on startup

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add proper error handling
- Include meaningful commit messages
- Test all features before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Firebase for authentication and backend services
- MongoDB Atlas for database hosting
- HuggingFace for AI chatbot capabilities
- Netlify and Render for deployment services
- The open-source community for amazing tools and libraries

---

## 📞 Support

- 📧 Email: contact@neuroverse.app
- 🐛 Issues: [GitHub Issues](https://github.com/23scse1040541/NeuroVerse2.0/issues)
- 📖 Documentation: [SETUP.md](./SETUP.md)

---

*Built with ❤️ for better mental health*

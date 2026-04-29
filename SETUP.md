# 🧠 NeuroVerse 2.0 - Setup Guide

## Quick Start

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

---

## Detailed Setup

### 1. Clone Repository
```bash
git clone https://github.com/23scse1040541/NeuroVerse2.0.git
cd NeuroVerse2.0
```

### 2. Backend Setup

#### Environment Variables
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON`
- `HUGGINGFACE_TOKEN` - For AI chatbot (optional)

#### Install & Run
```bash
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

#### Firebase Configuration
Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Install & Run
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Available Scripts

### Root Level
- `npm run setup` - Install all dependencies
- `npm run dev` - Start both backend and frontend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run build:frontend` - Build for production
- `npm run clean` - Clean all node_modules

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## Features

### 🎯 Core Features
- **Mood Tracking** - Daily emotion logging with analytics
- **Goal Setting** - Create and track personal wellness goals
- **Journaling** - Private journal with mood tracking
- **AI Chatbot** - Mental health support powered by Llama 3.2
- **Dashboard** - Comprehensive wellness overview
- **Games** - Brain training games for cognitive health

### 🔧 Technical Features
- Firebase Authentication (secure, scalable)
- MongoDB Atlas for data storage
- Real-time analytics and insights
- Responsive dark theme UI
- RESTful API with proper error handling

---

## Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env.example`

### Frontend (Netlify)
1. Connect GitHub repository
2. Set base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Add Firebase environment variables

---

## Troubleshooting

### Common Issues

#### Backend won't start
- Check MongoDB URI is correct
- Verify Firebase service account configuration
- Check port 5000 is available

#### Frontend authentication issues
- Verify Firebase configuration in `.env`
- Check Firebase project settings
- Ensure CORS origins are properly set

#### Database connection errors
- Verify MongoDB Atlas network access
- Check IP whitelist in MongoDB Atlas
- Ensure connection string format is correct

### Health Checks
- Backend: `GET http://localhost:5000/api/health`
- Frontend: Visit `http://localhost:3000`

---

## Development Tips

### Code Structure
```
NeuroVerse2.0/
├── backend/          # Express API server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & validation
│   └── utils/        # Helper functions
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── contexts/ # React contexts
│   │   └── utils/    # Helper functions
└── docs/             # Documentation
```

### Best Practices
- Use Firebase Authentication for all user management
- Implement proper error handling in all API routes
- Follow the established dark theme design system
- Test all features before deployment

---

## Support

- 📧 Email: contact@neuroverse.app
- 🐛 Issues: [GitHub Issues](https://github.com/23scse1040541/NeuroVerse2.0/issues)
- 📖 Documentation: [README.md](./README.md)

---

## License

MIT License - feel free to use this project for your own mental health applications!

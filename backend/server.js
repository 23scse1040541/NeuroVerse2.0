import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import journalRoutes from './routes/journal.js';
import goalRoutes from './routes/goal.js';
import feedbackRoutes from './routes/feedback.js';
import specialistRoutes from './routes/specialist.js';
import chatbotRoutes from './routes/chatbot.js';
import userRoutes from './routes/user.js';
import kahaniyanRoutes from './routes/kahaniyan.js';
import connectDB from './utils/Connection_db.js';

// Load environment variables
dotenv.config({ override: true });

const app = express();

/* =========================
   REQUEST LOGGER
========================= */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/* =========================
   CORS CONFIGURATION
========================= */

const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://neuroversemind.netlify.app',
];

const allowedOrigins = corsOrigins.length
  ? corsOrigins
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    // (mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`❌ CORS Blocked Origin: ${origin}`);

    return callback(
      new Error(`CORS blocked for origin: ${origin}`)
    );
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
  ],
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

/* =========================
   BODY PARSERS
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   GLOBAL ERROR HANDLERS
========================= */

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', async (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected';

  const hasMongoUri = Boolean(
    process.env.MONGODB_URI || process.env.MONGO_URI
  );

  return res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),

    database: {
      status: dbStatus,
      url: hasMongoUri ? 'configured' : 'not configured',
    },

    environment: process.env.NODE_ENV || 'development',
  });
});

/* =========================
   API ROUTES
========================= */

try {
  app.use('/api/auth', authRoutes);
  app.use('/api/mood', moodRoutes);
  app.use('/api/journal', journalRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/specialists', specialistRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/kahaniyan', kahaniyanRoutes);

  // Chatbot Routes
  try {
    app.use('/api/chatbot', chatbotRoutes);
  } catch (chatbotError) {
    console.warn(
      '⚠️ Chatbot routes not loaded:',
      chatbotError.message
    );

    app.use('/api/chatbot', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Chatbot service temporarily unavailable',
      });
    });
  }

  console.log('✅ All API routes loaded successfully');
} catch (routeError) {
  console.error('❌ Error loading routes:', routeError);
}

/* =========================
   ROOT ROUTE
========================= */

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Neuro Verse API',
    version: '1.0.0',
    status: 'Active',
    healthCheck: '/api/health',
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  console.error(err.stack);

  const isDev = process.env.NODE_ENV === 'development';

  // Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message),
      error: isDev ? err.message : undefined,
    });
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry found',
      error: isDev ? err.message : undefined,
    });
  }

  // Invalid Mongo ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      error: isDev ? err.message : undefined,
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: isDev ? err.message : undefined,
    });
  }

  // CORS Error
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  // Default Error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: isDev ? err.stack : undefined,
  });
});

/* =========================
   START SERVER
========================= */

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Port
    const PORT = process.env.PORT || 5000;

    // Start Express Server
    const server = app.listen(PORT, () => {
      console.log('\n🚀 Server Started Successfully');
      console.log(`🌐 Port: ${PORT}`);
      console.log(
        `🛠 Environment: ${
          process.env.NODE_ENV || 'development'
        }`
      );
      console.log('✅ MongoDB Connected');
    });

    /* =========================
       GRACEFUL SHUTDOWN
    ========================= */

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED');

      server.close(() => {
        console.log('💥 Server Closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start App
startServer();

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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler for async routes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Middleware
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const defaultDevOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const allowedOrigins = corsOrigins.length ? corsOrigins : defaultDevOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== 'production' && origin.endsWith(':3000')) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const hasMongoUri = Boolean(process.env.MONGODB_URI || process.env.MONGO_URI);
  
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      url: hasMongoUri ? 'configured' : 'not configured',
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes - wrap with error handling
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/mood', moodRoutes);
  app.use('/api/journal', journalRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/specialists', specialistRoutes);
  
  // Chatbot routes might fail if HuggingFace not configured - wrap in try-catch
  try {
    app.use('/api/chatbot', chatbotRoutes);
  } catch (chatbotError) {
    console.warn('⚠️ Chatbot routes not loaded:', chatbotError.message);
    app.use('/api/chatbot', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Chatbot service temporarily unavailable'
      });
    });
  }
  
  app.use('/api/users', userRoutes);
  app.use('/api/kahaniyan', kahaniyanRoutes);
  console.log('✅ All API routes loaded successfully');
} catch (routeError) {
  console.error('❌ Error loading routes:', routeError);
}

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Neuro Verse API',
    version: '1.0.0',
    status: 'Active',
    documentation: '/api-docs',
    healthCheck: '/api/health'
  });
});

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err);
  console.error('Stack:', err.stack);
  
  // Don't crash on common errors
  const isDev = process.env.NODE_ENV === 'development';
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
      error: isDev ? err.message : undefined
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry found',
      error: isDev ? err.message : undefined
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      error: isDev ? err.message : undefined
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: isDev ? err.message : undefined
    });
  }
  
  // Default 500 error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: isDev ? err.stack : undefined
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Get port from environment or use 5000
    const PORT = process.env.PORT || 5000;
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.MONGODB_URI ? 'Connected to MongoDB Atlas' : 'MongoDB URI not configured'}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.error(err);
      process.exit(1);
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

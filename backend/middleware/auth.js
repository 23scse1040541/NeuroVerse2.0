import User from '../models/User.js';
import { initFirebaseAdmin } from '../utils/firebaseAdmin.js';

// Flag to track if Firebase is available
let firebaseAvailable = true;
let firebaseInitError = null;

// Try to initialize Firebase once at startup
try {
  initFirebaseAdmin();
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  firebaseAvailable = false;
  firebaseInitError = error.message;
  console.warn('⚠️ Firebase Admin not configured:', error.message);
  console.warn('Authentication will fallback to development mode');
}

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    console.log('🔐 Auth middleware called');
    console.log('Authorization header present:', !!authHeader);
    
    // Check if authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Bearer token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided'
      });
    }

    const idToken = authHeader.split(' ')[1];
    if (!idToken) {
      console.log('❌ Token is empty after Bearer');
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token format'
      });
    }
    console.log('✅ Token extracted, length:', idToken.length);

    // If Firebase is not available, use development bypass
    if (!firebaseAvailable) {
      console.log('⚠️ Firebase not available - Using development auth bypass');
      
      // For development: try to find or create a test user
      let user;
      try {
        user = await User.findOne({ email: 'dev@neuroverse.test' });
        console.log('👤 Development user found:', !!user);
      } catch (dbError) {
        console.error('❌ Database error finding user:', dbError.message);
        return res.status(500).json({
          success: false,
          message: 'Database error during auth',
          error: dbError.message
        });
      }
      
      if (!user) {
        try {
          console.log('📝 Creating development user...');
          user = await User.create({
            firebaseUid: 'dev-test-uid',
            name: 'Development User',
            email: 'dev@neuroverse.test',
            authProvider: 'firebase'
          });
          console.log('✅ Created development user');
        } catch (createError) {
          console.error('❌ Error creating dev user:', createError.message);
          // User might already exist due to race condition
          try {
            user = await User.findOne({ email: 'dev@neuroverse.test' });
          } catch (findError) {
            console.error('❌ Error finding user after create:', findError.message);
          }
        }
      }
      
      if (!user) {
        return res.status(500).json({
          success: false,
          message: 'Development auth failed - Could not create user'
        });
      }
      
      req.user = user;
      req.firebase = { uid: 'dev-test-uid', email: 'dev@neuroverse.test' };
      console.log('✅ Development auth successful, user:', user._id);
      return next();
    }

    // Firebase is available - verify token
    let decoded;
    try {
      const admin = initFirebaseAdmin();
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    const firebaseUid = decoded.uid;
    const email = decoded.email;
    const name = decoded.name || (email ? email.split('@')[0] : 'User');
    const avatar = decoded.picture;

    // Find or create user in database
    let user = await User.findOne({ firebaseUid });

    if (!user && email) {
      user = await User.findOne({ email });
      if (user && !user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
    }

    if (!user) {
      try {
        user = await User.create({
          firebaseUid,
          name,
          email: email || `${firebaseUid}@firebase.local`,
          avatar: avatar || undefined,
          authProvider: 'firebase'
        });
      } catch (createError) {
        // Handle duplicate key error
        if (createError.code === 11000) {
          user = await User.findOne({ 
            $or: [{ firebaseUid }, { email: email || `${firebaseUid}@firebase.local` }]
          });
        } else {
          throw createError;
        }
      }
    } else {
      // Update user info if needed
      let shouldSave = false;
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        shouldSave = true;
      }
      if (email && user.email !== email) {
        user.email = email;
        shouldSave = true;
      }
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        shouldSave = true;
      }
      if (shouldSave) {
        try {
          await user.save();
        } catch (saveError) {
          console.error('Error saving user updates:', saveError.message);
        }
      }
    }

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create or find user'
      });
    }

    req.user = user;
    req.firebase = decoded;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token - continue as guest
      req.user = null;
      return next();
    }

    // Try to authenticate but don't fail if it doesn't work
    try {
      await protect(req, res, () => next());
    } catch (error) {
      // Auth failed but that's ok for optional auth
      req.user = null;
      next();
    }
  } catch (error) {
    req.user = null;
    next();
  }
};

import User from '../models/User.js';
import { initFirebaseAdmin } from '../utils/firebaseAdmin.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    const idToken = authHeader.split(' ')[1];
    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    const admin = initFirebaseAdmin();

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const firebaseUid = decoded.uid;
    const email = decoded.email;
    const name = decoded.name || (email ? email.split('@')[0] : 'User');
    const avatar = decoded.picture;

    let user = await User.findOne({ firebaseUid });

    if (!user && email) {
      user = await User.findOne({ email });
      if (user && !user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
    }

    if (!user) {
      user = await User.create({
        firebaseUid,
        name,
        email: email || `${firebaseUid}@firebase.local`,
        avatar: avatar || undefined,
        authProvider: 'firebase'
      });
    } else {
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
      if (shouldSave) await user.save();
    }

    req.user = user;
    req.firebase = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

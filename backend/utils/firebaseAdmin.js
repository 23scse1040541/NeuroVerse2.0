import fs from 'fs';
import admin from 'firebase-admin';

const getServiceAccount = () => {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    return JSON.parse(json);
  }

  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path) {
    const raw = fs.readFileSync(path, 'utf-8');
    return JSON.parse(raw);
  }

  return null;
};

export const initFirebaseAdmin = () => {
  if (admin.apps.length) return admin;

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON.'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
};

export default admin;

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDqkOVBAOzbDKMYPOsJvXGdhQrDHkXTAZw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neuroverse-ab585.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neuroverse-ab585",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neuroverse-ab585.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "810084227398",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:810084227398:web:cf6a3be38292a8c4a96d47",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VFX6P6LNP9"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize Analytics only in the browser and if supported
  if (typeof window !== 'undefined') {
    isSupported().then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    });
  }
  
  // Use emulators in development
  if (import.meta.env.DEV) {
    // Uncomment these lines if you want to use Firebase Emulator Suite
    // connectAuthEmulator(auth, "http://localhost:9099");
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log('Firebase initialized in development mode');
  } else {
    console.log('Firebase initialized in production mode');
  }
} catch (error) {
  console.error("Firebase initialization error", error);
  throw error; // Re-throw to prevent the app from loading with broken Firebase
}

export { auth, db, storage, analytics, app };

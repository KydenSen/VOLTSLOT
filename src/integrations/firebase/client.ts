import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if required Firebase config is present
const isFirebaseConfigured = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;
  return requiredKeys.every((key) => firebaseConfig[key] && !firebaseConfig[key]?.includes("Demo") && !firebaseConfig[key]?.includes("your-"));
};

let app: any;
let auth: any;
let db: any;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    void enableIndexedDbPersistence(db).catch((error) => {
      console.warn("Firestore persistence could not be enabled:", error);
    });
  } else {
    console.warn("Firebase configuration is incomplete. Update .env.local with real Firebase credentials.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export { auth, db, app };

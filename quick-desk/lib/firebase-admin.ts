import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Debug environment variables
console.log("Firebase Admin Debug:");
console.log(
  "FIREBASE_PROJECT_ID:",
  process.env.FIREBASE_PROJECT_ID ? "SET" : "NOT SET"
);
console.log(
  "FIREBASE_CLIENT_EMAIL:",
  process.env.FIREBASE_CLIENT_EMAIL ? "SET" : "NOT SET"
);
console.log(
  "FIREBASE_PRIVATE_KEY:",
  process.env.FIREBASE_PRIVATE_KEY ? "SET" : "NOT SET"
);

// Only initialize Firebase Admin if we have proper credentials
const hasValidCredentials =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

console.log("Has valid credentials:", hasValidCredentials);

let firebaseAdminConfig = null;
if (hasValidCredentials) {
  try {
    firebaseAdminConfig = {
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    };
    console.log("Firebase Admin config created successfully");
  } catch (error) {
    console.error("Error creating Firebase Admin config:", error);
  }
}

// Initialize Firebase Admin only if we have valid credentials
let app = null;
let adminDb = null;
let adminAuth = null;

if (firebaseAdminConfig) {
  try {
    app =
      getApps().length === 0
        ? initializeApp(firebaseAdminConfig)
        : getApps()[0];
    adminDb = getFirestore(app);
    adminAuth = getAuth(app);
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
} else {
  console.log("Firebase Admin not initialized - missing credentials");
}

export { adminDb, adminAuth, app as adminApp };

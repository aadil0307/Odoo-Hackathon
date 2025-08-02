// Firebase Configuration Example
// Copy this file to .env.local and fill in your actual Firebase project values

export const firebaseConfigExample = {
  // Client-side Firebase config (NEXT_PUBLIC_ prefix makes them available in browser)
  NEXT_PUBLIC_FIREBASE_API_KEY: "your_api_key_here",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "your_project_id.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "your_project_id",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "your_project_id.appspot.com",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "your_messaging_sender_id",
  NEXT_PUBLIC_FIREBASE_APP_ID: "your_app_id",

  // Server-side Firebase Admin config
  FIREBASE_PROJECT_ID: "your_project_id",
  FIREBASE_CLIENT_EMAIL: "your_service_account_email",
  FIREBASE_PRIVATE_KEY:
    "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n",
};

/*
To fix the Firebase error:

1. Create a .env.local file in the quick-desk directory
2. Add the following environment variables with your actual Firebase project values:

# Client-side Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-side Firebase Admin config
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

3. Get these values from your Firebase Console:
   - Go to https://console.firebase.google.com/
   - Select your project
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the config values
   - For admin SDK, go to Project Settings > Service accounts
   - Generate a new private key and use those values

4. Restart your development server after adding the .env.local file
*/

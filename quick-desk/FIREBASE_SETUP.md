# Firebase Setup Guide

## Quick Fix for Development

The Firebase error you're seeing is because the environment variables are not configured. I've added fallback values to prevent the error, but you'll need to set up proper Firebase configuration for full functionality.

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### 2. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** and select **Web** (</>)
4. Register your app with a nickname (e.g., "QuickDesk Web")
5. Copy the configuration object

### 3. Create Environment File

Create a `.env.local` file in the `quick-desk` directory with the following content:

```env
# Client-side Firebase config (NEXT_PUBLIC_ prefix makes them available in browser)
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
```

### 4. Get Admin SDK Configuration

1. In Firebase Console, go to **Project Settings** > **Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Copy the values from the JSON file to your `.env.local`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 5. Enable Firebase Services

In Firebase Console, enable these services:

1. **Authentication**:

   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

2. **Firestore Database**:

   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" for development

3. **Storage** (optional):
   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode" for development

### 6. Restart Development Server

After creating the `.env.local` file:

```bash
npm run dev
```

### 7. Initialize Firebase (Optional)

Once your server is running, you can initialize the database with sample data:

```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/init-firebase" -Method POST -ContentType "application/json"
```

## Demo Mode

If you don't want to set up Firebase right now, the app will run in demo mode with the fallback values I've added. However, features like authentication and data persistence won't work properly.

## Troubleshooting

- **"auth/invalid-api-key"**: Make sure your API key is correct in `.env.local`
- **"Firebase: Error"**: Check that all environment variables are set
- **Connection issues**: Ensure your Firebase project is properly configured

## Security Note

Never commit your `.env.local` file to version control. It's already in `.gitignore` to prevent this.

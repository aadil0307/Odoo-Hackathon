# Firebase Manual Setup Guide

## Step-by-Step Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `QuickDesk` (or your preferred name)
4. Follow the setup wizard (you can disable Google Analytics)

### 2. Get Web App Configuration

1. In your project, click the **gear icon** (⚙️) next to "Project Overview"
2. Go to **Project Settings** > **General**
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** and select **Web** (</>)
5. Register app with nickname: `QuickDesk Web`
6. Copy the configuration values:

```javascript
// Example config (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "quickdesk-12345.firebaseapp.com",
  projectId: "quickdesk-12345",
  storageBucket: "quickdesk-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

### 3. Get Admin SDK Credentials

1. In **Project Settings** > **Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Open the JSON file and copy these values:

```json
{
  "type": "service_account",
  "project_id": "quickdesk-12345",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@quickdesk-12345.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40quickdesk-12345.iam.gserviceaccount.com"
}
```

### 4. Create .env.local File

Create a file named `.env.local` in the `quick-desk` directory with this content:

```env
# Firebase Configuration
# Client-side Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quickdesk-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quickdesk-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quickdesk-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Server-side Firebase Admin config
FIREBASE_PROJECT_ID=quickdesk-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@quickdesk-12345.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 5. Enable Firebase Services

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

### 6. Test Setup

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Test Firebase initialization:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/api/init-firebase" -Method POST -ContentType "application/json"
   ```

## Quick Setup Script

Alternatively, you can run the automated setup script:

```powershell
.\setup-firebase.ps1
```

## Troubleshooting

- **"auth/invalid-api-key"**: Check that your API key is correct
- **"Failed to parse private key"**: Make sure the private key includes the BEGIN and END lines
- **Connection issues**: Ensure all environment variables are set correctly

## Security Notes

- Never commit `.env.local` to version control
- Keep your service account JSON file secure
- The `.env.local` file is already in `.gitignore`

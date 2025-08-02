# Firebase Setup Script
# This script will help you create your .env.local file

Write-Host "🔥 Firebase Setup Script" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

Write-Host "Please follow these steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://console.firebase.google.com/" -ForegroundColor Cyan
Write-Host "2. Create a new project or select existing one" -ForegroundColor Cyan
Write-Host "3. Go to Project Settings > General" -ForegroundColor Cyan
Write-Host "4. Add a Web app and copy the config values" -ForegroundColor Cyan
Write-Host "5. Go to Project Settings > Service accounts" -ForegroundColor Cyan
Write-Host "6. Generate new private key and download the JSON file" -ForegroundColor Cyan
Write-Host ""

# Get user input
$apiKey = Read-Host "Enter your Firebase API Key"
$authDomain = Read-Host "Enter your Firebase Auth Domain"
$projectId = Read-Host "Enter your Firebase Project ID"
$storageBucket = Read-Host "Enter your Firebase Storage Bucket"
$messagingSenderId = Read-Host "Enter your Firebase Messaging Sender ID"
$appId = Read-Host "Enter your Firebase App ID"
$clientEmail = Read-Host "Enter your Service Account Client Email"
$privateKey = Read-Host "Enter your Service Account Private Key (paste the entire key including BEGIN and END lines)"

# Create .env.local content
$envContent = @"
# Firebase Configuration
# Client-side Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId

# Server-side Firebase Admin config
FIREBASE_PROJECT_ID=$projectId
FIREBASE_CLIENT_EMAIL=$clientEmail
FIREBASE_PRIVATE_KEY="$privateKey"
"@

# Write to .env.local
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your development server: npm run dev" -ForegroundColor Cyan
Write-Host "2. Test the Firebase initialization: Invoke-WebRequest -Uri 'http://localhost:3000/api/init-firebase' -Method POST -ContentType 'application/json'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Keep your .env.local file secure and never commit it to version control!" -ForegroundColor Red 
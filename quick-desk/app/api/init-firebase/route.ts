import { NextResponse } from "next/server"
import { initializeFirestore } from "@/scripts/firebase-init"

export async function POST() {
  try {
    // Check if Firebase Admin is properly configured
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      return NextResponse.json({ 
        error: "Firebase Admin not configured. Please set up your Firebase credentials in .env.local file.",
        setupRequired: true 
      }, { status: 400 })
    }
    
    await initializeFirestore()
    return NextResponse.json({ success: true, message: "Firebase initialized successfully" })
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize Firebase" }, { status: 500 })
  }
}

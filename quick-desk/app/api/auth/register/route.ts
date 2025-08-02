import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if Firebase Admin is properly configured
    if (!adminDb) {
      return NextResponse.json({ 
        error: "Firebase Admin not configured. Please set up your Firebase credentials." 
      }, { status: 500 })
    }

    // Check if user already exists
    const existingUsers = await adminDb.collection("users").where("email", "==", email).get()

    if (!existingUsers.empty) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const now = new Date().toISOString()

    const userDoc = await adminDb.collection("users").add({
      email,
      passwordHash,
      name,
      role: "end-user",
      createdAt: now,
      updatedAt: now,
    })

    const user = {
      id: userDoc.id,
      email,
      name,
      role: "end-user" as const,
    }

    const token = generateToken(user)

    const response = NextResponse.json(user)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

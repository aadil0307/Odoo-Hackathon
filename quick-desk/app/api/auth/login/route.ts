import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Check if Firebase Admin is properly configured
    if (!adminDb) {
      return NextResponse.json({ 
        error: "Firebase Admin not configured. Please set up your Firebase credentials." 
      }, { status: 500 })
    }

    // Find user
    const usersQuery = await adminDb.collection("users").where("email", "==", email).get()

    if (usersQuery.empty) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const userDoc = usersQuery.docs[0]
    const userData = userDoc.data()

    // Verify password
    const isValid = await verifyPassword(password, userData.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate token
    const userPayload = {
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    }

    const token = generateToken(userPayload)

    const response = NextResponse.json(userPayload)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

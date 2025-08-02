import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { adminDb } from "./firebase-admin"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  email: string
  name: string
  role: "end-user" | "agent" | "admin"
  createdAt: string
  updatedAt: string
}

export interface JWTPayload extends Omit<User, "createdAt" | "updatedAt"> {
  iat: number
  exp: number
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: Omit<User, "createdAt" | "updatedAt">): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    // Get fresh user data from Firestore
    const userDoc = await adminDb.collection("users").doc(payload.id).get()
    if (!userDoc.exists) return null

    const userData = userDoc.data()
    return {
      id: userDoc.id,
      email: userData?.email,
      name: userData?.name,
      role: userData?.role,
      createdAt: userData?.createdAt,
      updatedAt: userData?.updatedAt,
    }
  } catch {
    return null
  }
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = { "end-user": 1, agent: 2, admin: 3 }
  return (
    roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getCurrentUser, hasPermission } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !hasPermission(user.role, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const usersSnapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get()

    const users = usersSnapshot.docs.map((doc) => {
      const userData = doc.data()
      return {
        id: doc.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        created_at: userData.createdAt,
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !hasPermission(user.role, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!["end-user", "agent", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    await adminDb.collection("users").doc(userId).update({
      role,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update user role error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

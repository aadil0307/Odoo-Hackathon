import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"

    let query = adminDb.collection("notifications").where("userId", "==", user.id)

    if (unreadOnly) {
      query = query.where("read", "==", false)
    }

    const notificationsSnapshot = await query.orderBy("createdAt", "desc").limit(50).get()

    const notifications = notificationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ids } = await request.json()

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const batch = adminDb.batch()

    for (const id of ids) {
      const notificationRef = adminDb.collection("notifications").doc(id)
      batch.update(notificationRef, { read: true })
    }

    await batch.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

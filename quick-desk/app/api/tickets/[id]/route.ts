import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getCurrentUser, hasPermission } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ticketDoc = await adminDb.collection("tickets").doc(params.id).get()

    if (!ticketDoc.exists) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const ticketData = { id: ticketDoc.id, ...ticketDoc.data() }

    // Check permissions
    if (user.role === "end-user" && ticketData.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get category info
    if (ticketData.categoryId) {
      const categoryDoc = await adminDb.collection("categories").doc(ticketData.categoryId).get()
      if (categoryDoc.exists) {
        const categoryData = categoryDoc.data()
        ticketData.category_name = categoryData?.name
        ticketData.category_color = categoryData?.color
      }
    }

    // Get user info
    const userDoc = await adminDb.collection("users").doc(ticketData.userId).get()
    if (userDoc.exists) {
      const userData = userDoc.data()
      ticketData.user_name = userData?.name
      ticketData.user_email = userData?.email
    }

    // Get assigned user info
    if (ticketData.assignedTo) {
      const assignedUserDoc = await adminDb.collection("users").doc(ticketData.assignedTo).get()
      if (assignedUserDoc.exists) {
        const assignedUserData = assignedUserDoc.data()
        ticketData.assigned_user_name = assignedUserData?.name
      }
    }

    return NextResponse.json(ticketData)
  } catch (error) {
    console.error("Get ticket error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    // Get current ticket
    const ticketDoc = await adminDb.collection("tickets").doc(params.id).get()

    if (!ticketDoc.exists) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const currentTicket = ticketDoc.data()

    // Check permissions
    if (user.role === "end-user" && currentTicket?.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Build update object
    const allowedFields = ["subject", "description", "status", "priority", "assignedTo"]
    const updateData: any = { updatedAt: new Date().toISOString() }

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // Only agents/admins can change status and assignment
        if ((key === "status" || key === "assignedTo") && !hasPermission(user.role, "agent")) {
          continue
        }
        updateData[key] = value
      }
    }

    await adminDb.collection("tickets").doc(params.id).update(updateData)

    // Create notification if status changed
    if (updates.status && updates.status !== currentTicket?.status) {
      await adminDb.collection("notifications").add({
        userId: currentTicket?.userId,
        title: "Ticket Status Updated",
        message: `Your ticket status changed to: ${updates.status}`,
        type: "status",
        ticketId: params.id,
        read: false,
        createdAt: new Date().toISOString(),
      })
    }

    // Get updated ticket
    const updatedTicketDoc = await adminDb.collection("tickets").doc(params.id).get()
    const updatedTicket = { id: updatedTicketDoc.id, ...updatedTicketDoc.data() }

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("Update ticket error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

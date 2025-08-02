import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestedRole, reason } = await request.json();

    // Validate requested role
    if (!requestedRole || !["agent", "admin"].includes(requestedRole)) {
      return NextResponse.json(
        { error: "Invalid role requested. Must be 'agent' or 'admin'" },
        { status: 400 }
      );
    }

    // Prevent users from requesting their current role
    if (user.role === requestedRole) {
      return NextResponse.json(
        { error: `You are already a ${requestedRole}` },
        { status: 400 }
      );
    }

    // Prevent users from requesting a lower role
    if (user.role === "admin" && requestedRole === "agent") {
      return NextResponse.json(
        { error: "Admins cannot request to be demoted to agent" },
        { status: 400 }
      );
    }

    // Check if user already has a pending request
    const existingRequest = await adminDb
      .collection("promotion_requests")
      .where("userId", "==", user.id)
      .where("status", "==", "pending")
      .get();

    if (!existingRequest.empty) {
      return NextResponse.json(
        { error: "You already have a pending promotion request" },
        { status: 400 }
      );
    }

    // Create promotion request
    const promotionRequest = {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      currentRole: user.role,
      requestedRole: requestedRole,
      reason:
        reason ||
        `User requested promotion from ${user.role} to ${requestedRole}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection("promotion_requests").add(promotionRequest);

    // Create notification for admins
    const adminsSnapshot = await adminDb
      .collection("users")
      .where("role", "==", "admin")
      .get();
    const batch = adminDb.batch();

    adminsSnapshot.docs.forEach((adminDoc) => {
      const notificationRef = adminDb.collection("notifications").doc();
      batch.set(notificationRef, {
        userId: adminDoc.id,
        title: "New Promotion Request",
        message: `${user.name} (${user.email}) has requested promotion from ${user.role} to ${requestedRole}`,
        type: "promotion_request",
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Request promotion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

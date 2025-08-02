import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser, hasPermission } from "@/lib/auth";

// Get all promotion requests
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requestsSnapshot = await adminDb
      .collection("promotion_requests")
      .orderBy("createdAt", "desc")
      .get();

    const requests = requestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Get promotion requests error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Approve or reject promotion request
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { requestId, action, reason } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the promotion request
    const requestDoc = await adminDb
      .collection("promotion_requests")
      .doc(requestId)
      .get();

    if (!requestDoc.exists) {
      return NextResponse.json(
        { error: "Promotion request not found" },
        { status: 404 }
      );
    }

    const requestData = requestDoc.data();
    const batch = adminDb.batch();

    // Update the promotion request status
    const requestRef = adminDb.collection("promotion_requests").doc(requestId);
    batch.update(requestRef, {
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      adminReason: reason || "",
    });

    // If approved, update the user's role
    if (action === "approve") {
      const userRef = adminDb.collection("users").doc(requestData.userId);
      batch.update(userRef, {
        role: requestData.requestedRole,
        updatedAt: new Date().toISOString(),
      });
    }

    // Create notification for the user
    const notificationRef = adminDb.collection("notifications").doc();
    batch.set(notificationRef, {
      userId: requestData.userId,
      title: action === "approve" ? "Promotion Approved" : "Promotion Rejected",
      message:
        action === "approve"
          ? `Your promotion request to ${requestData.requestedRole} has been approved!`
          : `Your promotion request to ${
              requestData.requestedRole
            } was rejected: ${reason || "No reason provided"}`,
      type: "promotion_response",
      read: false,
      createdAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update promotion request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

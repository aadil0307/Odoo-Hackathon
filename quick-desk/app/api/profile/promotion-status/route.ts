import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the latest promotion request for this user
    const promotionRequests = await adminDb
      .collection("promotion_requests")
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (promotionRequests.empty) {
      return NextResponse.json({
        requested: false,
        status: "",
        message: "",
        requestedRole: "",
      });
    }

    const latestRequest = promotionRequests.docs[0].data();
    return NextResponse.json({
      requested: true,
      status: latestRequest.status,
      message: latestRequest.reason || "",
      requestedRole: latestRequest.requestedRole || "",
    });
  } catch (error) {
    console.error("Get promotion status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

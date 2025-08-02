import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticketDoc = await adminDb.collection("tickets").doc(params.id).get();

    if (!ticketDoc.exists) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const ticketData = { id: ticketDoc.id, ...ticketDoc.data() };

    // Get category info
    if (ticketData.categoryId) {
      const categoryDoc = await adminDb
        .collection("categories")
        .doc(ticketData.categoryId)
        .get();
      if (categoryDoc.exists) {
        const categoryData = categoryDoc.data();
        ticketData.category_name = categoryData?.name;
        ticketData.category_color = categoryData?.color;
      }
    }

    // Get user info (only name for privacy)
    const userDoc = await adminDb
      .collection("users")
      .doc(ticketData.userId)
      .get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      ticketData.user_name = userData?.name;
      // Don't expose email in public view
    }

    return NextResponse.json(ticketData);
  } catch (error) {
    console.error("Get public ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

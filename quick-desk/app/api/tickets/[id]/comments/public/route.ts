import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentsSnapshot = await adminDb
      .collection("comments")
      .where("ticketId", "==", params.id)
      .orderBy("createdAt", "asc")
      .get();

    const comments = commentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        user_name: data.user_name || "Anonymous",
        user_role: data.user_role,
        createdAt: data.createdAt,
        parentId: data.parentId,
      };
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Get public comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content, name, email } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify ticket exists
    const ticketDoc = await adminDb.collection("tickets").doc(params.id).get();
    if (!ticketDoc.exists) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const commentData = {
      ticketId: params.id,
      content: content.trim(),
      user_name: name || "Anonymous",
      user_email: email || "",
      user_role: "guest",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const commentDoc = await adminDb.collection("comments").add(commentData);

    // Create notification for ticket owner
    const ticketData = ticketDoc.data();
    if (ticketData?.userId) {
      const notificationRef = adminDb.collection("notifications").doc();
      await notificationRef.set({
        userId: ticketData.userId,
        title: "New Public Comment",
        message: `Someone commented on your ticket: "${ticketData.subject}"`,
        type: "public_comment",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { id: commentDoc.id, ...commentData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create public comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

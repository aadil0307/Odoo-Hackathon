import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching comments for ticket:", params.id); // Debug log
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const commentsSnapshot = await adminDb
      .collection("comments")
      .where("ticketId", "==", params.id)
      .orderBy("createdAt", "asc")
      .get();

    console.log("Found comments:", commentsSnapshot.size); // Debug log

    const comments: any[] = [];

    for (const doc of commentsSnapshot.docs) {
      const commentData = { id: doc.id, ...doc.data() };

      // Get user info
      const userDoc = await adminDb
        .collection("users")
        .doc(commentData.userId)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        commentData.user_name = userData?.name;
        commentData.user_role = userData?.role;
      }

      comments.push(commentData);
    }

    // Build threaded structure
    const commentMap = new Map();
    const rootComments: any[] = [];

    comments.forEach((comment: any) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);

      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    console.log("Returning root comments:", rootComments.length); // Debug log
    return NextResponse.json(rootComments);
  } catch (error) {
    console.error("Get comments error:", error);
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
    console.log("Creating comment for ticket:", params.id); // Debug log
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, parentId } = await request.json();
    console.log("Comment data:", { content, parentId }); // Debug log

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
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
      userId: user.id,
      content: content.trim(),
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    };

    console.log("Saving comment data:", commentData); // Debug log
    const commentDoc = await adminDb.collection("comments").add(commentData);
    console.log("Comment created with ID:", commentDoc.id); // Debug log

    // Get ticket owner for notification
    const ticketData = ticketDoc.data();
    if (ticketData?.userId !== user.id) {
      console.log(
        "Creating notification for ticket owner:",
        ticketData?.userId
      ); // Debug log
      await adminDb.collection("notifications").add({
        userId: ticketData?.userId,
        title: "New Comment",
        message: `${user.name} commented on your ticket`,
        type: "comment",
        ticketId: params.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { id: commentDoc.id, ...commentData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

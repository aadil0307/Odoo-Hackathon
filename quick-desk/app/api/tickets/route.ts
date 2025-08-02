import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth";
import type { Ticket } from "@/lib/db-types";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    // Simplified query to avoid index requirements
    let query = adminDb.collection("tickets");

    // Apply filters based on user role
    if (user.role === "end-user") {
      query = query.where("userId", "==", user.id);
    }

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    if (category && category !== "all") {
      query = query.where("categoryId", "==", category);
    }

    // Apply sorting after getting the data
    const ticketsSnapshot = await query.get();
    let tickets = ticketsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Ticket)
    );

    // Apply search filter first
    if (search) {
      const searchLower = search.toLowerCase();
      tickets = tickets.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort in memory to avoid index requirements
    tickets.sort((a, b) => {
      const aValue = a[sort as keyof Ticket];
      const bValue = b[sort as keyof Ticket];

      if (order === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    tickets = tickets.slice(startIndex, endIndex);

    const ticketsWithDetails: any[] = [];

    for (const ticketData of tickets) {
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

      // Get user info
      const userDoc = await adminDb
        .collection("users")
        .doc(ticketData.userId)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        ticketData.user_name = userData?.name;
      }

      // Get assigned user info
      if (ticketData.assignedTo) {
        const assignedUserDoc = await adminDb
          .collection("users")
          .doc(ticketData.assignedTo)
          .get();
        if (assignedUserDoc.exists) {
          const assignedUserData = assignedUserDoc.data();
          ticketData.assigned_user_name = assignedUserData?.name;
        }
      }

      // Get comment count
      const commentsSnapshot = await adminDb
        .collection("comments")
        .where("ticketId", "==", ticketData.id)
        .get();
      ticketData.commentCount = commentsSnapshot.size;

      ticketsWithDetails.push(ticketData);
    }

    // Get total count for pagination (before filtering)
    const totalSnapshot = await adminDb.collection("tickets").get();
    let total = totalSnapshot.size;

    // If search is applied, count filtered results
    if (search) {
      const searchLower = search.toLowerCase();
      total = totalSnapshot.docs.filter((doc) => {
        const data = doc.data();
        return (
          data.subject.toLowerCase().includes(searchLower) ||
          data.description.toLowerCase().includes(searchLower)
        );
      }).length;
    }

    return NextResponse.json({
      tickets: ticketsWithDetails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, description, category_id, priority } =
      await request.json();

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Subject and description are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const ticketData = {
      subject,
      description,
      categoryId: category_id || null,
      priority: priority || "medium",
      userId: user.id,
      status: "open",
      upvotes: 0,
      downvotes: 0,
      createdAt: now,
      updatedAt: now,
    };

    const ticketDoc = await adminDb.collection("tickets").add(ticketData);

    // Create notifications for agents
    const agentsSnapshot = await adminDb
      .collection("users")
      .where("role", "in", ["agent", "admin"])
      .get();

    const batch = adminDb.batch();
    agentsSnapshot.docs.forEach((agentDoc) => {
      const notificationRef = adminDb.collection("notifications").doc();
      batch.set(notificationRef, {
        userId: agentDoc.id,
        title: "New Ticket Created",
        message: `New ticket: ${subject}`,
        type: "ticket",
        ticketId: ticketDoc.id,
        read: false,
        createdAt: now,
      });
    });

    await batch.commit();

    return NextResponse.json(
      { id: ticketDoc.id, ...ticketData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

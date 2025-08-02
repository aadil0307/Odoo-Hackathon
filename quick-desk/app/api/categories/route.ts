import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET() {
  try {
    // Check if Firebase Admin is properly configured
    if (!adminDb) {
      return NextResponse.json(
        {
          error:
            "Firebase Admin not configured. Please set up your Firebase credentials.",
          categories: [],
        },
        { status: 500 }
      );
    }

    const categoriesSnapshot = await adminDb
      .collection("categories")
      .orderBy("name", "asc")
      .get();

    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        categories: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, color } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const categoryData = {
      name,
      description: description || "",
      color: color || "#3B82F6",
      createdAt: new Date().toISOString(),
    };

    const categoryDoc = await adminDb
      .collection("categories")
      .add(categoryData);

    return NextResponse.json(
      { id: categoryDoc.id, ...categoryData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

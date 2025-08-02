import { adminDb } from "@/lib/firebase-admin"
import { hashPassword } from "@/lib/auth"

export async function initializeFirestore() {
  try {
    console.log("Initializing Firestore collections...")

    // Create default categories
    const categories = [
      {
        name: "Technical Support",
        description: "Technical issues and troubleshooting",
        color: "#EF4444",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Billing",
        description: "Billing and payment related queries",
        color: "#10B981",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Feature Request",
        description: "New feature suggestions",
        color: "#8B5CF6",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Bug Report",
        description: "Software bugs and issues",
        color: "#F59E0B",
        createdAt: new Date().toISOString(),
      },
      {
        name: "General Inquiry",
        description: "General questions and information",
        color: "#6B7280",
        createdAt: new Date().toISOString(),
      },
    ]

    // Add categories
    const batch = adminDb.batch()
    categories.forEach((category) => {
      const docRef = adminDb.collection("categories").doc()
      batch.set(docRef, category)
    })

    // Create demo users
    const users = [
      {
        email: "admin@quickdesk.com",
        passwordHash: await hashPassword("admin123"),
        name: "Admin User",
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        email: "agent@quickdesk.com",
        passwordHash: await hashPassword("agent123"),
        name: "Support Agent",
        role: "agent",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        email: "user@quickdesk.com",
        passwordHash: await hashPassword("user123"),
        name: "End User",
        role: "end-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    users.forEach((user) => {
      const docRef = adminDb.collection("users").doc()
      batch.set(docRef, user)
    })

    await batch.commit()
    console.log("Firestore initialized successfully!")
  } catch (error) {
    console.error("Error initializing Firestore:", error)
  }
}

// Run initialization
if (require.main === module) {
  initializeFirestore()
}

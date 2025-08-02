import { type NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { vote_type } = await request.json()

    if (!["upvote", "downvote"].includes(vote_type)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    // Check if user already voted
    const existingVoteSnapshot = await adminDb
      .collection("votes")
      .where("ticketId", "==", params.id)
      .where("userId", "==", user.id)
      .get()

    if (!existingVoteSnapshot.empty) {
      // Update existing vote
      const voteDoc = existingVoteSnapshot.docs[0]
      await adminDb.collection("votes").doc(voteDoc.id).update({
        voteType: vote_type,
      })
    } else {
      // Create new vote
      await adminDb.collection("votes").add({
        ticketId: params.id,
        userId: user.id,
        voteType: vote_type,
        createdAt: new Date().toISOString(),
      })
    }

    // Update ticket vote counts
    const votesSnapshot = await adminDb.collection("votes").where("ticketId", "==", params.id).get()

    let upvotes = 0
    let downvotes = 0

    votesSnapshot.docs.forEach((doc) => {
      const voteData = doc.data()
      if (voteData.voteType === "upvote") {
        upvotes++
      } else if (voteData.voteType === "downvote") {
        downvotes++
      }
    })

    await adminDb.collection("tickets").doc(params.id).update({
      upvotes,
      downvotes,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Vote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

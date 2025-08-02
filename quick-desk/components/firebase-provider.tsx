"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onSnapshot, collection, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./auth-provider"

interface FirebaseContextType {
  realTimeTickets: any[]
  realTimeNotifications: any[]
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [realTimeTickets, setRealTimeTickets] = useState<any[]>([])
  const [realTimeNotifications, setRealTimeNotifications] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Real-time tickets subscription
    let ticketsQuery = query(collection(db, "tickets"), orderBy("createdAt", "desc"))

    if (user.role === "end-user") {
      ticketsQuery = query(collection(db, "tickets"), where("userId", "==", user.id), orderBy("createdAt", "desc"))
    }

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRealTimeTickets(tickets)
    })

    // Real-time notifications subscription
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      where("read", "==", false),
      orderBy("createdAt", "desc"),
    )

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRealTimeNotifications(notifications)
    })

    return () => {
      unsubscribeTickets()
      unsubscribeNotifications()
    }
  }, [user])

  return (
    <FirebaseContext.Provider value={{ realTimeTickets, realTimeNotifications }}>{children}</FirebaseContext.Provider>
  )
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

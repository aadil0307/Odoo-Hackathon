import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export interface User {
  id: number
  email: string
  password_hash: string
  name: string
  role: "end-user" | "agent" | "admin"
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description: string
  color: string
  created_at: string
}

export interface Ticket {
  id: number
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category_id: number
  user_id: number
  assigned_to?: number
  upvotes: number
  downvotes: number
  created_at: string
  updated_at: string
  category?: Category
  user?: User
  assigned_user?: User
}

export interface Comment {
  id: number
  ticket_id: number
  user_id: number
  content: string
  parent_id?: number
  created_at: string
  user?: User
  replies?: Comment[]
}

export interface Vote {
  id: number
  ticket_id: number
  user_id: number
  vote_type: "upvote" | "downvote"
  created_at: string
}

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: string
  read: boolean
  ticket_id?: number
  created_at: string
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "end-user" | "agent" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  categoryId?: string;
  userId: string;
  assignedTo?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  category?: Category;
  user?: User;
  assignedUser?: User;
  // API populated fields
  category_name?: string;
  category_color?: string;
  user_name?: string;
  assigned_user_name?: string;
  commentCount?: number;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  // Populated fields
  user?: User;
  replies?: Comment[];
}

export interface Vote {
  id: string;
  ticketId: string;
  userId: string;
  voteType: "upvote" | "downvote";
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  ticketId?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

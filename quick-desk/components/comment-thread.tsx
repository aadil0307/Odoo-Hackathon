"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reply, MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  user_name: string;
  user_role: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentThreadProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  loading?: boolean;
}

export function CommentThread({
  comments,
  onAddComment,
  loading,
}: CommentThreadProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  console.log("CommentThread received comments:", comments); // Debug log

  const countTotalComments = (comments: Comment[]): number => {
    let total = 0;
    for (const comment of comments) {
      total += 1; // Count the comment itself
      if (comment.replies && comment.replies.length > 0) {
        total += countTotalComments(comment.replies); // Count replies recursively
      }
    }
    return total;
  };

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    console.log("Submitting comment:", { content: newComment, parentId }); // Debug log
    if (newComment.trim()) {
      onAddComment(newComment, parentId);
      setNewComment("");
      setReplyTo(null);
    } else {
      console.log("Comment is empty, not submitting"); // Debug log
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-600";
      case "agent":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => (
    <div
      className={`${depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {comment.user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{comment.user_name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getRoleColor(
                    comment.user_role
                  )}`}
                >
                  {comment.user_role}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                {comment.content}
              </p>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
          </div>

          {replyTo === comment.id && (
            <form
              onSubmit={(e) => handleSubmit(e, comment.id)}
              className="mt-4 ml-11"
            >
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comments ({countTotalComments(comments)})
        </h3>
      </div>

      {/* New comment form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={(e) => handleSubmit(e)}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="mb-3"
            />
            <Button type="submit" disabled={loading || !newComment.trim()}>
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments */}
      <div>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => {
            console.log("Rendering comment:", comment); // Debug log
            return <CommentItem key={comment.id} comment={comment} />;
          })
        )}
      </div>
    </div>
  );
}

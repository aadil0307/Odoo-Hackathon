"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Share2,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface PublicTicketProps {
  params: { id: string };
}

export default function PublicTicketPage({ params }: PublicTicketProps) {
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTicket();
    fetchComments();
    generateShareLink();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}/public`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else {
        toast({
          title: "Error",
          description: "Ticket not found or not publicly accessible.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      toast({
        title: "Error",
        description: "Failed to load ticket.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}/comments/public`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/tickets/${params.id}/share`;
    setShareLink(shareUrl);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Public share link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/tickets/${params.id}/comments/public`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (response.ok) {
        setNewComment("");
        fetchComments();
        toast({
          title: "Comment Added",
          description: "Your comment has been added successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <p>Ticket not found or not publicly accessible.</p>
        <Button asChild className="mt-4">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ticket.subject}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(ticket.status)}>
                {getStatusIcon(ticket.status)}
                <span className="ml-1">{ticket.status}</span>
              </Badge>
              {ticket.priority && (
                <Badge variant="outline">{ticket.priority}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyShareLink}>
            <Share2 className="h-4 w-4 mr-2" />
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Share
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Public Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Public Ticket View</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            This is a publicly shared ticket. You can view and comment without
            logging in.
          </p>
        </CardContent>
      </Card>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Created by:</span>
              <p>{ticket.user_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Created:</span>
              <p>{new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
            {ticket.category_name && (
              <div>
                <span className="font-medium text-gray-600">Category:</span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ticket.category_color }}
                  />
                  <span>{ticket.category_name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Voting Section */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              {comments.length} conversation{comments.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="border-l-4 border-gray-200 pl-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.user_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        {comment.user_role && (
                          <Badge variant="outline" className="text-xs">
                            {comment.user_role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Add a Comment</h4>
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts or ask a question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Comments are public and visible to everyone with this link.
                </p>
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submitting}
                  size="sm"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Prompt */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-orange-800">
                Want to create your own tickets?
              </h4>
              <p className="text-sm text-orange-700 mt-1">
                Sign up for an account to create and manage your own support
                tickets.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

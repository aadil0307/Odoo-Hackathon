"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommentThread } from "@/components/comment-thread";
import {
  ArrowLeft,
  Share2,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface TicketDetailProps {
  params: { id: string };
}

export default function TicketDetailPage({ params }: TicketDetailProps) {
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTicket();
    fetchComments();
    generateShareLink();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      }
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched comments:", data); // Debug log
        setComments(data);
      } else {
        console.error(
          "Failed to fetch comments:",
          response.status,
          response.statusText
        );
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setTicket(updatedTicket);
        toast({
          title: "Status Updated",
          description: `Ticket status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket status.",
        variant: "destructive",
      });
    }
  };

  const handleVote = async (voteType: "upvote" | "downvote") => {
    try {
      const response = await fetch(`/api/tickets/${params.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote_type: voteType }),
      });

      if (response.ok) {
        fetchTicket(); // Refresh to get updated vote counts
        toast({
          title: "Vote Recorded",
          description: `Your ${voteType} has been recorded.`,
        });
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      toast({
        title: "Error",
        description: "Failed to record your vote.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    setCommentLoading(true);
    try {
      console.log("Creating comment:", { content, parentId }); // Debug log
      const response = await fetch(`/api/tickets/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Comment created:", result); // Debug log
        await fetchComments(); // Refresh comments
        toast({
          title: "Comment Added",
          description: "Your comment has been added successfully.",
        });
      } else {
        const errorData = await response.json();
        console.error("Comment creation failed:", errorData); // Debug log
        toast({
          title: "Error",
          description: errorData.error || "Failed to add comment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const countTotalComments = (comments: any[]): number => {
    let total = 0;
    for (const comment of comments) {
      total += 1; // Count the comment itself
      if (comment.replies && comment.replies.length > 0) {
        total += countTotalComments(comment.replies); // Count replies recursively
      }
    }
    return total;
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
        <p>Ticket not found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to Dashboard</Link>
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
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ticket Details</span>
            {(user?.role === "admin" || user?.role === "agent") && (
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            )}
          </CardTitle>
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("upvote")}
                className="flex items-center gap-1"
              >
                👍 {ticket.upvotes || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("downvote")}
                className="flex items-center gap-1"
              >
                👎 {ticket.downvotes || 0}
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {countTotalComments(comments)} conversation
              {countTotalComments(comments) !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentThread
            comments={comments}
            onAddComment={handleAddComment}
            loading={commentLoading}
          />
        </CardContent>
      </Card>

      {/* Share Link Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Public Share Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">
            Create a publicly shareable link for this ticket. Anyone with this
            link can view the ticket without logging in.
          </p>
          <div className="flex items-center gap-2">
            <Textarea value={shareLink} readOnly className="flex-1" />
            <Button variant="outline" onClick={copyShareLink}>
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

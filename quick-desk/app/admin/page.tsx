"use client";

import type React from "react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Tag,
  Settings,
  Plus,
  Crown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotionRequests, setPromotionRequests] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "agent")) {
      fetchUsers();
      fetchCategories();
      if (user.role === "admin") {
        fetchPromotionRequests();
      }
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPromotionRequests = async () => {
    try {
      const response = await fetch("/api/admin/promotion-requests");
      if (response.ok) {
        const data = await response.json();
        setPromotionRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch promotion requests:", error);
    }
  };

  const updateUserRole = async (userId: number, role: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      if (response.ok) {
        fetchUsers();
        toast({
          title: "Role Updated",
          description: "User role has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const handlePromotionRequest = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const body: any = { requestId, action };
      if (action === "reject" && rejectReason) {
        body.reason = rejectReason;
      }

      const response = await fetch("/api/admin/promotion-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchPromotionRequests();
        fetchUsers(); // Refresh users list in case role was changed
        setRejectReason("");
        toast({
          title: action === "approve" ? "Request Approved" : "Request Rejected",
          description: `Promotion request has been ${action}d successfully.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${action} request.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Failed to ${action} promotion request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} promotion request.`,
        variant: "destructive",
      });
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setNewCategory({ name: "", description: "", color: "#3B82F6" });
        fetchCategories();
        toast({
          title: "Category Created",
          description: "New category has been created successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      toast({
        title: "Error",
        description: "Failed to create category.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "agent")) {
    return (
      <div className="text-center py-8">
        <p>Access denied. Admin or Agent role required.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">
          Manage users, categories, and system settings
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          {user.role === "admin" && (
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Promotion Requests
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((u: any) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                      <div className="text-xs text-gray-400">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "destructive"
                            : u.role === "agent"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {u.role}
                      </Badge>
                      {user.role === "admin" && (
                        <Select
                          value={u.role}
                          onValueChange={(role) => updateUserRole(u.id, role)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="end-user">End User</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Category name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      placeholder="Category description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category: any) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">
                        ({category.description})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {user.role === "admin" && (
          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Promotion Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotionRequests.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No promotion requests found.
                    </p>
                  ) : (
                    promotionRequests.map((request: any) => (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {request.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.userEmail}
                            </div>
                            <div className="text-xs text-gray-400">
                              Requested on{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{request.status}</span>
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            From:{" "}
                            <Badge variant="outline">
                              {request.currentRole}
                            </Badge>
                          </span>
                          <span className="text-gray-600">
                            To:{" "}
                            <Badge variant="outline">
                              {request.requestedRole}
                            </Badge>
                          </span>
                        </div>

                        {request.reason && (
                          <div className="text-sm text-gray-600">
                            <strong>Reason:</strong> {request.reason}
                          </div>
                        )}

                        {request.status === "pending" && (
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handlePromotionRequest(request.id, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <div className="flex items-center gap-2">
                              <Textarea
                                placeholder="Reason for rejection (optional)"
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                className="w-48"
                                rows={2}
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handlePromotionRequest(request.id, "reject")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}

                        {request.status === "rejected" &&
                          request.adminReason && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              <strong>Rejection Reason:</strong>{" "}
                              {request.adminReason}
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

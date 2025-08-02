"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  User,
  Settings,
  Languages,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    categoryInterest: false,
    language: "en",
  });
  const [promotionRequest, setPromotionRequest] = useState({
    requested: false,
    status: "", // "pending", "approved", "rejected"
    message: "",
    requestedRole: "",
  });
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestedRole, setRequestedRole] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "end-user",
        categoryInterest: user.categoryInterest || false,
        language: user.language || "en",
      });
      fetchPromotionStatus();
    }
  }, [user]);

  const fetchPromotionStatus = async () => {
    try {
      const response = await fetch("/api/profile/promotion-status");
      if (response.ok) {
        const data = await response.json();
        setPromotionRequest(data);
      }
    } catch (error) {
      console.error("Failed to fetch promotion status:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          categoryInterest: profile.categoryInterest,
          language: profile.language,
        }),
      });

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePromotionRequest = async () => {
    if (!requestedRole) {
      toast({
        title: "Error",
        description: "Please select a role to request.",
        variant: "destructive",
      });
      return;
    }

    setRequesting(true);
    try {
      const response = await fetch("/api/profile/request-promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedRole,
          reason: `User requested promotion from ${profile.role} to ${requestedRole}`,
        }),
      });

      if (response.ok) {
        setPromotionRequest({
          ...promotionRequest,
          requested: true,
          status: "pending",
          requestedRole,
        });
        setRequestedRole("");
        toast({
          title: "Promotion Requested",
          description: `Your promotion request to ${requestedRole} has been submitted to admin.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to submit promotion request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit promotion request.",
        variant: "destructive",
      });
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to access your profile.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Enter your email"
                type="email"
              />
            </div>
          </div>

          {/* Role Display - Read Only */}
          <div>
            <Label htmlFor="role" className="flex items-center gap-2">
              Current Role
              <Lock className="h-4 w-4 text-gray-400" />
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  profile.role === "admin"
                    ? "destructive"
                    : profile.role === "agent"
                    ? "default"
                    : "secondary"
                }
                className="text-sm"
              >
                {profile.role}
              </Badge>
              <span className="text-sm text-gray-500">
                (Role can only be changed by admin approval)
              </span>
            </div>
          </div>

          {profile.role === "end-user" && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="categoryInterest">Category in Interest</Label>
                <p className="text-sm text-gray-500">
                  Show only if role is End User
                </p>
              </div>
              <Switch
                id="categoryInterest"
                checked={profile.categoryInterest}
                onCheckedChange={(checked) =>
                  setProfile({ ...profile, categoryInterest: checked })
                }
              />
            </div>
          )}

          <div>
            <Label htmlFor="language">Change Language</Label>
            <Select
              value={profile.language}
              onValueChange={(value) =>
                setProfile({ ...profile, language: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Updating..." : "Update"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Request */}
      {profile.role === "end-user" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Request Role Promotion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Request a role upgrade. Your request will be reviewed by an admin
              who can accept or reject it.
            </p>

            {promotionRequest.requested && (
              <Alert>
                <div className="flex items-center gap-2">
                  {promotionRequest.status === "pending" && (
                    <Clock className="h-4 w-4" />
                  )}
                  {promotionRequest.status === "approved" && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {promotionRequest.status === "rejected" && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    {promotionRequest.status === "pending" &&
                      `Your promotion request to ${promotionRequest.requestedRole} is pending admin approval.`}
                    {promotionRequest.status === "approved" &&
                      `Your promotion request to ${promotionRequest.requestedRole} has been approved!`}
                    {promotionRequest.status === "rejected" &&
                      `Your promotion request to ${promotionRequest.requestedRole} was rejected: ${promotionRequest.message}`}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {!promotionRequest.requested && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="requestedRole">Request Promotion To</Label>
                  <Select
                    value={requestedRole}
                    onValueChange={setRequestedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role to request" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Support Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handlePromotionRequest}
                  disabled={requesting || !requestedRole}
                >
                  {requesting ? "Requesting..." : "Request Promotion"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Role Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current Role:</span>
            <Badge
              variant={
                profile.role === "admin"
                  ? "destructive"
                  : profile.role === "agent"
                  ? "default"
                  : "secondary"
              }
            >
              {profile.role}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

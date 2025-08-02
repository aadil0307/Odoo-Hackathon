"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Database, Users, Settings, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [initStatus, setInitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const initializeFirebase = async () => {
    setInitStatus("loading")
    setMessage("Initializing Firebase database...")

    try {
      const response = await fetch("/api/init-firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInitStatus("success")
        setMessage("Firebase initialized successfully! Demo users and categories have been created.")
      } else {
        const error = await response.json()
        setInitStatus("error")
        setMessage(`Error: ${error.error || "Failed to initialize Firebase"}`)
      }
    } catch (error) {
      setInitStatus("error")
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <Database className="h-16 w-16 text-blue-600 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Quick Desk Setup</h1>
        <p className="text-gray-600">Initialize your Firebase database with demo data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Initialize Firestore collections with demo categories and sample data.
            </p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Categories collection</li>
              <li>• Demo users</li>
              <li>• Sample tickets</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Demo Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Create demo users with different roles for testing.</p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Admin user</li>
              <li>• Agent user</li>
              <li>• End user</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Set up default categories and system configuration.</p>
            <ul className="text-xs space-y-1 text-gray-500">
              <li>• Technical Support</li>
              <li>• Billing</li>
              <li>• Feature Requests</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Initialize Firebase Database</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {initStatus === "idle" && (
            <div>
              <p className="text-gray-600 mb-4">
                Click the button below to initialize your Firebase database with demo data. This will create:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
                <li>Demo users (Admin, Agent, End User)</li>
                <li>Default ticket categories</li>
                <li>Sample notifications</li>
              </ul>
              <Button onClick={initializeFirebase} size="lg" className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Initialize Database
              </Button>
            </div>
          )}

          {initStatus === "loading" && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {initStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{message}</AlertDescription>
            </Alert>
          )}

          {initStatus === "error" && (
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {initStatus === "success" && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Demo Credentials:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Admin:</strong>
                  <br />
                  Email: admin@quickdesk.com
                  <br />
                  Password: admin123
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>Agent:</strong>
                  <br />
                  Email: agent@quickdesk.com
                  <br />
                  Password: agent123
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong>End User:</strong>
                  <br />
                  Email: user@quickdesk.com
                  <br />
                  Password: user123
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild>
                  <a href="/login">Go to Login</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Firebase Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Project ID:</strong> quickdesk-60171
            </div>
            <div>
              <strong>Region:</strong> Global
            </div>
            <div>
              <strong>Database:</strong> Firestore
            </div>
            <div>
              <strong>Storage:</strong> Firebase Storage
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

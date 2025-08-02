import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Users, MessageCircle, TrendingUp, Shield, Database } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Ticket className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Quick Desk</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Modern help desk and ticketing system powered by Firebase with real-time updates, role-based access control,
          and powerful search capabilities.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Firebase Powered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Built on Firebase Firestore for real-time data synchronization and scalable cloud infrastructure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              Smart Ticketing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Create, track, and manage tickets with status workflows, categories, and priority levels.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Real-time Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Instant updates with Firebase real-time listeners for comments, status changes, and notifications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Role-based Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Secure authentication with JWT tokens and role-based permissions for End Users, Agents, and Admins.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Voting System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Community-driven ticket prioritization with upvote and downvote functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Comprehensive admin panel for user management, category management, and system oversight.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Firebase Features */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <Database className="h-6 w-6" />
            Firebase Integration Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Real-time Database:</strong>
              <br />• Live ticket updates
              <br />• Instant notifications
              <br />• Real-time comments
            </div>
            <div>
              <strong>Cloud Storage:</strong>
              <br />• File attachments
              <br />• Image uploads
              <br />• Secure file sharing
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Credentials */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Demo Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Admin:</strong>
              <br />
              Email: admin@quickdesk.com
              <br />
              Password: admin123
            </div>
            <div>
              <strong>Agent:</strong>
              <br />
              Email: agent@quickdesk.com
              <br />
              Password: agent123
            </div>
            <div>
              <strong>End User:</strong>
              <br />
              Email: user@quickdesk.com
              <br />
              Password: user123
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Initialize Firebase:</strong> After setting up your Firebase project, visit{" "}
              <code className="bg-blue-200 px-1 rounded">/api/init-firebase</code> to create demo data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

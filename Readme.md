# 🚀 QuickDesk - Modern Help Desk & Support Ticket System

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, feature-rich help desk and support ticket management system built with Next.js 14, TypeScript, Firebase, and Tailwind CSS. Perfect for businesses, support teams, and organizations looking to streamline their customer support operations.

## ✨ Features

### 🎯 Core Functionality
- **Multi-Role Support System** - Admin, Agent, End-User, and Guest roles
- **Real-time Ticket Management** - Create, update, and track support tickets
- **Advanced Comment System** - Threaded comments with replies
- **Smart Notifications** - Real-time notifications for all activities
- **Role Promotion System** - Admin-approved role upgrade requests
- **Public Ticket Sharing** - Share tickets publicly without authentication

### 📊 Dashboard & Analytics
- **Comprehensive Dashboard** - Real-time statistics and metrics
- **Interactive Charts** - Visual data representation with Recharts
- **Ticket Analytics** - Status distribution, category breakdown, weekly trends
- **Performance Metrics** - Response times, resolution rates, user activity

### 🔐 Authentication & Security
- **Secure Authentication** - Custom token-based auth with Firebase
- **Role-based Access Control** - Granular permissions for each role
- **Session Management** - Secure login/logout with persistent sessions
- **Data Protection** - Encrypted data storage and transmission

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Theme switching capability
- **Modern Components** - Built with Shadcn UI components
- **Intuitive Navigation** - Clean and user-friendly interface
- **Loading States** - Smooth user experience with loading indicators

### 📱 Advanced Features
- **Bulk Operations** - Select and manage multiple tickets
- **Advanced Filtering** - Filter by status, category, priority, and search
- **Sorting Options** - Sort by date, priority, status, and more
- **Pagination** - Efficient handling of large datasets
- **Export Capabilities** - Export ticket data and reports

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0 | React framework with App Router |
| **TypeScript** | 5.0 | Type-safe JavaScript |
| **Firebase** | 10.0 | Backend services (Auth, Firestore) |
| **Tailwind CSS** | 3.3 | Utility-first CSS framework |
| **Shadcn UI** | Latest | Modern component library |
| **Recharts** | Latest | Data visualization library |
| **Lucide React** | Latest | Icon library |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quick-desk.git
   cd quick-desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Download your service account key
   - Copy the configuration to `.env.local`

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Client Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin Configuration
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY=your_private_key
   ```

5. **Initialize Firebase**
   ```bash
   npm run dev
   ```
   Then visit `http://localhost:3000/setup` to initialize the database with demo data.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 User Roles & Permissions

### 🔴 Admin
- **Full system access** - Manage all aspects of the platform
- **User management** - Create, edit, and delete users
- **Category management** - Create and manage ticket categories
- **Promotion requests** - Approve/reject role upgrade requests
- **System analytics** - Access comprehensive dashboard and reports
- **Bulk operations** - Manage multiple tickets simultaneously

### 🔵 Agent
- **Ticket management** - Create, update, and resolve tickets
- **Comment system** - Respond to tickets with threaded comments
- **Assignment handling** - Take ownership of tickets
- **Status updates** - Update ticket status and priority
- **Limited admin access** - Access admin panel for basic operations

### 🟢 End-User
- **Ticket creation** - Submit new support tickets
- **Comment participation** - Add comments and replies to tickets
- **Status tracking** - Monitor ticket progress and updates
- **Profile management** - Update personal information
- **Promotion requests** - Request role upgrades (Agent/Admin)

### ⚪ Guest
- **Public ticket viewing** - View shared tickets without login
- **Public commenting** - Add comments to shared tickets
- **Limited access** - No authentication required

## 📋 Features Breakdown

### 🎫 Ticket Management
- **Create tickets** with subject, description, category, and priority
- **Update ticket status** (Open, In Progress, Resolved, Closed)
- **Assign tickets** to agents or admins
- **Vote system** - Upvote/downvote tickets
- **Public sharing** - Generate shareable links for tickets
- **Bulk operations** - Select and manage multiple tickets

### 💬 Comment System
- **Threaded comments** - Nested replies and conversations
- **Real-time updates** - Comments appear immediately
- **User identification** - Shows commenter name and role
- **Rich formatting** - Support for multi-line comments
- **Notification system** - Notifies ticket owners of new comments

### 🔔 Notification System
- **Real-time notifications** - Instant updates for all activities
- **Multiple types** - Ticket creation, comments, assignments, promotions
- **Unread count** - Visual indicator of pending notifications
- **Click to mark read** - Interactive notification management
- **Time formatting** - Human-readable timestamps

### 📊 Dashboard & Analytics
- **Real-time statistics** - Live updates of ticket metrics
- **Interactive charts** - Visual representation of data
- **Weekly trends** - Track ticket activity over time
- **Category breakdown** - Analyze tickets by category
- **Status distribution** - Monitor ticket status patterns

### 👤 User Management
- **Role-based access** - Granular permissions for each role
- **Profile management** - Update personal information
- **Promotion system** - Request and approve role upgrades
- **Session management** - Secure login/logout functionality
- **Password security** - Encrypted password storage

## 🎨 UI Components

The application uses a modern component library built with:
- **Shadcn UI** - High-quality, accessible components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful, consistent icons
- **Recharts** - Responsive chart components

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tickets
- `GET /api/tickets` - List tickets with filtering/pagination
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/[id]` - Get ticket details
- `PUT /api/tickets/[id]` - Update ticket
- `GET /api/tickets/[id]/public` - Public ticket access

### Comments
- `GET /api/tickets/[id]/comments` - Get ticket comments
- `POST /api/tickets/[id]/comments` - Add comment
- `GET /api/tickets/[id]/comments/public` - Public comments

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications` - Mark notifications as read

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users` - Update user
- `GET /api/admin/promotion-requests` - Get promotion requests
- `PUT /api/admin/promotion-requests` - Approve/reject requests

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- **Netlify** - Static site hosting
- **Railway** - Full-stack platform
- **DigitalOcean** - App Platform
- **AWS** - Amplify or EC2

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Firebase Team** - For the powerful backend services
- **Shadcn UI** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For the excellent deployment platform

## 📞 Support

If you have any questions or need help:
- 📧 Email: support@quickdesk.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/quick-desk/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/quick-desk/wiki)

---

<div align="center">
  <p>Made with ❤️ by the QuickDesk Team</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>

# ROCKEFVSFC Manager 2.0

A modern, enterprise-grade Management Information System (MIS) for Rockefvs Football Club.

## 🚀 Project Overview

This application provides a comprehensive solution for managing football club operations including player management, invoicing, payment tracking, and parent communication.

### 🎯 Features

- **Modern UI**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Authentication**: Kinde-powered authentication with role-based access (Admin/Parent)
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Responsive Design**: Mobile-first approach with dark/light mode toggle
- **Email Integration**: Resend for automated email notifications

### 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Kinde (OAuth 2.0)
- **Database**: Neon (PostgreSQL) + Drizzle ORM
- **Email**: Resend
- **State Management**: React Hook Form + Zod validation
- **Charts**: recharts for admin dashboard statistics

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rockefvsfc-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Kinde Configuration
   KINDE_DOMAIN=your-kinde-domain.kinde.com
   KINDE_CLIENT_ID=your-kinde-client-id
   KINDE_CLIENT_SECRET=your-kinde-client-secret
   KINDE_ISSUER_URL=https://your-kinde-domain.kinde.com
   KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
   KINDE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

   # Database Configuration (Neon)
   DATABASE_URL=your-neon-database-url

   # Resend Configuration
   RESEND_API_KEY=your-resend-api-key

   # Application
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

4. **Database Setup**
   ```bash
   # Generate migrations
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
rockefvsfc-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication endpoints
│   │   ├── dashboard/         # Protected dashboard pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── theme-provider.tsx # Theme context provider
│   │   └── theme-toggle.tsx   # Dark/light mode toggle
│   ├── lib/
│   │   ├── auth.ts           # Kinde authentication utilities
│   │   └── db/               # Database configuration
│   │       ├── index.ts      # Database connection
│   │       └── schema.ts     # Database schema
│   └── app/
│       ├── layout.tsx        # Root layout with theme provider
│       └── globals.css       # Global styles
├── drizzle.config.ts         # Drizzle ORM configuration
├── .env.local               # Environment variables
└── package.json             # Dependencies and scripts
```

## 🎨 UI Components

The application uses shadcn/ui components for a consistent and modern design:

- **Button**: Primary and secondary action buttons
- **Card**: Content containers for features and information
- **Input**: Form inputs with validation
- **Label**: Form field labels
- **Select**: Dropdown selections
- **Table**: Data display tables
- **Dialog**: Modal dialogs
- **Dropdown Menu**: Navigation and action menus
- **Form**: Form handling with React Hook Form integration
- **Toast**: Notification system

## 🔐 Authentication

The application uses Kinde for authentication with the following roles:

- **Admin**: Full access to all management features
- **Parent**: Limited access to view own players, invoices, and upload payment proofs

### Authentication Flow

1. Users are redirected to Kinde for login/signup
2. Kinde handles OAuth 2.0 authentication
3. Users are redirected back to the application
4. Role-based access control determines available features

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User information (extends Kinde user data)
- **players**: Player profiles with age group and status tracking
- **invoices**: Invoice management with status tracking
- **payments**: Payment records with proof uploads

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Ensure all environment variables from `.env.local` are set in your production environment.

## 📋 Phase 1 Completion

This Phase 1 implementation includes:

- ✅ Project initialization with Next.js 15 and TypeScript
- ✅ Installation of all required dependencies
- ✅ shadcn/ui component setup
- ✅ Kinde authentication configuration
- ✅ Theme provider with dark/light mode toggle
- ✅ Basic layout and navigation structure
- ✅ Database schema definition with Drizzle ORM
- ✅ Database connection setup with Neon/PostgreSQL

## 🔄 Next Steps (Phase 2)

Phase 2 will focus on:

- Database migrations and seeding
- Admin dashboard implementation
- Player management features
- Invoice and payment system
- Role-based access control implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a Phase 1 implementation. The full application will be completed across multiple phases as outlined in the project plan.
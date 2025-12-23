# My Vinyl Shop

A modern, full-featured vinyl record marketplace built for collectors and sellers. Buy, sell, and showcase vinyl records in a curated marketplace designed for audiophiles and music enthusiasts.

## 🎵 Overview

My Vinyl Shop is a comprehensive e-commerce platform specifically designed for the vinyl record community. It combines modern web technologies with AI-powered features to create an intuitive marketplace experience for both buyers and sellers.

### Key Features

- **AI-Powered Listings**: Upload photos of vinyl records and let AI automatically identify albums, assess condition, and suggest pricing
- **Fixed & Auction Listings**: List records at fixed prices or create auction-style listings with bidding
- **Collection Management**: Track your personal vinyl collection separate from listings
- **Advanced Search**: Full-text search powered by Upstash Search for finding records and sellers
- **Seller Profiles**: Instagram-style showcase pages for sellers to build their brand
- **Messaging System**: Direct messaging between buyers and sellers
- **Order Management**: Complete order tracking from purchase to delivery
- **Subscription Tiers**: Free, Pro, and Crate Digger tiers with different features and transaction fees
- **Responsive Design**: Mobile-first design with native mobile navigation

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend & Services

- **Clerk** - Authentication and user management
- **Drizzle ORM** - Database ORM
- **SQLite** - Database (with support for multiple providers)
- **Upstash Search** - Full-text search
- **Upstash Redis** - Caching and rate limiting
- **Vercel Blob** - Image storage
- **Vercel Analytics** - Analytics

### AI & Integrations

- **Vercel AI SDK** - AI integration
- **Google Gemini 2.5 Flash** - Vinyl record analysis and identification

### Data Fetching

- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── analyze-vinyl/ # AI vinyl analysis endpoint
│   │   ├── search/        # Search endpoints
│   │   ├── vinyls/        # Vinyl CRUD operations
│   │   ├── sellers/       # Seller profiles
│   │   └── upload/       # Image upload
│   ├── auth/              # Authentication pages (Clerk)
│   ├── browse/            # Browse/search vinyl records
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── dashboard/         # Seller dashboard
│   │   ├── collection/    # Personal collection
│   │   ├── listings/      # Manage listings
│   │   ├── orders/        # Order management
│   │   ├── messages/      # Messaging
│   │   └── profile/       # Profile settings
│   ├── onboarding/       # User onboarding
│   ├── product/           # Product detail pages
│   └── seller/            # Seller profile pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database schema and connection
│   ├── hooks/            # Custom React hooks
│   ├── search.ts         # Search functionality
│   ├── types.ts          # TypeScript types
│   └── validations.ts    # Zod schemas
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- Clerk account for authentication
- Upstash account for search/Redis (optional for development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd my-vinyl-shop
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook signing secret (for syncing user data)
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `UPSTASH_SEARCH_REST_URL` - Upstash Search URL (optional)
- `UPSTASH_SEARCH_REST_TOKEN` - Upstash Search token (optional)
- `KV_REST_API_URL` or `UPSTASH_REDIS_REST_URL` - Redis URL (optional)
- `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_TOKEN` - Redis token (optional)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token for image uploads
- `GOOGLE_GENERATIVE_AI_API_KEY` - For AI vinyl analysis
- `STRIPE_SECRET_KEY` - Stripe secret key for Connect (optional for development, required for production)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (optional for development, required for production)

4. Run database initialization:

```bash
pnpm db:init
```

5. Set up Clerk webhooks (for syncing user data):
   - Go to your [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
   - Click "Add Endpoint"
   - Enter your webhook URL: `https://yourdomain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret** and add it to `.env.local` as `CLERK_WEBHOOK_SECRET`
   - For local development, use a tool like [ngrok](https://ngrok.com) to expose your local server

6. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🎯 Core Features

### AI Vinyl Analysis

Upload photos of vinyl records and the AI will:

- Identify album title, artist, year, genre, and label
- Assess condition (sleeve and vinyl separately)
- Generate seller-ready descriptions
- Suggest pricing based on market value and condition

### Listing Types

- **Fixed Price**: Set a fixed price for immediate purchase
- **Auction**: Create time-limited auctions with bidding
  - Starting bid
  - Reserve price (optional)
  - Buy it now option (optional)
  - Automatic auction end dates

### Subscription Tiers

1. **Free**
   - Up to 10 active listings
   - Fixed price selling only
   - 5% transaction fee

2. **Vinyl Pro** ($9/month)
   - Unlimited listings
   - Auction listings
   - AI-powered listing creation
   - Featured seller badge
   - 3% transaction fee
   - Analytics dashboard

3. **Crate Digger** ($24/month)
   - Everything in Pro
   - Bulk listing tools
   - Custom storefront URL
   - API access
   - 1.5% transaction fee
   - Dedicated account manager

### Search & Discovery

- Full-text search across vinyl records and sellers
- Filter by genre, condition, year, price range
- Sort by popularity, rating, newest, price
- Browse by genre categories
- Seller discovery and profiles

### User Features

- Personal collection tracking
- Order history and tracking
- Direct messaging with sellers
- Follow favorite sellers
- Notifications for orders, messages, and bids
- Profile customization with bio, location, social links

## 🗄️ Database Schema

The application uses Drizzle ORM with SQLite. Key tables:

- **users** - User profiles extending Clerk authentication
- **vinyls** - Vinyl records (both collection items and listings)
- **orders** - Purchase orders
- **bids** - Auction bids
- **conversations** & **messages** - Messaging system
- **follows** - User follow relationships
- **notifications** - User notifications

See `lib/db/schema.ts` for complete schema definitions.

## 🔐 Authentication

Authentication is handled by Clerk. Users can:

- Sign up with email/password
- Social login (if configured)
- Manage profile and settings through Clerk dashboard

### User Data Synchronization

User data is automatically synced from Clerk to your database via webhooks:

- **user.created** - Creates a new user record when a user signs up
- **user.updated** - Updates user data (email, name, avatar) when changed in Clerk
- **user.deleted** - Removes user record when account is deleted

The webhook handler is located at `/api/webhooks/clerk` and automatically:

- Syncs basic user info (email, name, username, avatar) from Clerk
- Preserves custom fields (bio, location, genres, etc.) that are set during onboarding
- Handles race conditions and missing records gracefully

**Note**: Custom profile data (bio, location, genres, etc.) is set during onboarding and won't be overwritten by webhook updates unless explicitly changed by the user.

## 🎨 Design System

The application uses:

- **shadcn/ui** components built on Radix UI
- **Tailwind CSS** for styling
- **CSS variables** for theming (light/dark mode)
- **Framer Motion** for smooth animations
- Mobile-first responsive design

## 📦 Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

This is a private project. For questions or issues, please contact the maintainers.

## 📄 License

Private - All rights reserved

## 🔗 Links

- **Live Site**: [https://vercel.com/rocktownlabs/my-vinyl-shop](https://vercel.com/rocktownlabs/my-vinyl-shop)
- **Built with**: [v0.app](https://v0.app)

---

Built with ❤️ for vinyl collectors and music lovers

# Subscription & Payment Setup Guide

## 📋 Subscription Tiers Overview

### Free Tier ($0/month)

- **Target**: Casual sellers and collectors
- **Features**:
  - Up to 10 active listings
  - Fixed price selling only
  - Basic seller profile
  - Standard support
  - 5% transaction fee

### Vinyl Pro ($9/month)

- **Target**: Serious sellers who want to grow
- **Features**:
  - Unlimited listings
  - Auction listings
  - AI-powered listing creation
  - Featured seller badge
  - Priority support
  - 3% transaction fee
  - Analytics dashboard

### Crate Digger ($24/month)

- **Target**: Power sellers and shops
- **Features**:
  - Everything in Vinyl Pro
  - Bulk listing tools
  - Custom storefront URL
  - API access
  - 1.5% transaction fee
  - Dedicated account manager
  - Early access to features

## 🔧 Clerk Billing Setup

### Step 1: Enable Billing in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Billing** → **Settings**
2. Enable **Billing** for your application
3. Connect your Stripe account (required for payments)

### Step 2: Create Subscription Plans

Create these plans in Clerk Dashboard → **Billing** → **Plans**:

#### Plan 1: Free

- **Name**: `free`
- **Price**: $0/month
- **Features**:
  - `max_listings: 10`
  - `listing_type: fixed`
  - `transaction_fee: 5`
  - `ai_listing: false`
  - `auctions: false`

#### Plan 2: Vinyl Pro

- **Name**: `vinyl_pro`
- **Price**: $9/month (recurring)
- **Features**:
  - `max_listings: unlimited`
  - `listing_type: all`
  - `transaction_fee: 3`
  - `ai_listing: true`
  - `auctions: true`
  - `featured_badge: true`
  - `analytics: true`

#### Plan 3: Crate Digger

- **Name**: `crate_digger`
- **Price**: $24/month (recurring)
- **Features**:
  - `max_listings: unlimited`
  - `listing_type: all`
  - `transaction_fee: 1.5`
  - `ai_listing: true`
  - `auctions: true`
  - `featured_badge: true`
  - `analytics: true`
  - `bulk_tools: true`
  - `custom_url: true`
  - `api_access: true`

## 💳 Stripe Connect Setup

### Step 1: Enable Stripe Connect

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Connect** → **Settings**
2. Enable **Connect** for your account
3. Set up your Connect settings:
   - **Account type**: Standard (recommended for marketplace)
   - **Onboarding**: Custom (we'll handle in-app)

### Step 2: Get Stripe Keys

You'll need these from Stripe Dashboard → **Developers** → **API keys**:

- `STRIPE_PUBLISHABLE_KEY` - Publishable key
- `STRIPE_SECRET_KEY` - Secret key
- `STRIPE_WEBHOOK_SECRET` - For Connect webhooks

### Step 3: Configure Stripe Connect

- **Application fee**: 0% (we handle fees via subscription tiers)
- **Payout schedule**: Automatic daily
- **Supported countries**: Configure based on your market

## 🔗 Integration Points

### Onboarding Flow

1. **Step 1**: Account type selection (Collector/Seller/Both)
2. **Step 2**: Profile setup
3. **Step 3**: Location & preferences
4. **Step 4**: Subscription selection (Free or Premium) - NEW
5. **Step 5**: Stripe Connect onboarding (for Sellers/Both) - NEW
6. **Step 6**: Review & complete

### Subscription Selection

- Use Clerk's `<PricingTable />` component
- Show Free and Premium options
- Premium links to Clerk checkout
- After subscription, redirect back to onboarding

### Stripe Connect Onboarding

- Only shown for users with `accountType === "seller" || accountType === "both"`
- Creates Stripe Connect account
- Collects business information
- Handles verification
- Stores Connect account ID in database

## 📊 Database Schema Updates

Add to `users` table:

- `stripeConnectAccountId` - Stripe Connect account ID
- `stripeConnectOnboardingStatus` - pending, active, restricted
- `stripeConnectOnboardingLink` - Latest onboarding link URL

## 🔐 Environment Variables

Add to `.env.local`:

```bash
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk Billing (automatically configured via Clerk Dashboard)
# No additional env vars needed
```

## 📝 Implementation Checklist

- [ ] Enable Clerk Billing in dashboard
- [ ] Create 3 subscription plans in Clerk
- [ ] Set up Stripe Connect account
- [ ] Add Stripe keys to environment
- [ ] Update onboarding flow with subscription step
- [ ] Add Stripe Connect onboarding step
- [ ] Create API routes for Stripe Connect
- [ ] Update database schema
- [ ] Add subscription checks to listing creation
- [ ] Add webhook handlers for subscription events
- [ ] Test full flow end-to-end

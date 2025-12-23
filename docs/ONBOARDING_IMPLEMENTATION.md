# Onboarding Implementation - Subscription & Stripe Connect

## ✅ Implementation Complete

### 1. Database Schema ✅

- Added `stripeConnectAccountId` field to users table
- Added `stripeConnectOnboardingStatus` field
- Added `stripeConnectOnboardingLink` field

### 2. Stripe Connect API Routes ✅

Created three API routes:

- **`/api/stripe/connect/create-account`** - Creates Stripe Connect Express account
- **`/api/stripe/connect/create-link`** - Generates onboarding link for sellers
- **`/api/stripe/connect/status`** - Checks account onboarding status

### 3. Onboarding Flow Updated ✅

The onboarding now has **6 steps** (was 4):

1. **Account Type** - Collector/Seller/Both
2. **Profile Info** - Name, username, bio, avatar
3. **Location & Genres** - Location, country, favorite genres
4. **Subscription Selection** - NEW - Clerk PricingTable component
5. **Stripe Connect Onboarding** - NEW - Only for Sellers/Both
6. **Review & Complete** - Final review before completion

### 4. Features Added ✅

- Subscription selection using Clerk's `<PricingTable />` component
- Automatic Stripe Connect account creation for sellers
- Stripe onboarding link generation and redirect
- Status checking when returning from Stripe
- Smart step navigation (skips Stripe step for collectors)

## 🔧 Setup Required

### 1. Install Stripe Package

```bash
pnpm add stripe
```

### 2. Add Environment Variables

Add to `.env.local`:

```bash
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # For Connect webhooks (optional)

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

### 3. Set Up Clerk Billing

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Billing** → **Settings**
2. Click **Enable Billing**
3. Connect your Stripe account
4. Create subscription plans:

   **Plan 1: Free**
   - Plan ID: `free`
   - Price: $0/month
   - Features: Add custom features as needed

   **Plan 2: Vinyl Pro**
   - Plan ID: `vinyl_pro` (or match your Clerk plan ID)
   - Price: $9/month
   - Billing: Recurring monthly

   **Plan 3: Crate Digger**
   - Plan ID: `crate_digger` (or match your Clerk plan ID)
   - Price: $24/month
   - Billing: Recurring monthly

### 4. Set Up Stripe Connect

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Connect** → **Settings**
2. Enable **Connect**
3. Choose **Express** account type (recommended for marketplaces)
4. Configure onboarding settings

## 📋 How It Works

### Subscription Flow

1. User reaches Step 4 (Subscription Selection)
2. Clerk's `<PricingTable />` component displays available plans
3. User selects a plan (or stays on Free)
4. If premium plan selected, Clerk handles checkout
5. After payment, user returns to onboarding

### Stripe Connect Flow (Sellers/Both Only)

1. User reaches Step 5 (Stripe Connect)
2. Clicks "Connect Stripe Account" button
3. API creates Stripe Connect Express account
4. API generates onboarding link
5. User redirected to Stripe onboarding
6. After completion, Stripe redirects back to Step 6
7. System checks account status
8. If active, user can complete onboarding

### Collector Flow

- Collectors skip Step 5 (Stripe Connect)
- Automatically proceed from Step 4 to Step 6

## 🧪 Testing

### Local Testing

1. Use Stripe test mode keys
2. Use Clerk test mode
3. For Stripe Connect redirects, use ngrok:
   ```bash
   ngrok http 3000
   ```
   Update `NEXT_PUBLIC_APP_URL` to ngrok URL

### Test Accounts

- Use Stripe test accounts for Connect onboarding
- Test with different subscription tiers
- Verify feature gating works correctly

## 🚀 Next Steps

1. **Feature Gating** - Add subscription checks to:
   - Listing creation (limit based on tier)
   - Auction listings (Pro/Crate Digger only)
   - AI features (Pro/Crate Digger only)
   - Bulk tools (Crate Digger only)

2. **Webhook Handlers** - Create handlers for:
   - Clerk subscription events (upgrade/downgrade/cancel)
   - Stripe Connect account updates
   - Payment events

3. **Settings Page** - Add:
   - Subscription management
   - Stripe Connect account status
   - Re-onboarding link if needed

## 📝 Notes

- The subscription tier is stored in both Clerk (via Billing) and your database
- Stripe Connect account ID is stored in the database
- Onboarding status is tracked to prevent re-onboarding
- Collectors don't need Stripe Connect accounts
- The flow handles edge cases (returning from Stripe, refresh, etc.)

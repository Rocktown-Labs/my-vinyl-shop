# Subscription & Stripe Connect Implementation Summary

## ✅ Completed

1. **Database Schema Updated**
   - Added `stripeConnectAccountId` field
   - Added `stripeConnectOnboardingStatus` field
   - Added `stripeConnectOnboardingLink` field

2. **Stripe Connect API Routes Created**
   - `/api/stripe/connect/create-account` - Creates Stripe Connect Express account
   - `/api/stripe/connect/create-link` - Generates onboarding link
   - `/api/stripe/connect/status` - Checks account status

3. **Documentation Created**
   - `docs/SUBSCRIPTION_SETUP.md` - Complete setup guide
   - Subscription tiers defined (Free, Vinyl Pro $9/mo, Crate Digger $24/mo)

## 🔄 Next Steps Required

### 1. Install Stripe Package

```bash
pnpm add stripe
```

### 2. Add Environment Variables

Add to `.env.local`:

```bash
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

### 3. Set Up Clerk Billing

1. Go to Clerk Dashboard → Billing → Settings
2. Enable Billing
3. Connect Stripe account
4. Create 3 plans:
   - `free` - $0/month
   - `vinyl_pro` - $9/month
   - `crate_digger` - $24/month

### 4. Update Onboarding Flow

The onboarding now has 6 steps:

1. Account Type (Collector/Seller/Both)
2. Profile Info
3. Location & Genres
4. **Subscription Selection** (NEW - using Clerk PricingTable)
5. **Stripe Connect Onboarding** (NEW - for Sellers/Both only)
6. Review & Complete

### 5. Update Onboarding Component

The component needs to be updated to:

- Import `PricingTable` from `@clerk/nextjs`
- Add subscription selection step (step 4)
- Add Stripe Connect onboarding step (step 5)
- Handle subscription selection
- Handle Stripe Connect account creation and onboarding

### 6. Update Onboarding Completion

The `/api/onboarding/complete` route needs to:

- Save subscription tier from Clerk
- Save Stripe Connect account ID if created
- Update onboarding status

## 📝 Code Changes Needed

### Onboarding Component Updates

- Add state for `selectedSubscription` and `stripeAccountId`
- Add step 4: Subscription selection with Clerk PricingTable
- Add step 5: Stripe Connect onboarding (conditional on accountType)
- Update step navigation logic
- Update completion handler

### API Route Updates

- Update `/api/onboarding/complete` to handle subscription and Stripe data
- Add subscription webhook handler for Clerk Billing events

### Feature Gating

- Add subscription checks in listing creation
- Limit listings based on subscription tier
- Restrict auction listings to Pro/Crate Digger
- Restrict AI features to Pro/Crate Digger

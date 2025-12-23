# Stripe Connect Optional Implementation

## ✅ Changes Made

### 1. Onboarding Flow Updated

- **Step 5 (Stripe Connect)** is now **optional**
- Added "Skip for now" button
- Users can complete onboarding without Stripe Connect
- Clear messaging that it's needed to create listings

### 2. Listing Creation Validation

- **API Routes Updated**:
  - `/api/vinyls` (POST) - Validates Stripe Connect before creating listed items
  - `/api/vinyls/[id]/list` (POST) - Validates Stripe Connect before listing items
- Returns `403 Forbidden` with helpful error message if Stripe Connect not active
- Error response includes `requiresStripeConnect: true` flag

### 3. Helper Function Created

- **`lib/stripe-connect.ts`** - `canUserListItems()` function
- Checks if user is a seller
- Verifies Stripe Connect account exists
- Verifies account status is "active"
- Returns helpful error messages

### 4. Listing Creation Page Enhanced

- **Banner displayed** if Stripe Connect not set up
- Shows orange warning banner with setup button
- Prevents form submission if Stripe Connect not active
- Checks status on page load

### 5. Settings Page Updated

- **Billing tab** now shows Stripe Connect status
- Shows setup prompt if not configured
- Shows active status if configured
- "Update" button to re-onboard if needed
- Real-time status checking

## 🔄 User Flow

### Onboarding

1. User completes steps 1-4
2. Reaches Step 5 (Stripe Connect)
3. **Option A**: Connects Stripe → Completes onboarding → Can list immediately
4. **Option B**: Skips → Completes onboarding → Can browse/buy, but cannot list

### Creating Listings

1. User goes to "Create Listing"
2. **If Stripe Connect not active**:
   - Banner appears at top
   - "Set up payments" button visible
   - Form submission blocked
3. **If Stripe Connect active**:
   - Normal listing creation flow
   - No restrictions

### Settings

1. User goes to Settings → Billing
2. **If not set up**: Shows setup prompt with button
3. **If set up**: Shows active status and update option

## 📋 API Responses

### Listing Creation Without Stripe Connect

```json
{
  "error": "Stripe Connect account not set up. Please complete payment setup in your settings.",
  "requiresStripeConnect": true,
  "stripeAccountId": null,
  "stripeStatus": null
}
```

### Listing Creation With Pending Account

```json
{
  "error": "Stripe Connect account is not active. Please complete the onboarding process.",
  "requiresStripeConnect": true,
  "stripeAccountId": "acct_...",
  "stripeStatus": "pending"
}
```

## 🎯 Benefits

1. **Faster Onboarding**: Users can complete onboarding without payment setup
2. **Better UX**: Clear messaging about when Stripe Connect is needed
3. **Flexible**: Users can set up payments when ready
4. **Secure**: Prevents listing creation without payment capability
5. **User-Friendly**: Easy to complete setup later in settings

## 🔐 Security

- All listing creation endpoints validate Stripe Connect status
- Server-side validation (can't be bypassed)
- Clear error messages guide users to setup
- Status checked in real-time

## 📝 Notes

- Collectors don't need Stripe Connect (they can't list anyway)
- Sellers/Both account types need it to create listings
- Users can browse and buy without Stripe Connect
- Settings page provides easy access to complete setup

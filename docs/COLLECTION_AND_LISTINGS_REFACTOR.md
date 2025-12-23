# Collection and Listings Refactor Summary

## ✅ Completed Changes

### 1. Collection vs Listings Clarification

- **Collections**: Records added to personal collection (not for sale)
  - Can be added without being a seller
  - No price required
  - All other data (title, artist, genre, condition, images, etc.) is stored
- **Listings**: Records listed for sale on the marketplace
  - Requires seller account + Stripe Connect
  - Requires price
  - Can be converted from collection items

### 2. New Components Created

- **`components/dashboard/collection-selector.tsx`**: Grid selector for choosing collection items
- **`components/dashboard/collection-grid.tsx`**: Reusable collection grid/list view
- **`components/dashboard/collection-form.tsx`**: Form for adding records to collection (no seller required)
- **`components/dashboard/profile-form.tsx`**: Profile form with Clerk/DB prefilling
- **`components/dashboard/feed-posts.tsx`**: Feed posts component using React Query

### 3. Pages Refactored

- **`app/dashboard/collection/page.tsx`**: Simplified, uses `CollectionGrid` component
- **`app/dashboard/collection/add/page.tsx`**: New page for adding to collection (no seller required)
- **`app/dashboard/listings/new/page.tsx`**: Added "source" step to choose between new listing or from collection
- **`app/dashboard/feed/page.tsx`**: Now uses `FeedPosts` component with real data
- **`app/dashboard/profile/page.tsx`**: Now uses `ProfileForm` with Clerk/DB prefilling

### 4. API Routes

- **`app/api/feed/route.ts`**: Returns feed posts (new listings from sellers)

### 5. Drizzle Migrations Setup

- **`drizzle.config.ts`**: Drizzle Kit configuration for SQLite/Turso
- **`package.json`**: Added scripts:
  - `db:generate` - Generate migrations from schema
  - `db:push` - Push schema changes directly
  - `db:studio` - Open Drizzle Studio

## 🔄 Key Features

### Collection Management

- Add records to collection without being a seller
- Easy conversion from collection to listing (just add price)
- Collection items retain all data except price
- Clear distinction between collection and listings

### Listing Creation Flow

1. **Source Step**: Choose "New Listing" or "From Collection"
2. **Type Step**: Select sealed/used (if new listing)
3. **Images Step**: Upload images
4. **Review Step**: Review and set price

### Profile Management

- Prefills from Clerk user data (name, username, avatar)
- Prefills from database (bio, location, etc.)
- Uses React Query for data fetching
- Optimistic updates ready

## 📋 Setup Instructions

### 1. Install Drizzle Kit

```bash
pnpm add -D drizzle-kit
```

### 2. Generate Migrations

```bash
pnpm db:generate
```

### 3. Apply Migrations

```bash
# Using Drizzle push (for development)
pnpm db:push

# Or using custom migration runner
pnpm db:migrate
```

## 🎯 Next Steps

1. **Complete New Listing Page**: Add missing `renderTypeStep`, `renderImagesStep`, and `renderReviewStep` functions
2. **Test Collection Flow**: Verify adding to collection works without seller account
3. **Test Conversion**: Verify converting collection item to listing works
4. **Populate Feed**: Ensure feed shows real data from listings

## 📝 Notes

- Collection items can be added by anyone (no seller requirement)
- Only listings require seller account + Stripe Connect
- The `useListVinyl` hook handles converting collection to listing
- Profile form uses `useCurrentUser` and `useUser` from Clerk for prefilling

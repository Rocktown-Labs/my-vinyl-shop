import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table - extends Clerk user data
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  username: text("username").unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  coverImageUrl: text("cover_image_url"),
  location: text("location"),
  country: text("country"),
  website: text("website"),
  instagramHandle: text("instagram_handle"),
  discogsUsername: text("discogs_username"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isSeller: integer("is_seller", { mode: "boolean" }).default(false),
  subscriptionTier: text("subscription_tier").default("free"), // free, pro, crate_digger
  shipsWorldwide: integer("ships_worldwide", { mode: "boolean" }).default(
    false
  ),
  specializedGenres: text("specialized_genres"), // JSON array
  onboardingCompleted: integer("onboarding_completed", {
    mode: "boolean",
  }).default(false),
  // Stripe Connect fields
  stripeConnectAccountId: text("stripe_connect_account_id"),
  stripeConnectOnboardingStatus: text("stripe_connect_onboarding_status"), // pending, active, restricted
  stripeConnectOnboardingLink: text("stripe_connect_onboarding_link"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Vinyl records - can be collection items or listings
export const vinyls = sqliteTable("vinyls", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  genre: text("genre").notNull(),
  year: integer("year"),
  label: text("label"),
  catalogNumber: text("catalog_number"),
  description: text("description"),
  condition: text("condition").notNull(), // sealed, mint, near_mint, very_good_plus, very_good, good, fair, poor
  sleeveCondition: text("sleeve_condition"),
  vinylCondition: text("vinyl_condition"),
  type: text("type").notNull().default("used"), // new, used

  // Images stored as JSON array of blob URLs
  images: text("images"), // JSON array: [{type: 'front_cover', url: '...'}, ...]

  // Listing vs Collection
  isListed: integer("is_listed", { mode: "boolean" }).default(false),
  isInCollection: integer("is_in_collection", { mode: "boolean" }).default(
    true
  ),

  // Pricing (only relevant if isListed)
  price: real("price"),
  listingType: text("listing_type").default("fixed"), // fixed, auction
  startingBid: real("starting_bid"),
  reservePrice: real("reserve_price"),
  buyNowPrice: real("buy_now_price"),
  auctionEndDate: integer("auction_end_date", { mode: "timestamp" }),

  // Stock
  quantity: integer("quantity").default(1),

  // AI-generated data
  aiSuggestedPrice: real("ai_suggested_price"),
  aiConditionNotes: text("ai_condition_notes"),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Orders
export const orders = sqliteTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => users.id),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id),
  vinylId: text("vinyl_id")
    .notNull()
    .references(() => vinyls.id),
  quantity: integer("quantity").notNull().default(1),
  totalAmount: real("total_amount").notNull(),
  shippingAmount: real("shipping_amount").default(0),
  status: text("status").notNull().default("pending"), // pending, paid, shipped, delivered, cancelled
  shippingAddress: text("shipping_address"), // JSON
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Follows
export const follows = sqliteTable("follows", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  followerId: text("follower_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  followingId: text("following_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Messages
export const conversations = sqliteTable("conversations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  participant1Id: text("participant1_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  participant2Id: text("participant2_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").references(() => orders.id), // Optional - for order-related conversations
  vinylId: text("vinyl_id").references(() => vinyls.id), // Optional - for product inquiries
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const messages = sqliteTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Auction bids
export const bids = sqliteTable("bids", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vinylId: text("vinyl_id")
    .notNull()
    .references(() => vinyls.id, { onDelete: "cascade" }),
  bidderId: text("bidder_id")
    .notNull()
    .references(() => users.id),
  amount: real("amount").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Notifications
export const notifications = sqliteTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // order, message, follow, bid, price_drop
  title: text("title").notNull(),
  message: text("message").notNull(),
  linkUrl: text("link_url"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  metadata: text("metadata"), // JSON for additional data
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vinyls: many(vinyls),
  orders: many(orders, { relationName: "buyer" }),
  sales: many(orders, { relationName: "seller" }),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "follower" }),
  notifications: many(notifications),
}));

export const vinylsRelations = relations(vinyls, ({ one, many }) => ({
  user: one(users, { fields: [vinyls.userId], references: [users.id] }),
  bids: many(bids),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  vinyl: one(vinyls, { fields: [orders.vinylId], references: [vinyls.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    participant1: one(users, {
      fields: [conversations.participant1Id],
      references: [users.id],
    }),
    participant2: one(users, {
      fields: [conversations.participant2Id],
      references: [users.id],
    }),
    messages: many(messages),
    order: one(orders, {
      fields: [conversations.orderId],
      references: [orders.id],
    }),
    vinyl: one(vinyls, {
      fields: [conversations.vinylId],
      references: [vinyls.id],
    }),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  vinyl: one(vinyls, { fields: [bids.vinylId], references: [vinyls.id] }),
  bidder: one(users, { fields: [bids.bidderId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Vinyl = typeof vinyls.$inferSelect;
export type NewVinyl = typeof vinyls.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Follow = typeof follows.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Bid = typeof bids.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

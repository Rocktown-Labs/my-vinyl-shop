module.exports = [
"[externals]/@libsql/client [external] (@libsql/client, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@libsql/client");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bids",
    ()=>bids,
    "bidsRelations",
    ()=>bidsRelations,
    "conversations",
    ()=>conversations,
    "conversationsRelations",
    ()=>conversationsRelations,
    "follows",
    ()=>follows,
    "followsRelations",
    ()=>followsRelations,
    "messages",
    ()=>messages,
    "messagesRelations",
    ()=>messagesRelations,
    "notifications",
    ()=>notifications,
    "notificationsRelations",
    ()=>notificationsRelations,
    "orders",
    ()=>orders,
    "ordersRelations",
    ()=>ordersRelations,
    "users",
    ()=>users,
    "usersRelations",
    ()=>usersRelations,
    "vinyls",
    ()=>vinyls,
    "vinylsRelations",
    ()=>vinylsRelations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/sqlite-core/table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/sqlite-core/columns/text.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/sqlite-core/columns/integer.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/sqlite-core/columns/real.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/relations.js [app-rsc] (ecmascript)");
;
;
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("users", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey(),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("email").notNull(),
    username: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("username").unique(),
    displayName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("display_name"),
    bio: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("bio"),
    avatarUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("avatar_url"),
    coverImageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("cover_image_url"),
    location: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("location"),
    country: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("country"),
    website: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("website"),
    instagramHandle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("instagram_handle"),
    discogsUsername: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("discogs_username"),
    isVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("is_verified", {
        mode: "boolean"
    }).default(false),
    isSeller: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("is_seller", {
        mode: "boolean"
    }).default(false),
    subscriptionTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("subscription_tier").default("free"),
    shipsWorldwide: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("ships_worldwide", {
        mode: "boolean"
    }).default(false),
    specializedGenres: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("specialized_genres"),
    onboardingCompleted: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("onboarding_completed", {
        mode: "boolean"
    }).default(false),
    // Stripe Connect fields
    stripeConnectAccountId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("stripe_connect_account_id"),
    stripeConnectOnboardingStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("stripe_connect_onboarding_status"),
    stripeConnectOnboardingLink: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("stripe_connect_onboarding_link"),
    // Username change tracking (30-day cooldown)
    lastUsernameChangeAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("last_username_change_at", {
        mode: "timestamp"
    }),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date()),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("updated_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const vinyls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("vinyls", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("title").notNull(),
    artist: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("artist").notNull(),
    genre: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("genre").notNull(),
    year: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("year"),
    label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("label"),
    catalogNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("catalog_number"),
    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("description"),
    condition: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("condition").notNull(),
    sleeveCondition: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("sleeve_condition"),
    vinylCondition: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("vinyl_condition"),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("type").notNull().default("used"),
    // Images stored as JSON array of blob URLs
    images: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("images"),
    // Listing vs Collection
    isListed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("is_listed", {
        mode: "boolean"
    }).default(false),
    isInCollection: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("is_in_collection", {
        mode: "boolean"
    }).default(true),
    // Pricing (only relevant if isListed)
    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("price"),
    listingType: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("listing_type").default("fixed"),
    startingBid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("starting_bid"),
    reservePrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("reserve_price"),
    buyNowPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("buy_now_price"),
    auctionEndDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("auction_end_date", {
        mode: "timestamp"
    }),
    // Stock
    quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("quantity").default(1),
    // AI-generated data
    aiSuggestedPrice: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("ai_suggested_price"),
    aiConditionNotes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("ai_condition_notes"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date()),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("updated_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const orders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("orders", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    buyerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("buyer_id").notNull().references(()=>users.id),
    sellerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("seller_id").notNull().references(()=>users.id),
    vinylId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("vinyl_id").notNull().references(()=>vinyls.id),
    quantity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("quantity").notNull().default(1),
    totalAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("total_amount").notNull(),
    shippingAmount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("shipping_amount").default(0),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("pending"),
    shippingAddress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("shipping_address"),
    trackingNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("tracking_number"),
    notes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("notes"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date()),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("updated_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const follows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("follows", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    followerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("follower_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    followingId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("following_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const conversations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("conversations", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    participant1Id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("participant1_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    participant2Id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("participant2_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("order_id").references(()=>orders.id),
    vinylId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("vinyl_id").references(()=>vinyls.id),
    lastMessageAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("last_message_at", {
        mode: "timestamp"
    }),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const messages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("messages", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    conversationId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("conversation_id").notNull().references(()=>conversations.id, {
        onDelete: "cascade"
    }),
    senderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("sender_id").notNull().references(()=>users.id),
    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("content").notNull(),
    isRead: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("is_read", {
        mode: "boolean"
    }).default(false),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const bids = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("bids", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    vinylId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("vinyl_id").notNull().references(()=>vinyls.id, {
        onDelete: "cascade"
    }),
    bidderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("bidder_id").notNull().references(()=>users.id),
    amount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["real"])("amount").notNull(),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const notifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sqliteTable"])("notifications", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("id").primaryKey().$defaultFn(()=>crypto.randomUUID()),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("user_id").notNull().references(()=>users.id, {
        onDelete: "cascade"
    }),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("type").notNull(),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("title").notNull(),
    message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("message").notNull(),
    linkUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("link_url"),
    isRead: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("is_read", {
        mode: "boolean"
    }).default(false),
    metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("metadata"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])("created_at", {
        mode: "timestamp"
    }).$defaultFn(()=>new Date())
});
const usersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(users, ({ many })=>({
        vinyls: many(vinyls),
        orders: many(orders, {
            relationName: "buyer"
        }),
        sales: many(orders, {
            relationName: "seller"
        }),
        followers: many(follows, {
            relationName: "following"
        }),
        following: many(follows, {
            relationName: "follower"
        }),
        notifications: many(notifications)
    }));
const vinylsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(vinyls, ({ one, many })=>({
        user: one(users, {
            fields: [
                vinyls.userId
            ],
            references: [
                users.id
            ]
        }),
        bids: many(bids)
    }));
const ordersRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(orders, ({ one })=>({
        buyer: one(users, {
            fields: [
                orders.buyerId
            ],
            references: [
                users.id
            ],
            relationName: "buyer"
        }),
        seller: one(users, {
            fields: [
                orders.sellerId
            ],
            references: [
                users.id
            ],
            relationName: "seller"
        }),
        vinyl: one(vinyls, {
            fields: [
                orders.vinylId
            ],
            references: [
                vinyls.id
            ]
        })
    }));
const followsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(follows, ({ one })=>({
        follower: one(users, {
            fields: [
                follows.followerId
            ],
            references: [
                users.id
            ],
            relationName: "follower"
        }),
        following: one(users, {
            fields: [
                follows.followingId
            ],
            references: [
                users.id
            ],
            relationName: "following"
        })
    }));
const conversationsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(conversations, ({ one, many })=>({
        participant1: one(users, {
            fields: [
                conversations.participant1Id
            ],
            references: [
                users.id
            ]
        }),
        participant2: one(users, {
            fields: [
                conversations.participant2Id
            ],
            references: [
                users.id
            ]
        }),
        messages: many(messages),
        order: one(orders, {
            fields: [
                conversations.orderId
            ],
            references: [
                orders.id
            ]
        }),
        vinyl: one(vinyls, {
            fields: [
                conversations.vinylId
            ],
            references: [
                vinyls.id
            ]
        })
    }));
const messagesRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(messages, ({ one })=>({
        conversation: one(conversations, {
            fields: [
                messages.conversationId
            ],
            references: [
                conversations.id
            ]
        }),
        sender: one(users, {
            fields: [
                messages.senderId
            ],
            references: [
                users.id
            ]
        })
    }));
const bidsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(bids, ({ one })=>({
        vinyl: one(vinyls, {
            fields: [
                bids.vinylId
            ],
            references: [
                vinyls.id
            ]
        }),
        bidder: one(users, {
            fields: [
                bids.bidderId
            ],
            references: [
                users.id
            ]
        })
    }));
const notificationsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relations"])(notifications, ({ one })=>({
        user: one(users, {
            fields: [
                notifications.userId
            ],
            references: [
                users.id
            ]
        })
    }));
}),
"[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$libsql$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/libsql/driver.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@libsql/client [external] (@libsql/client, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/schema.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$libsql$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$libsql$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const client = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$29$__["createClient"])({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$libsql$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["drizzle"])(client, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
});
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/stripe-connect.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "canUserListItems",
    ()=>canUserListItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/drizzle-orm@0.45.1_dcb8b4d537a66667cbe5a569fd150f72/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function canUserListItems(userId) {
    try {
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].query.users.findFirst({
            where: (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$45$2e$1_dcb8b4d537a66667cbe5a569fd150f72$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["users"].id, userId)
        });
        if (!user) {
            return {
                canList: false,
                reason: "User not found"
            };
        }
        // Collectors don't need Stripe Connect
        if (!user.isSeller) {
            return {
                canList: false,
                reason: "Only sellers can create listings"
            };
        }
        // Check if Stripe Connect is set up and active
        if (!user.stripeConnectAccountId) {
            return {
                canList: false,
                reason: "Stripe Connect account not set up. Please complete payment setup in your settings."
            };
        }
        if (user.stripeConnectOnboardingStatus !== "active") {
            return {
                canList: false,
                reason: "Stripe Connect account is not active. Please complete the onboarding process.",
                accountId: user.stripeConnectAccountId,
                status: user.stripeConnectOnboardingStatus || "pending"
            };
        }
        return {
            canList: true,
            accountId: user.stripeConnectAccountId,
            status: "active"
        };
    } catch (error) {
        console.error("Error checking user listing capability:", error);
        return {
            canList: false,
            reason: "Error checking account status"
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/actions/vinyls.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"603bc1af96de957355e21be10247b73a3bb41e99a1":"createVinyl"},"",""] */ __turbopack_context__.s([
    "createVinyl",
    ()=>createVinyl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-react-compiler@1._ae3e58926edfd4e7bb18b6bd40329e1e/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_570422557b5de1dffb12a93f3aa74b9c$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/@clerk+nextjs@6.36.5_next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plu_570422557b5de1dffb12a93f3aa74b9c/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/db/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-react-compiler@1._ae3e58926edfd4e7bb18b6bd40329e1e/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$stripe$2d$connect$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/stripe-connect.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-react-compiler@1._ae3e58926edfd4e7bb18b6bd40329e1e/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$stripe$2d$connect$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$stripe$2d$connect$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function createVinyl(prevState, formData) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_570422557b5de1dffb12a93f3aa74b9c$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return {
                error: "Unauthorized"
            };
        }
        const isListed = formData.get("isListed") === "true";
        // Check if user can create listings (Stripe Connect validation)
        if (isListed) {
            const listingCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$stripe$2d$connect$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["canUserListItems"])(userId);
            if (!listingCheck.canList) {
                return {
                    error: listingCheck.reason || "Cannot create listing",
                    requiresStripeConnect: true
                };
            }
        }
        const [newVinyl] = await __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["vinyls"]).values({
            userId,
            title: formData.get("title"),
            artist: formData.get("artist"),
            genre: formData.get("genre"),
            year: formData.get("year") ? Number.parseInt(formData.get("year")) : null,
            label: formData.get("label") || null,
            catalogNumber: formData.get("catalogNumber") || null,
            description: formData.get("description") || null,
            condition: formData.get("condition"),
            sleeveCondition: formData.get("sleeveCondition") || null,
            vinylCondition: formData.get("vinylCondition") || null,
            type: formData.get("type") || "used",
            images: formData.get("images") ? JSON.stringify(JSON.parse(formData.get("images"))) : null,
            isListed: isListed,
            isInCollection: formData.get("isInCollection") === "true",
            price: formData.get("price") ? Number.parseFloat(formData.get("price")) : null,
            listingType: formData.get("listingType") || "fixed",
            startingBid: formData.get("startingBid") ? Number.parseFloat(formData.get("startingBid")) : null,
            reservePrice: formData.get("reservePrice") ? Number.parseFloat(formData.get("reservePrice")) : null,
            buyNowPrice: formData.get("buyNowPrice") ? Number.parseFloat(formData.get("buyNowPrice")) : null,
            quantity: formData.get("quantity") ? Number.parseInt(formData.get("quantity")) : 1,
            aiSuggestedPrice: formData.get("aiSuggestedPrice") ? Number.parseFloat(formData.get("aiSuggestedPrice")) : null,
            aiConditionNotes: formData.get("aiConditionNotes") || null,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/listings");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/collection");
        return {
            success: true,
            vinyl: newVinyl
        };
    } catch (error) {
        console.error("Error creating vinyl:", error);
        return {
            error: "Failed to create vinyl"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createVinyl
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createVinyl, "603bc1af96de957355e21be10247b73a3bb41e99a1", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6c4ab651._.js.map
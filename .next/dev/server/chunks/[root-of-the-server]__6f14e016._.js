module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/redis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aiRatelimit",
    ()=>aiRatelimit,
    "apiRatelimit",
    ()=>apiRatelimit,
    "deleteOnboardingProgress",
    ()=>deleteOnboardingProgress,
    "getOnboardingProgress",
    ()=>getOnboardingProgress,
    "getRedis",
    ()=>getRedis,
    "saveOnboardingProgress",
    ()=>saveOnboardingProgress,
    "uploadRatelimit",
    ()=>uploadRatelimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/@upstash+redis@1.35.8/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$ratelimit$40$2$2e$0$2e$7_$40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/@upstash+ratelimit@2.0.7_@upstash+redis@1.35.8/node_modules/@upstash/ratelimit/dist/index.js [app-route] (ecmascript)");
;
;
// Initialize Redis only if environment variables are available
let redis = null;
let redisInitialized = false;
function getRedis() {
    if (redisInitialized) {
        return redis;
    }
    redisInitialized = true;
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
        console.warn("Redis not configured. KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) are required.");
        return null;
    }
    try {
        redis = new __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"]({
            url,
            token
        });
        return redis;
    } catch (error) {
        console.error("Failed to initialize Redis:", error);
        return null;
    }
}
;
// Rate limiters - only initialize if Redis is available
function createRatelimit(limiter, prefix) {
    const redisInstance = getRedis();
    if (!redisInstance) {
        // Return a no-op rate limiter if Redis isn't available
        return {
            limit: async ()=>({
                    success: true,
                    limit: 0,
                    remaining: 0,
                    reset: 0
                })
        };
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$ratelimit$40$2$2e$0$2e$7_$40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Ratelimit"]({
        redis: redisInstance,
        limiter,
        analytics: true,
        prefix
    });
}
const apiRatelimit = createRatelimit(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$ratelimit$40$2$2e$0$2e$7_$40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Ratelimit"].slidingWindow(100, "1 m"), "ratelimit:api");
const uploadRatelimit = createRatelimit(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$ratelimit$40$2$2e$0$2e$7_$40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Ratelimit"].slidingWindow(10, "1 m"), "ratelimit:upload");
const aiRatelimit = createRatelimit(__TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$upstash$2b$ratelimit$40$2$2e$0$2e$7_$40$upstash$2b$redis$40$1$2e$35$2e$8$2f$node_modules$2f40$upstash$2f$ratelimit$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Ratelimit"].slidingWindow(5, "1 m"), "ratelimit:ai");
async function getOnboardingProgress(userId) {
    const redisInstance = getRedis();
    if (!redisInstance) {
        console.warn("Redis not available, returning null for onboarding progress");
        return null;
    }
    try {
        const progress = await redisInstance.get(`onboarding:${userId}`);
        return progress;
    } catch (error) {
        console.error("Error getting onboarding progress:", error);
        return null;
    }
}
async function saveOnboardingProgress(userId, progress) {
    const redisInstance = getRedis();
    if (!redisInstance) {
        console.warn("Redis not available, skipping save of onboarding progress");
        return;
    }
    try {
        const existing = await getOnboardingProgress(userId);
        const updated = {
            currentStep: progress.currentStep ?? existing?.currentStep ?? 1,
            completedSteps: progress.completedSteps ?? existing?.completedSteps ?? [],
            data: {
                ...existing?.data,
                ...progress.data
            },
            startedAt: existing?.startedAt ?? new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString()
        };
        // Expire after 7 days
        await redisInstance.setex(`onboarding:${userId}`, 60 * 60 * 24 * 7, updated);
    } catch (error) {
        console.error("Error saving onboarding progress:", error);
    // Don't throw - allow onboarding to continue even if Redis fails
    }
}
async function deleteOnboardingProgress(userId) {
    const redisInstance = getRedis();
    if (!redisInstance) {
        console.warn("Redis not available, skipping delete of onboarding progress");
        return;
    }
    try {
        await redisInstance.del(`onboarding:${userId}`);
    } catch (error) {
        console.error("Error deleting onboarding progress:", error);
    // Don't throw - allow onboarding to continue even if Redis fails
    }
}
}),
"[project]/dev/RocktownLabs/projects/my-vinyl-shop/app/api/onboarding/progress/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_570422557b5de1dffb12a93f3aa74b9c$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/@clerk+nextjs@6.36.5_next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plu_570422557b5de1dffb12a93f3aa74b9c/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_@opentelemetry+api@1.9.0_babel-plugin-react-compiler@1._ae3e58926edfd4e7bb18b6bd40329e1e/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dev/RocktownLabs/projects/my-vinyl-shop/lib/redis.ts [app-route] (ecmascript)");
;
;
;
const dynamic = "force-dynamic";
const runtime = "nodejs";
async function GET() {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_570422557b5de1dffb12a93f3aa74b9c$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const progress = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOnboardingProgress"])(userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            progress
        });
    } catch (error) {
        console.error("Error getting onboarding progress:", error);
        // Return empty progress instead of error to allow onboarding to continue
        return __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            progress: null
        });
    }
}
async function POST(request) {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$36$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plu_570422557b5de1dffb12a93f3aa74b9c$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveOnboardingProgress"])(userId, body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error("Error saving onboarding progress:", error);
        // Still return success since Redis failures shouldn't block onboarding
        return __TURBOPACK__imported__module__$5b$project$5d2f$dev$2f$RocktownLabs$2f$projects$2f$my$2d$vinyl$2d$shop$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_babel$2d$plugin$2d$react$2d$compiler$40$1$2e$_ae3e58926edfd4e7bb18b6bd40329e1e$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6f14e016._.js.map
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

const isPublicRoute = createRouteMatcher([
  "/",
  "/browse(.*)",
  "/product/(.*)",
  "/seller/(.*)",
  "/sellers(.*)",
  "/auth/(.*)",
  "/api/webhooks/(.*)",
  "/api/search(.*)",
  "/api/onboarding/(.*)", // Allow onboarding API routes
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Always allow API routes for authenticated users (they handle their own auth)
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // If not signed in and trying to access protected route, redirect to sign in
  if (!userId) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check if user has completed onboarding
  // First check session claims (fastest)
  let onboardingComplete = sessionClaims?.metadata?.onboardingComplete;

  // If not in session claims, check database as fallback
  if (onboardingComplete === undefined) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { onboardingCompleted: true },
      });
      onboardingComplete = user?.onboardingCompleted || false;
    } catch (error) {
      // If database check fails, default to false (require onboarding)
      console.warn("Failed to check onboarding status in database:", error);
      onboardingComplete = false;
    }
  }

  // If onboarding not complete and not on onboarding route, redirect to onboarding
  if (!onboardingComplete && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // If onboarding complete and on onboarding route, redirect to dashboard
  if (onboardingComplete && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/browse(.*)",
  "/product/(.*)",
  "/seller/(.*)",
  "/sellers(.*)",
  "/auth/(.*)",
  "/api/webhooks/(.*)",
  "/api/search(.*)",
])

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // If not signed in and trying to access protected route, redirect to sign in
  if (!userId) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Check if user has completed onboarding
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete

  // If onboarding not complete and not on onboarding route, redirect to onboarding
  if (!onboardingComplete && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  // If onboarding complete and on onboarding route, redirect to dashboard
  if (onboardingComplete && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

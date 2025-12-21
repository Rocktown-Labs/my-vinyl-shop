import { SignIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <div className="flex-1 flex">
        {/* Left side - Clerk SignIn */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <Link href="/" className="flex items-center mb-8">
                <Image
                  src="/my-vinyl-shop-logo.svg"
                  alt="my-vinyl.shop"
                  width={160}
                  height={64}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent w-full",
                  headerTitle: "text-2xl sm:text-3xl font-bold tracking-tight",
                  headerSubtitle: "text-muted-foreground",
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-medium",
                  formFieldInput: "h-12 rounded-xl px-4 border-input",
                  footerActionLink: "text-foreground font-medium hover:underline",
                  socialButtonsBlockButton: "h-12 rounded-xl font-medium border-input hover:bg-accent",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground text-xs uppercase tracking-wider",
                },
              }}
              routing="path"
              path="/auth/signin"
              signUpUrl="/auth/signup"
              forceRedirectUrl="/onboarding"
            />
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="hidden lg:flex flex-1 bg-foreground items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/generated-20image-20december-2019-2c-202025-20-207-03pm.jpeg')] bg-cover bg-center opacity-30" />
          <div className="relative z-10 max-w-md text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-background mb-4 tracking-tight">
              Your vinyl collection awaits
            </h2>
            <p className="text-background/70 text-lg leading-relaxed">
              Join thousands of collectors buying and selling rare records on the world&apos;s most thoughtful vinyl
              marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

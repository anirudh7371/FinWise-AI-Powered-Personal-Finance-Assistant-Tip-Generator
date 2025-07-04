import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Create Arcjet middleware
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"], // Track based on Clerk userId when available
  rules: [
    // Shield protection for content and security
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "GO_HTTP", // For Inngest
        "CATEGORY:MONITOR", // Monitoring services
        // See the full list at https://arcjet.com/bot-list
      ],
    }),
  ],
});

// Create Clerk middleware
const clerk = clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    
    if (!userId && isProtectedRoute(req)) {
      const { redirectToSignIn } = await auth();
      return redirectToSignIn();
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Clerk middleware error:", error);
    return NextResponse.next();
  }
});

// Alternative approach: Manual chaining instead of createMiddleware
export default async function middleware(request) {
  try {
    // First, run Arcjet protection
    const decision = await aj.protect(request);
    
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 }
      );
    }
    
    // Then run Clerk authentication
    return clerk(request);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

// If you prefer to use createMiddleware (check Arcjet docs for compatibility)
// export default createMiddleware(aj, clerk);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
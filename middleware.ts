import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { defaultLocale, locales } from "./constant"

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
})

const authMiddleware = withAuth(
  async (req) => {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    return intlMiddleware(req)
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export default function middleware(req: NextRequest) {
  const excludePattern =
    "^(/(" + locales.join("|") + "))?/(dashboard|editor)/?.*?$"
  const publicPathnameRegex = RegExp(excludePattern, "i")
  const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname)
  const response = NextResponse.next();
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours
    // return  new NextResponse(null, { headers: response.headers });
    return new NextResponse(null, { headers: response.headers });
  }

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.nextUrl.pathname?.includes("/api/")) {
    return response
  }

  if (isPublicPage) {
    return intlMiddleware(req)
  } else {
    return (authMiddleware as any)(req)
  }
}

export const config = {
  matcher: [
    '/((?!_next.*\\..*).*)',
  ],
}

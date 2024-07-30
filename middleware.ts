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

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Origin': '*'
}

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname?.includes("/api/")) {
    // Handle preflighted requests
    const isPreflight = req.method === 'OPTIONS'

    if (isPreflight) {
      return NextResponse.json({}, { headers: corsOptions })
    }

    // Handle simple requests
    const response = NextResponse.next()
    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  const excludePattern = "^(/(" + locales.join("|") + "))?/(dashboard|editor|mobile)/?.*?$"
  const publicPathnameRegex = RegExp(excludePattern, "i")
  const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname)

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

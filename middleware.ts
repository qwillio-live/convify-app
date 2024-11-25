import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import createMiddleware from "next-intl/middleware"

import { defaultLocale, locales } from "./constant"
import next from "next/types"

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
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname === "/"
    if (isAuthPage && isAuth) {
      // Redirect to dashboard if user is authenticated and trying to access auth pages
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (!isAuth) {
      // Redirect to login page if the user is not authenticated and trying to access protected pages
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // Proceed with internationalization middleware
    return intlMiddleware(req)
  },
  {
    callbacks: {
      async authorized() {
        // Return true to ensure middleware function is always called
        return true
      },
    },
  }
)

export default async function middleware(req: NextRequest) {
  const excludePattern =
    "^(/(" +
    locales.join("|") +
    "))?/(dashboard|editor|mobile|select-template)/?.*?$"
  const publicPathnameRegex = RegExp(excludePattern, "i")
  const isPublicPage =
    !publicPathnameRegex.test(req.nextUrl.pathname) &&
    req.nextUrl.pathname !== "/"

  const token = await getToken({ req })
  const isPreviewPage = req.nextUrl.pathname.includes("cron-preview")
  console.log("ispublicpage", isPublicPage, token)
  if (isPreviewPage) {
    // Allow preview page without authentication
    console.log("Preview page accessed without authentication")
    return intlMiddleware(req)
  }

  if (isPublicPage && !token) {
    // Use internationalization middleware for public pages
    return intlMiddleware(req)
  } else {
    // For other pages, apply authentication middleware
    return (authMiddleware as any)(req)
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

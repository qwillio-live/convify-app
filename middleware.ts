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
    "^(/(" + locales.join("|") + "))?/(dashboard|editor|mobile)/?.*?$"
  const publicPathnameRegex = RegExp(excludePattern, "i")
  const isPublicPage = !publicPathnameRegex.test(req.nextUrl.pathname)
  console.log("isPublicPage", isPublicPage)
  const token = await getToken({ req })
  if (isPublicPage && !token) {
    return intlMiddleware(req)
  } else {
    return (authMiddleware as any)(req)
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

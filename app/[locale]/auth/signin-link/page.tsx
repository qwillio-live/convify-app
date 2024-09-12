"use client"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { env } from "@/env.mjs"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import { Loader } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "next-auth/react"
import { useAppSelector } from "@/lib/state/flows-state/hooks"

export default function IndexPage() {
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")
  const router = useRouter()
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  useEffect(() => {
    async function verifyLink() {
      const request = await fetch(`/api/authorise/signin-link?token=${token}`, {
        method: "GET",
      })
      if (!request.ok) {
        router.push("/login")
      }
      const body = await request.json()
      console.log("body", body)
      const signInResult = await signIn("credentials", {
        username: body.email,
        isFromApi: false,
        callbackUrl: "/dashboard",
      })
    }
    verifyLink()
  }, [])
  console.log("token", token)
  return (
    <div className="flex h-[100vh] w-full flex-row items-center justify-center">
      <div
        className="loader absolute flex h-28 w-28 animate-spin items-center justify-center rounded-full border-2 border-t-2 border-transparent"
        style={{ borderTopColor: primaryColor }}
      />
    </div>
  )
}

import { Metadata } from "next"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user-auth-form"
import convifyLogo from "@/assets/convify_logo_black.svg"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { env } from "@/env.mjs"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const APP_NAME = process.env.APP_NAME
  const t = await getTranslations("Components") // Fetch translations

  return {
    title: `${t("Log in")} | ${APP_NAME}`, // Use translations for title
    description: t("Login to your account"),
  }
}
export default function LoginPage() {
  const t = useTranslations("Login")

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex justify-center">
          <img
            src={convifyLogo.src}
            alt="Convify Logo"
            className="w-10"
            style={{ width: "7rem" }}
          />
        </div>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("Welcome back")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("Enter your email to sign in to your account")}
          </p>
        </div>
        <UserAuthForm />
        <p className="text-muted-foreground px-8 text-center text-sm">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            {t("Don't have an account? Sign Up")}
          </Link>
        </p>
      </div>
    </div>
  )
}

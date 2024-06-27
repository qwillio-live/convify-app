import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserRegForm } from "@/components/user-reg-form"
import signupImage from "@/assets/images/signup.svg"
import convifyLogo from "@/assets/convify_logo_black.svg"
import { useTranslations } from "next-intl"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  const t = useTranslations("SignUp")
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className="bg-muted hidden h-full flex-col items-center justify-center p-8 lg:flex"
        style={{
          backgroundColor: "#0F172A",
        }}
      >
        <img src={signupImage.src} alt="Signup" className="h-auto max-w-full" />
        <p
          className="font-600 text-md text-muted-foreground text-center"
          style={{ position: "absolute", bottom: 50, color: "white" }}
        >
          © Convify
        </p>
      </div>
      <div className="absolute right-4 top-3 flex md:right-6 md:top-3">
        <p className="mr-2 mt-1" style={{ fontSize: "0.8rem" }}>
          {t("Already have an account?")}
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "md" }),
            "h-7"
          )}
          style={{ borderColor: "black", fontSize: "0.7rem" }}
        >
          {t("Login")}
        </Link>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="mb-2 flex flex-col justify-center text-center">
            <div className="flex justify-center">
              <img
                src={convifyLogo.src}
                alt="Convify Logo"
                className="mb-5"
                style={{ width: "8rem" }}
              />
            </div>
            <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">
              {t("Get started for free")}
            </h1>
            <p className="font-600 text-md text-muted-foreground mt-2 text-center">
              {t("Get started its free No credit card needed")}
            </p>
          </div>

          <UserRegForm />
        </div>
      </div>
    </div>
  )
}

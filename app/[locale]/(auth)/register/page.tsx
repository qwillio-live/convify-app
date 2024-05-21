import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserRegForm } from "@/components/user-reg-form"
import signupImage from "@/assets/images/signup.svg"
import convifyBlue from "@/assets/images/convify_logo_icon.svg"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className="hidden h-full flex-col items-center justify-center bg-muted p-8 lg:flex"
        style={{
          backgroundColor: "#0F172A",
        }}
      >
        <img src={signupImage.src} alt="Signup" className="h-auto max-w-full" />
        <img src={convifyBlue.src} alt="Convify Logo" className="w-15" />
        <p
          className="font-600 text-md text-center text-muted-foreground"
          style={{ position: "absolute", bottom: 50, color: "white" }}
        >
          © Convify
        </p>
      </div>
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
        style={{ borderColor: "black" }}
      >
        Log in
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="mb-2 flex flex-col justify-center text-center">
            <div className="flex justify-center">
              <img
                src={convifyBlue.src}
                alt="Convify Logo"
                className="mb-7 w-10"
              />
            </div>
            <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">
              Get started for free
            </h1>
            <p className="font-600 text-md mt-2 text-center text-muted-foreground">
              Get started – it’s free. No credit card needed
            </p>
          </div>

          <UserRegForm />
        </div>
      </div>
    </div>
  )
}

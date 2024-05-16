import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserRegForm } from "@/components/user-reg-form"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-row justify-center text-center">
            <Icons.logo className="mr-2 size-8" />
            <h1 className="text-2xl font-semibold tracking-tight">Convify</h1>
          </div>
          <p className="font-600 text-center text-xl text-muted-foreground">
            Welcome to Convify. Dirty up your hands
          </p>
          <UserRegForm />
        </div>
      </div>
    </div>
  )
}

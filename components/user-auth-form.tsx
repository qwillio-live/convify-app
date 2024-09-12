"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userSignInSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslations } from "next-intl"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userSignInSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(userSignInSchema),
  })
  const t = useTranslations("Login")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const [error, setError] = React.useState<string | null>(
    searchParams?.get("error") ?? null
  )

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      sessionStorage.removeItem("userFormData")
    }
  }, [error])

  const [formData, setFormData] = React.useState<{
    email: string
    password: string
  }>({
    email: "",
    password: "",
  })

  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android|iphone|ipad|ipod/i.test(userAgent)) {
      setIsMobile(true)
    }
  }, [])

  React.useEffect(() => {
    const storedFormData = sessionStorage.getItem("userFormData")
    if (storedFormData) {
      const { email, password } = JSON.parse(storedFormData)
      setFormData({ email, password })
      setValue("email", email)
      setValue("password", password)
    }
  }, [])

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    sessionStorage.setItem("userFormData", JSON.stringify(data))

    const signInResult = await signIn("credentials", {
      username: data.email,
      password: data.password,
      isFromApi: false,
      callbackUrl: "/dashboard",
    })

    setIsLoading(false)
    if (!signInResult?.ok) {
      toast({
        title: t("Something went wrong"),
        description: t("Your sign in request failed. Please try again."),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("Login Successful"),
      description: "You are being redirected...",
    })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("Email")}
            </Label>
            <Input
              id="email"
              placeholder={t("Email")}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
            <Label className="sr-only" htmlFor="password">
              {t("Password")}
            </Label>
            <Input
              type="password"
              id="password"
              placeholder={t("Password")}
              disabled={isLoading || isGoogleLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center">
            <button
              className={cn(buttonVariants(), "w-full")}
              disabled={isLoading}
              style={{ fontWeight: "600" }}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span className="ml-3"> {t("Sign In with Email")}</span>
            </button>
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or
                </span>
              </div>
            </div>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              onClick={() => {
                setIsGoogleLoading(true)
                signIn("google")
              }}
              disabled={isLoading || isGoogleLoading}
              style={{
                display: "flex",
                alignItems: "center", // Center items vertically
                justifyContent: "center", // Center items horizontally
                borderColor: "black",
                marginTop: "1rem", // Margin top to space from the email button
                padding: "0.5rem 1rem", // Adjust padding as needed
              }}
            >
              {isGoogleLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <div style={{ flex: "0 0 auto" }}>
                <Icons.googleSignup className="h-5 w-5" />
              </div>
              <span
                style={{
                  flex: "1 1 auto",
                  textAlign: "center", // Center text
                  fontWeight: "600",
                }}
              >
                {t("Sign In with Google")}
              </span>
            </button>
          </div>
        </div>
      </form>

      {error && (
        <Alert
          variant="destructive"
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "1rem",
            position: "fixed",
            bottom: "25px",
            right: "25px",
            maxWidth: "350px",
            opacity: "0.7",
          }}
        >
          <div>
            <AlertDescription>
              {t(
                "Your password is incorrect or this email address is not registered with Convify"
              )}
            </AlertDescription>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-4 font-bold text-white focus:outline-none"
            style={{
              position: "absolute",
              top: "0",
              right: "10px",
            }}
            aria-label="Close"
          >
            &times;
          </button>
        </Alert>
      )}
    </div>
  )
}

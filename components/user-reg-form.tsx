"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signUp } from "@/actions/users/signUp"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { userSignUpSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslations } from "next-intl"
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userSignUpSchema>

export function UserRegForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Access setValue from useForm to set form field values
  } = useForm<FormData>({
    resolver: zodResolver(userSignUpSchema),
  })
  const t = useTranslations("SignUp")

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isEmailLoading, setIsEmailLoading] = React.useState<boolean>(false)
  const [showEmailSignup, setShowEmailSignup] = React.useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = React.useState<string | null>(
    searchParams?.get("error") ?? null
  )
  const [isMobile, setIsMobile] = React.useState<boolean>(false) // Add mobile detection state

  // Mobile detection logic
  React.useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    if (/android|iphone|ipad|ipod/i.test(userAgent)) {
      setIsMobile(true)
    }
  }, [])
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

  // State to temporarily store form data
  const [formData, setFormData] = React.useState<{
    email: string
    password: string
  }>({
    email: "",
    password: "",
  })

  React.useEffect(() => {
    // Check if there's stored form data in sessionStorage
    const storedFormData = sessionStorage.getItem("userFormData")
    if (storedFormData) {
      const { email, password } = JSON.parse(storedFormData)
      setFormData({ email, password })
      // Pre-fill form fields with stored data
      setValue("email", email)
      setValue("password", password)
    }
  }, [])

  async function onSubmit(data: FormData) {
    setIsLoading(true) // Start loading when form is submitted
    sessionStorage.setItem("userFormData", JSON.stringify(data))

    try {
      const signUpResult = await signUp(data) // Sign up the user

      if (signUpResult.error) {
        setIsLoading(false) // Stop loading if there's an error
        setError(signUpResult.error)
        toast({
          title: t("Sign Up Failed"),
          description: signUpResult.error,
          variant: "destructive",
        })
        return // Stop further execution if there is an error
      }

      // Log in the user immediately after successful signup
      const signInResult = await signIn("credentials", {
        redirect: true,
        username: data.email,
        password: data.password,
        isFromApi: false,
        callbackUrl: isMobile
          ? "/mobile"
          : "/dashboard/flows/create-flow/select-template",
      })
    } catch (error) {
      setIsLoading(false) // Stop loading on error
      toast({
        title: "Login Failed",
        description: error.message || "Please try to log in manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {showEmailSignup ? (
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
                <p className="mt-1 flex px-1 text-xs text-red-600">
                  <Icons.error className="mr-1 size-4" />

                  {errors.email.message}
                </p>
              )}
              <Label className="sr-only" htmlFor="password">
                {t("Password")}
              </Label>
              <Input
                className="mt-5"
                type="password"
                id="password"
                placeholder={t("Password")}
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 flex px-1 text-xs text-red-600">
                  <Icons.error className="mr-1 size-4" />
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 w-full">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                className="form-checkbox mr-2 size-5"
                style={{ accentColor: "black" }}
                {...register("termsAccepted")}
              />
              <span className="pl-1">
                {t("I agree to the Terms of Service and Privacy Policy")}
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="mt-1 flex items-center text-xs text-red-600">
                <Icons.error className="mr-2 size-4" />
                {errors.termsAccepted.message}
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              className={cn(
                buttonVariants(),
                "flex w-full items-center justify-center"
              )}
              disabled={isLoading}
              style={{ fontWeight: "600" }}
              type="submit"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("Create my Free Account")}
            </button>
          </div>
        </form>
      ) : (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Icons.spinner className="mr-2 size-6 animate-spin" />
            </div>
          ) : (
            <>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex items-center justify-center"
                )}
                onClick={() => {
                  setIsGoogleLoading(true)
                  signIn("google", {
                    callbackUrl: isMobile
                      ? "/mobile"
                      : "/dashboard/flows/create-flow/select-template",
                  })
                }}
                disabled={isLoading || isGoogleLoading}
                style={{
                  borderColor: "black",
                  padding: "0.5rem 1rem", // Adjust padding as needed
                  display: "flex",
                  alignItems: "center", // Center items vertically
                  justifyContent: "center", // Center items horizontally
                }}
              >
                {isGoogleLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
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
                  {t("Sign Up with Google")}
                </span>
              </button>

              <div className="relative">
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background text-muted-foreground px-2 text-sm">
                    {t("Or")}
                  </span>
                </div>
              </div>
              <button
                className={cn(
                  buttonVariants(),
                  "flex items-center justify-center "
                )}
                style={{ fontWeight: "600" }}
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true)
                  setTimeout(() => {
                    setShowEmailSignup(true)
                    setIsLoading(false)
                  }, 1000)
                }}
              >
                <span className="ml-3"> {t("Sign Up with Email")}</span>
              </button>
            </>
          )}
        </>
      )}
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
            {/* <AlertTitle>{t("Something went wrong")}</AlertTitle> */}
            <AlertDescription>{t(`${error.slice(0, -1)}`)}</AlertDescription>
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

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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useTranslations } from "next-intl"
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

type FormData = z.infer<typeof userSignInSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Access setValue from useForm to set form field values
  } = useForm<FormData>({
    resolver: zodResolver(userSignInSchema),
  })
  const t = useTranslations("Login")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const [error, setError] = React.useState<string | null>(searchParams?.get('error') ?? null)

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      sessionStorage.removeItem("userFormData");
    }
  }, [error]);

  // State to temporarily store form data
  const [formData, setFormData] = React.useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  React.useEffect(() => {
    // Check if there's stored form data in sessionStorage
    const storedFormData = sessionStorage.getItem("userFormData");
    if (storedFormData) {
      const { email, password } = JSON.parse(storedFormData);
      setFormData({ email, password });
      // Pre-fill form fields with stored data
      setValue("email", email);
      setValue("password", password);
    }
  }, []);

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    sessionStorage.setItem("userFormData", JSON.stringify(data));

    const signInResult = await signIn("credentials", {
      username: data.email,
      password: data.password,
      callbackUrl: "/dashboard",
    })

    setIsLoading(false)
    if (!signInResult?.ok) {
      toast({
        title: t("Something went wrong"),
        description: t("Your sign in request failed Please try again"),
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
          <button
            className={cn(buttonVariants())}
            disabled={isLoading}
            style={{ fontWeight: "600" }}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("Sign In with Email")}
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true)
          signIn("google")
        }}
        disabled={isLoading || isGoogleLoading}
        style={{
          flexDirection: "row",
          gap: "0.5rem",
          justifyContent: "flex-start",
          borderColor: "black",
        }}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          ""
        )}{" "}
        <Icons.googleSignup className="h-5 w-5" />
        <span style={{ marginLeft: "4rem", fontWeight: "600" }}>
          {t("Sign In with Google")}
        </span>
      </button>
      {error && (
        <Alert variant="destructive" style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '1rem',
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          maxWidth: '350px',
          opacity: '0.7',
        }}>
          <div>
            {/* <AlertTitle>{t("Something went wrong")}</AlertTitle> */}
            <AlertDescription>
              {t("Your password is incorrect or this email address is not registered with Convify")}
            </AlertDescription>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-white font-bold focus:outline-none"
            style={{
              position: 'absolute',
              top: '0',
              right: '10px',
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

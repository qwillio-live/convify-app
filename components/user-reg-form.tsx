"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/actions/users/signUp"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userSignUpSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userSignUpSchema>

export function UserRegForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSignUpSchema),
  })

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(data: FormData) {
    setIsLoading(true) // Start loading when form is submitted

    try {
      const signUpResult = await signUp(data) // Sign up the user

      if (signUpResult.error) {
        setIsLoading(false) // Stop loading if there's an error
        toast({
          title: "Sign Up Failed",
          description: signUpResult.error,
          variant: "destructive",
        })
        return // Stop further execution if there is an error
      }

      // Log in the user immediately after successful signup
      const signInResult = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      })

      if (signInResult?.status === 200) {
        router.push("/dashboard") // Redirect immediately to the dashboard on successful login
      } else {
        throw new Error("Failed to log in")
      }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
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
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            className={cn(buttonVariants(), "flex items-center justify-center")}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
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
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex items-center justify-center"
        )}
        onClick={() => {
          setIsGoogleLoading(true)
          signIn("google")
        }}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          ""
        )}
        Sign Up with Google
      </button>
    </div>
  )
}
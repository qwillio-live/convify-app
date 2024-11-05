import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"
import { sign } from "jsonwebtoken"
import prisma from "@/lib/prisma"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toISOString()
}

export function absoluteUrl(url: string) {
  return url
}

export const generateSignInLink = async (userEmail) => {
  let shortToken
  let isUnique = false

  // Generate a unique short token
  while (!isUnique) {
    // Generate a short token (12 characters long)
    shortToken = crypto.randomBytes(3).toString("hex") // 6-byte hex string (12 characters)

    // Check if the token is unique
    const existingToken = await prisma.token.findUnique({
      where: {
        shortToken: shortToken,
      },
    })

    if (!existingToken) {
      isUnique = true
    }
  }

  console.log("Short token generated:", shortToken)

  // Generate a JWT token with the user's email and short token
  const jwtToken = sign(
    { email: userEmail, token: shortToken },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.AUTH_TOKEN_EXPIRATION, // Set token expiration time as needed
    }
  )

  // Create a new entry in the Token table
  await prisma.token.create({
    data: {
      shortToken: shortToken,
      longToken: jwtToken,
    },
  })

  console.log("JWT token:", jwtToken)

  // Create a sign-in link using the JWT token
  const signInLink = `${
    process.env.NEXT_PUBLIC_DOMAIN_URL
  }/auth/signin-link?token=${encodeURIComponent(shortToken)}`

  console.log("Sign-in link:", signInLink)

  return signInLink
}

export const serialize = value => {
  return JSON.stringify(value)
}

export const deserialize = string => {
  return JSON.parse(string)
}
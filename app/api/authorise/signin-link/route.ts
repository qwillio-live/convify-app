import { NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { signIn } from "next-auth/react" // Ensure this is imported from 'next-auth/react'
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    // Verify the token
    const decodedToken = await prisma.token.findUnique({
      where: {
        shortToken: token,
      },
    })
    if (!decodedToken) {
      return NextResponse.json({ msg: "Wrong Token" }, { status: 404 })
    }
    const decoded = await verify(decodedToken.longToken, process.env.JWT_SECRET)

    // Extract email from the decoded token
    const { email } = decoded
    console.log("decoded", decoded, email)

    if (email)
      return NextResponse.json({ msg: "email found", email }, { status: 200 })
    else return NextResponse.json({ msg: "email not found" }, { status: 404 })
  } catch (error) {
    console.error("Failed to verify token:", error)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    )
  }
}

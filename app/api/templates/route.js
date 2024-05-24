import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "next-auth/react"
import { logError } from "@/lib/utils/logger"

export async function GET(req) {
  const session = await getSession({ req })

  if (!session) {
    const statusCode = 401
    await logError({
      statusCode: statusCode,
      errorMessage: "User is not authenticated",
      user_id: null,
      request_url: req.url,
    })
    return NextResponse.json({ error: "Unauthorized" }, { status: statusCode })
  }

  try {
    const templates = await prisma.template.findMany()
    return NextResponse.json(templates)
  } catch (error) {
    const statusCode = 500
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      user_id: session.user.id,
      request_url: req.url,
    })

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: statusCode }
    )
  }
}

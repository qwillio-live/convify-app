import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let { id } = params
  const data = await getServerSession(authOptions)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = 0
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
  const userId = data.user.id

  try {
    const templates = await prisma.template.findMany({
      where: {
        isActive: true,
        language: id,
      },
    })

    console.log("templates in api", templates)
    return NextResponse.json(templates)
  } catch (error) {
    console.log(error)
    const statusCode = 500
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      userId,
      requestUrl: req.url,
    })

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: statusCode }
    )
  }
}

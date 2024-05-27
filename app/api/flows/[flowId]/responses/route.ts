import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"

export async function POST(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params

  try {
    const flow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        isDeleted: false,
      },
    })

    if (!flow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({
        statusCode,
        errorMessage,
        requestUrl,
        userId: "unknown",
      })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const userAgent = req.headers.get("user-agent") || "unknown"
    const ipAddr =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const response = await prisma.response.create({
      data: {
        flowId: String(flowId),
        ip: ipAddr,
        userAgent: userAgent,
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

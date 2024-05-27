import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"

export async function PUT(
  req: NextRequest,
  { params }: { params: { flowId: string; id: string } }
) {
  const { flowId, id } = params

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

    let reqBody
    try {
      reqBody = await req.json()
    } catch (error) {
      await logError({
        statusCode: 400,
        errorMessage: "Request body is empty",
        requestUrl: req.url,
        userId: "unknown",
      })
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      )
    }

    const response = await prisma.response.update({
      where: { id: String(id) },
      data: { ...reqBody },
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

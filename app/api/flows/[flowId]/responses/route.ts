import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { z } from "zod"

const ResponseCreateRequestSchema = z
  .object({
    content: z.record(z.unknown()),
  })
  .strict()

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

    let data
    try {
      data = await req.json()
      ResponseCreateRequestSchema.parse(data)
    } catch (error) {
      await logError({
        statusCode: 400,
        errorMessage: "Request body is empty or invalid",
        requestUrl: req.url,
        userId: "unknown",
      })
      return NextResponse.json(
        { error: "Request body is empty or invalid" },
        { status: 400 }
      )
    }

    const userAgent = req.headers.get("user-agent") || "unknown"
    const ipAddr =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const response = await prisma.response.create({
      data: {
        flowId: String(flowId),
        ip: ipAddr,
        userAgent: userAgent,
        content: data.content
      },
    })
    flow.numberOfResponses = flow.numberOfResponses? flow.numberOfResponses : 0;
    await prisma.flow.update({
      where: { id: String(flowId) },
      data: { numberOfResponses: flow.numberOfResponses + 1 },
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

export async function GET(
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
      include: {
        responses: true,
      },
      orderBy: {
        createdAt: 'desc',
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

    return NextResponse.json(flow.responses)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

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
      await logError({
        statusCode: 400,
        errorMessage: "Flow not found",
        requestUrl: req.url,
        userId: "unknown",
      })
      return NextResponse.json({ error: "Flow not found" }, { status: 400 })
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

    if (!reqBody.stepId) {
      await logError({
        statusCode: 400,
        errorMessage: "Step Id is required",
        requestUrl: req.url,
        userId: "unknown",
      })
      return NextResponse.json(
        { error: "Step Id is required" },
        { status: 400 }
      )
    }

    const userAgent = req.headers.get("user-agent") || "unknown"
    const ipAddr =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const visit = await prisma.visit.create({
      data: {
        flowId: String(flowId),
        stepId: reqBody.stepId,
        ip: ipAddr,
        userAgent: userAgent,
      },
    })

    return NextResponse.json(visit)
  } catch (error) {
    await logError({
      statusCode: 500,
      errorMessage: error.message || "An unexpected error occurred",
      requestUrl: req.url,
      userId: "unknown",
    })
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

// @ts-nocheck
import { logError } from "@/lib/utils/logger"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params

  try {
    const flow = await prisma.flow.findMany({
      where: {
        id: String(flowId),
        isDeleted: false,
      },
    })

    if (!flow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }
    const flowSteps = await prisma.flowStep.findFirst({
      where: {
        flowId: String(flowId),
        isDeleted: false,
        order: 0,
      },
    })
    flow.steps = [...flowSteps]
    console.log("flow", flow, "flowSteps", flowSteps)
    return NextResponse.json(flow)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

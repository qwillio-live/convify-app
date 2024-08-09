export const runtime = "nodejs"

import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  try {
    const { flowId } = params
    const flows = await prisma.flow.findFirst({
      where: {
        isPublished: true,
        isDeleted: false,
        id: flowId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    const flowSteps = await prisma.flowStep.findMany({
      where: {
        flowId: String(flowId),
        isDeleted: false,
      },
    })
    const finalFlow: any = { ...flows }
    if (flows) finalFlow.steps = flowSteps.sort((a, b) => a.order - b.order)
    console.log("solo", finalFlow, flowId)
    return NextResponse.json(finalFlow)
  } catch (error) {
    console.error(error)

    const statusCode = 500

    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

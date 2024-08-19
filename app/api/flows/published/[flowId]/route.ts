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
      include: {
        integrations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    const flowSteps = await prisma.publishedFlowStep.findMany({
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

export async function POST(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  try {
    const { flowId } = params
    const flows = await prisma.flow.findMany({
      where: {
        isDeleted: false,
        id: flowId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    if (flows.length > 0) {
      const flowSteps = await prisma.flowStep.findMany({
        where: {
          flowId: flowId,
          isDeleted: false,
        },
      })
      const publishedFlowSteps = flowSteps.map((step) => ({
        flowId,
        name: step.name,
        link: step.link || "",
        content: step.content || {},
        order: step.order,
      }))
      const deletedFlowSteps = await prisma.publishedFlowStep.deleteMany({
        where: {
          flowId: flowId,
        },
      })
      console.log("deleted flowSteps", deletedFlowSteps)
      const result = await prisma.publishedFlowStep.createMany({
        data: publishedFlowSteps,
      })
      let sortedSteps = publishedFlowSteps
      if (flows)
        sortedSteps = publishedFlowSteps.sort((a, b) => a.order - b.order)
      const update = await prisma.flow.update({
        where: {
          id: flowId,
        },
        data: {
          isPublished: true,
          link:
            sortedSteps.length > 0
              ? `https://conv-hassan.picreel.bid/published-flow/${flowId}?screen=${sortedSteps[0].name}`
              : `https://conv-hassan.picreel.bid/published-flow/${flowId}`,
        },
      })
      console.log("final result", result, update)
      return NextResponse.json(result)
    }
  } catch (error) {
    console.error(error)

    const statusCode = 500

    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

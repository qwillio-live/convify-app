import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"

interface DropOffData {
  stepName: string
  visits: number
  dropOffRate: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const flowId = searchParams.get("flowId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!flowId || !startDate || !endDate) {
    const statusCode = 400
    const errorMessage = "Flow ID, start date, and end date are required"
    const requestUrl = req.url
    await logError({
      statusCode,
      errorMessage,
      requestUrl,
      userId: "unknown",
    })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  try {
    const startDateObj = new Date(startDate as string)
    const endDateObj = new Date(endDate as string)

    const visits = await prisma.visit.groupBy({
      by: ["stepId"],
      where: {
        flowId: String(flowId),
        createdAt: {
          gte: startDateObj,
          lte: endDateObj,
        },
      },
      _count: {
        stepId: true,
      },
      orderBy: {
        stepId: "asc",
      },
    })

    const flow = await prisma.flow.findUnique({
      where: { id: String(flowId) },
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

    const steps = await prisma.flowStep.findMany({
      where: { id: String(flowId) },
    })

    const dropOffData: DropOffData[] = []
    for (let i = 0; i < visits.length; i++) {
      const currentStep = visits[i]
      const nextStep = visits[i + 1]
      const stepName =
        steps.find((step) => step.id === currentStep.stepId)?.name ||
        `Step ${currentStep.stepId}`
      const dropOffRate = nextStep
        ? ((currentStep._count.stepId - nextStep._count.stepId) /
            currentStep._count.stepId) *
          100
        : 0
      dropOffData.push({
        stepName,
        visits: currentStep._count.stepId,
        dropOffRate: dropOffRate.toFixed(2),
      })
    }

    return NextResponse.json(dropOffData)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"

interface DropOffData {
  stepName: string
  visits: number
  exits: number
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

    const flow = await prisma.flow.findUnique({
      where: { id: String(flowId), isDeleted: false },
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
      where: { flowId: String(flowId) },
      orderBy: { order: "asc" },
    })

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

    const dropOffData: DropOffData[] = []
    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i]
      const currentStepVisits =
        visits.find((visit) => visit.stepId === currentStep.id)?._count
          .stepId || 0
      const nextStep = steps[i + 1]
      const nextStepVisits = nextStep
        ? visits.find((visit) => visit.stepId === nextStep.id)?._count.stepId ||
          0
        : 0
      const dropOffRate =
        currentStepVisits > 0
          ? ((currentStepVisits - nextStepVisits) / currentStepVisits) * 100
          : 0

      dropOffData.push({
        stepName: currentStep.name,
        visits: currentStepVisits,
        exits: (currentStepVisits - nextStepVisits),
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

import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const FlowStepUpdateSchema = z
  .object({
    name: z.string().optional(),
    link: z.string().optional(),
    content: z.record(z.unknown()).optional(),
    order: z.number().int().optional(),
  })
  .strict()

export async function GET(
  req: NextRequest,
  { params }: { params: { flowId: string; id: String } }
) {
  const { flowId, id } = params
  const data = await getServerSession(authOptions)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = "unknown"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  const userId = data.user.id
  try {
    const existingFlow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        userId,
        isDeleted: false,
      },
    })

    if (!existingFlow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const flowStep = await prisma.flowStep.findFirst({
      where: {
        id: String(id),
        isDeleted: false,
      },
    })

    if (!flowStep) {
      const statusCode = 404
      const errorMessage = "Flow step not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    return NextResponse.json(flowStep)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { flowId: string; id: String } }
) {
  const { flowId, id } = params
  const data = await getServerSession(authOptions)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = "unknown"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  const userId = data.user.id
  try {
    const existingFlow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        userId,
        isDeleted: false,
      },
    })

    if (!existingFlow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const flowStep = await prisma.flowStep.findFirst({
      where: {
        id: String(id),
        isDeleted: false,
      },
    })

    if (!flowStep) {
      const statusCode = 404
      const errorMessage = "Flow step not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    let data
    try {
      data = await req.json()
      FlowStepUpdateSchema.parse(data)
    } catch (error) {
      await logError({
        statusCode: 400,
        errorMessage: "Request body is empty or invalid",
        requestUrl: req.url,
        userId,
      })
      return NextResponse.json(
        { error: "Request body is empty or invalid" },
        { status: 400 }
      )
    }

    const updatedFlowStep = await prisma.flowStep.update({
      where: { id: String(id), isDeleted: false },
      data,
    })

    return NextResponse.json(updatedFlowStep)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { flowId: string; id: string } }
) {
  const { flowId, id } = params
  const data = await getServerSession(authOptions)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = "unknown"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  const userId = data.user.id
  try {
    const existingFlow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        userId,
        isDeleted: false,
      },
    })

    if (!existingFlow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const flowStep = await prisma.flowStep.findFirst({
      where: {
        id: String(id),
        isDeleted: false,
      },
    })

    if (!flowStep) {
      const statusCode = 404
      const errorMessage = "Flow step not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const deletedFlowStep = await prisma.flowStep.update({
      where: { id: String(id) },
      data: { isDeleted: true },
    })

    // Decrease number of steps in flow
    existingFlow.numberOfSteps = existingFlow.numberOfSteps? existingFlow.numberOfSteps : 0;
    await prisma.flow.update({
      where: { id: String(flowId), userId, isDeleted: false },
      data: { numberOfSteps: existingFlow.numberOfSteps - 1 },
    })

    return NextResponse.json(deletedFlowStep)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

// @ts-nocheck
import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const StepSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  link: z.string(),
  order: z.number(),
  templateId: z.string().optional(),
})

const FlowUpdateRequestSchema = z.object({
  name: z.string().optional(),
  previewImage: z.string().optional(),
  link: z.string().optional(),
  status: z.string().optional(),
  numberOfSteps: z.number().optional(),
  flowSettings: z.record(z.unknown()).optional(),
  steps: z.array(StepSchema).optional(),
})

export const maxDuration = 60
export async function GET(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params
  // const data = await getServerSession(authOptions)

  // if (!data) {
  //   const statusCode = 401
  //   const errorMessage = "User is not authenticated"
  //   const userId = 0
  //   const requestUrl = req.url
  //   await logError({ statusCode, errorMessage, userId, requestUrl })
  //   return NextResponse.json({ error: errorMessage }, { status: statusCode })
  // }

  // const userId = data.user.id
  try {
    const flow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        // userId,
        isDeleted: false,
      },
      include: {
        integrations: true,
      },
    })

    if (!flow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }
    const flowSteps = await prisma.flowStep.findMany({
      where: {
        flowId: String(flowId),
        isDeleted: false,
      },
    })
    flow.steps = flowSteps.sort((a, b) => a.order - b.order)
    // console.log("returning flow", flow)
    return NextResponse.json(flow)
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
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params
  const data = await getServerSession(authOptions)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = 0
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

    let data
    try {
      data = await req.json()
      FlowUpdateRequestSchema.parse(data)
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

    if (data.steps) {
      // console.log("data.steps", data.steps)
      const existingSteps = await prisma.FlowStep.findMany({
        where: {
          flowId: String(flowId),
          isDeleted: false,
        },
      })
      const newStepIds = new Set(data.steps.map((step) => step.id))
      // // console.log("existig.steps,newStepIds", existingSteps, newStepIds)
      // // Mark missing steps as isDeleted: true
      for (const step of existingSteps) {
        if (!newStepIds.has(step.id)) {
          try {
            await prisma.FlowStep.delete({
              where: {
                id: step.id,
              },
            })
          } catch (err) {
            console.log("step not found")
          }
        }
      }
      let order = 0
      // Upsert steps (Insert ignore on duplicate key update)
      for (const step of data.steps) {
        const existingStep = await prisma.FlowStep.findUnique({
          where: {
            id: step.id,
            flowId: String(flowId),
          },
        })
        // console.log("existingStep", existingStep)
        if (existingStep) {
          // console.log(`Updating ${existingStep}`)
          await prisma.FlowStep.update({
            where: {
              id: step.id,
              flowId: String(flowId),
            },
            data: {
              link: step.link,
              content: step.content,
              order: order,
              name: step.name || "",
              templateId: step.templateId || "",
              updatedAt: new Date(),
            },
          })
        } else {
          console.log(`creating new `)
          await prisma.FlowStep.create({
            data: {
              name: step.name || "",
              flowId: String(flowId),
              link: step.link,
              content: step.content,
              order: order,
              templateId: step.templateId || "",
              isDeleted: false,
              updatedAt: new Date(),
            },
          })
        }
        order += 1
      }

      // Update numberOfSteps in Flows table
      const numberOfSteps = data.steps.length
      data.numberOfSteps = numberOfSteps
    }

    const updatedFlow = await prisma.flow.update({
      where: { id: String(flowId) },
      data: { ...data, steps: undefined },
    })

    return NextResponse.json(updatedFlow)
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
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params
  const data = await getServerSession(authOptions)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = 0
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
      },
    })

    if (!existingFlow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const updatedFlow = await prisma.flow.update({
      where: { id: String(flowId) },
      data: { isDeleted: true },
    })

    return NextResponse.json(updatedFlow)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

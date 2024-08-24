export const runtime = "nodejs"

import { env } from "@/env.mjs"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid" // Ensure you have this library installed

/**
 * Generate a unique, URL-friendly name.
 * @param {string} name - The original name.
 * @returns {string} - The transformed unique name.
 */
function generateUniqueName(name) {
  if (!name) return ""

  // Convert to lowercase and replace spaces with hyphens
  const formattedName = name.toLowerCase().trim().replace(/\s+/g, "-")

  // Generate a 6-digit random string
  const uniqueSuffix = uuidv4().slice(0, 6) // Example: "94dh23"

  return `${formattedName}-${uniqueSuffix}`
}

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
        publishedName: flowId,
      },
      include: {
        integrations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    if (flows) {
      const flowSteps = await prisma.publishedFlowStep.findMany({
        where: {
          flowId: String(flows.id),
          isDeleted: false,
        },
      })
      const finalFlow: any = { ...flows }
      if (flows) finalFlow.steps = flowSteps.sort((a, b) => a.order - b.order)
      console.log("solo", finalFlow, flowId)
      return NextResponse.json(finalFlow)
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

export async function POST(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  try {
    const flowDomain = process.env.NEXT_PUBLIC_FLOW_DOMAIN
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
      let uniqueName = ""
      if (flows) {
        sortedSteps = publishedFlowSteps.sort((a, b) => a.order - b.order)
        uniqueName = flows[0].publishedName
          ? flows[0].publishedName
          : generateUniqueName(flows[0].name)
      }
      const update = await prisma.flow.update({
        where: {
          id: flowId,
        },
        data: {
          isPublished: true,
          publishedName: uniqueName,
          link:
            sortedSteps.length > 0
              ? `${flowDomain}/${uniqueName}?screen=${sortedSteps[0].name}`
              : `${flowDomain}/${uniqueName}`,
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

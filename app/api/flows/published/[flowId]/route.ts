export const runtime = "nodejs"

import { env } from "@/env.mjs"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid" // Ensure you have this library installed

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

// Helper function to generate random letters
export const generateRandomLetters = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Function to generate a unique published name
const generateUniqueName = async (baseName: string) => {
  let uniqueName = baseName
  let isUnique = await checkPublishedNameExists(uniqueName)

  // Generate a unique publishedName if needed
  while (!isUnique) {
    const randomSuffix = generateRandomLetters(6) // Append 6 random characters
    uniqueName = `${baseName}-${randomSuffix}`
    isUnique = await checkPublishedNameExists(uniqueName)
  }

  return uniqueName
}

// Function to check if the published name exists
const checkPublishedNameExists = async (publishedName: string) => {
  try {
    const count = await prisma.flow.count({
      where: {
        publishedName,
      },
    })
    return count === 0
  } catch (error) {
    console.error("Error checking published name existence:", error)
    return false
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  try {
    const flowDomain = process.env.NEXT_PUBLIC_FLOW_DOMAIN
    const { flowId } = params

    // Fetch the flow and its steps
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
      const flow = flows[0]
      const flowSteps = await prisma.flowStep.findMany({
        where: {
          flowId,
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

      // Delete old published flow steps
      const deletedFlowSteps = await prisma.publishedFlowStep.deleteMany({
        where: {
          flowId,
        },
      })
      console.log("deleted flowSteps", deletedFlowSteps)

      // Create new published flow steps
      const result = await prisma.publishedFlowStep.createMany({
        data: publishedFlowSteps,
      })

      let sortedSteps = publishedFlowSteps.sort((a, b) => a.order - b.order)
      let uniqueName = ""

      // Check and generate a unique published name
      if (flow.publishedName) {
        uniqueName = flow.publishedName
      } else {
        uniqueName = await generateUniqueName(flow.name)
      }

      // Update the flow with the new published name
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
    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: 500 }
    )
  }
}

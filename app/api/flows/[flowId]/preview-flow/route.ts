import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
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
    const flow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        userId,
        isDeleted: false,
      },
      // include: {
      //   flowSteps: true,
      // },
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
    // flow = flowSteps.sort((a, b) => a.order - b.order)

    return NextResponse.json(flow)
  } catch (error) {
    console.log("error", error)
  }
}

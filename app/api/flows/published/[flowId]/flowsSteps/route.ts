import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  try {
    const { flowId } = params
    const flows = await prisma.publishedFlowStep.findMany({
      where: {
        flowId: flowId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(flows)
  } catch (error) {
    console.error(error)

    const statusCode = 500

    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const flows = await prisma.flow.findMany({
      where: {
        isPublished: true,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    console.log(flows.length, flows)
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

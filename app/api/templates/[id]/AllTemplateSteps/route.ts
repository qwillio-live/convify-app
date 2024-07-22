import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, params) {
  const data = await getServerSession(authOptions)
  const url = new URL(req.url)

  if (!data) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = 0
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  let { id } = params
  try {
    const templateSteps = await prisma.flowStep.findMany({
      where: {
        templateId: id,
      },
    })
    return NextResponse.json(templateSteps)
  } catch (error) {
    console.log(error)
    const statusCode = 500

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: statusCode }
    )
  }
}

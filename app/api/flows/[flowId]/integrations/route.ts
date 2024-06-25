import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(
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
    })

    if (!flow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    let reqBody
    try {
      reqBody = await req.json()
    } catch (error) {
      await logError({
        statusCode: 400,
        errorMessage: "Request body is empty",
        userId,
        requestUrl: req.url,
      })
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      )
    }

    const existingIntegration = await prisma.integration.findFirst({
      where: {
        flowId: String(flowId),
      },
    })

    if (existingIntegration) {
      const updatedIntegration = await prisma.integration.update({
        where: { id: String(existingIntegration.id) },
        data: {
          ...reqBody,
        },
      })
      return NextResponse.json(updatedIntegration)
    } else {
      const integration = await prisma.integration.create({
        data: {
          flowId: String(flowId),
          ...reqBody,
        },
      })
      return NextResponse.json(integration)
    }
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

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
    })

    if (!flow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const integration = await prisma.integration.findFirst({
      where: {
        flowId: String(flowId),
      },
    })
    return NextResponse.json(integration)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

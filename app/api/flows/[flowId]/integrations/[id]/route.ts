import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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

    const updatedIntegration = await prisma.integration.update({
      where: { id: String(id) },
      data: {
        ...reqBody,
      },
    })

    return NextResponse.json(updatedIntegration)
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

    const updatedIntegration = await prisma.integration.update({
      where: { id: String(id) },
      data: { isDeleted: true },
    })

    return NextResponse.json(updatedIntegration)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

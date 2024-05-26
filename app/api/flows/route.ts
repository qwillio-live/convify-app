import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
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
    const flows = await prisma.flow.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    })
    return NextResponse.json(flows)
  } catch (error) {
    console.error(error)

    const statusCode = 500
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      userId,
      requestUrl: req.url || "unknown",
    })

    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

export async function POST(req: NextRequest) {
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

  let reqBody
  try {
    reqBody = await req.json()
  } catch (error) {
    await logError({
      statusCode: 500,
      errorMessage: "Request body is empty",
      userId,
      requestUrl: req.url,
    })
    return NextResponse.json(
      { error: "Request body is empty" },
      { status: 500 }
    )
  }

  const {
    templateId,
    status,
    previewImage,
    link,
    numberOfSteps,
    numberOfResponses,
  } = reqBody

  if (!templateId) {
    const statusCode = 400
    const errorMessage = "Template ID is required"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      const statusCode = 404
      const errorMessage = "Template not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const flow = await prisma.flow.create({
      data: {
        name: template.name,
        content: JSON.stringify(template.content),
        templateSettings: JSON.stringify(template.templateSettings),
        steps: JSON.stringify(template.steps),
        status: status || "active",
        previewImage: previewImage || template.preview,
        link: link || "",
        numberOfSteps: numberOfSteps || 0,
        numberOfResponses: numberOfResponses || 0,
        userId,
      },
    })

    return NextResponse.json({ id: flow.id })
  } catch (error) {
    console.error(error)

    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({
      statusCode,
      errorMessage,
      userId,
      requestUrl,
    })

    return NextResponse.json(
      { error: "Failed to create a flow" },
      { status: statusCode }
    )
  }
}
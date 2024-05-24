import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "next-auth/react"
import { logError } from "@/lib/utils/logger"
import { func } from "prop-types"

export async function GET(req) {
  const session = await `getSession`({ req })

  if (!session) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = "unknown"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: "Unauthorized" }, { status: statusCode })
  }

  try {
    const flows = await prisma.flow.findMany()
    return NextResponse.json(flows)
  } catch (error) {
    console.error(error)

    const statusCode = 500
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      userId: session.user.id,
      requestUrl: req.url || "unknown",
    })

    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

export async function POST(req) {
  const session = await getSession({ req })

  if (!session) {
    const statusCode = 401
    const errorMessage = "User is not authenticated"
    const userId = "unknown"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  const userId = session.user.id
  const {
    templateId,
    status,
    previewImage,
    link,
    numberOfSteps,
    numberOfResponses,
  } = req.body

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
        content: template.content,
        templateSettings: template.templateSettings,
        steps: template.steps,
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

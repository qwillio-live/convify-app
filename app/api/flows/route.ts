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
    const userId = 0
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
      orderBy: {
        createdAt: 'desc',
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
    const userId = 0
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
  const userId = data.user.id
  const userEmail = data.user.email

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

  const { templateId, status, previewImage, link ,name, flowSettings} = reqBody

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

    const templateSteps = await prisma.templateStep.findMany({
      where: {
        templateId: template.id,
      },
    })
    
    const flow = await prisma.flow.create({
      data: {
        templateId: template.id,
        name: name || template.name,
        flowSettings: flowSettings || template.templateSettings,
        status: status || "active",
        previewImage: previewImage || template.preview,
        link: link || "",
        numberOfSteps: templateSteps.length,
        numberOfResponses: 0,
        userId,
      },
    })

    const flowId = flow.id
    const flowSteps = templateSteps.map((step) => ({
      flowId,
      name: step.name,
      link: step.link,
      content: step.content as any,
      order: step.order,
    }))
    await prisma.flowStep.createMany({ data: flowSteps })

    await prisma.integration.create({
      data: {
        flowId: flow.id,
        email: userEmail
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

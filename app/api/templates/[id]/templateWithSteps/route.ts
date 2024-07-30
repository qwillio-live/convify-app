import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let { id } = params
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
    const templates = await prisma.template.findUnique({
      where: {
        isActive: true,
        id,
      },
    })
    if (!templates) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }
    console.log("template", templates)
    const templateSteps = await prisma.templateStep.findMany({
      where: {
        templateId: id,
      },
    })
    let sortedFlowSteps = templateSteps.sort((a, b) => a.order - b.order)
    const updateTemplateSteps = sortedFlowSteps.map((step) => ({
      flowId: templates.id,
      name: step.name,
      link: step.link,
      content: step.content as any,
      order: step.order,
    }))
    const templateUpdated = {
      templateId: templates.id,
      name: templates.name,
      flowSettings: templates.templateSettings,
      status: "active",
      previewImage: templates.preview,
      link: "",
      numberOfSteps: templateSteps.length === 0 ? 1 : templateSteps.length,
      numberOfResponses: 0,
      userId,
    }
    console.log("templateSteps", templateSteps)
    return NextResponse.json({ ...templateUpdated, steps: updateTemplateSteps })
    // console.log("template required with steps", templates)
    // return NextResponse.json(templates)
  } catch (error) {
    console.log(error)
    const statusCode = 500
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      userId,
      requestUrl: req.url,
    })

    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: statusCode }
    )
  }
}

// @ts-nocheck
import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { JsonObject } from "@prisma/client/runtime/library"

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
  const userEmail = data.user.email

  try {
    const flow = await prisma.flow.findUnique({
      where: { id: String(flowId) }
    });

    if (!flow || flow.userId !== userId) {
      return NextResponse.json(
        { error: "Flow not found or access denied" },
        { status: 404 }
      );
    }
    
    const newFlowData = {
      userId,
      templateId: flow.templateId,
      name: `${flow.name} - Copy`,
      flowSettings: flow.flowSettings || {},
      status: "draft",
      isDeleted: false
    };

    const newFlow = await prisma.flow.create({
      data: newFlowData,
    });

    await prisma.integration.create({
      data: {
        flowId: newFlow.id,
        email: userEmail
      },
    })
    // flow.steps = flow.steps? flow.steps : {};
    //   const newFlowSteps = flow.steps.map(({ id, ...step }) => ({
    //     ...step,
    //     flowId: newFlow.id,
    //   }));

    // await prisma.flowStep.createMany({
    //   data: newFlowSteps,
    // });

    return NextResponse.json(newFlow);
  } catch (error) {
    console.error(error);

    const statusCode = 500;
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      userId,
      requestUrl: req.url || "unknown",
    });

    return NextResponse.json(
      { error: "Failed to duplicate flow" },
      { status: statusCode }
    );
  }
   
}

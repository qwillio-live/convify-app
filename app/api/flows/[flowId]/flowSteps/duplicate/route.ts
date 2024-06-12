import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

export async function POST(req: NextRequest) {
  const data = await getServerSession(authOptions);
  if (!data) {
    const statusCode = 401;
    const errorMessage = "User is not authenticated";
    const userId = "unknown";
    const requestUrl = req.url;
    await logError({ statusCode, errorMessage, userId, requestUrl });
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
  const userId = data.user.id;

  let reqBody;
  try {
    reqBody = await req.json();
  } catch (error) {
    await logError({
      statusCode: 400,
      errorMessage: "Request body is empty",
      userId,
      requestUrl: req.url,
    });
    return NextResponse.json(
      { error: "Request body is empty" },
      { status: 400 }
    );
  }

  const { stepId } = reqBody;

  try {
    const step = await prisma.flowStep.findUnique({
      where: { id: stepId },
    });

    if (!step) {
      return NextResponse.json(
        { error: "Step not found" },
        { status: 404 }
      );
    }

    const flow = await prisma.flow.findUnique({
      where: { id: step.flowId },
    });

    if (!flow || flow.userId !== userId) {
      return NextResponse.json(
        { error: "Flow not found or access denied" },
        { status: 404 }
      );
    }

    const newStepName = `step-${Math.random().toString(36).substring(7)}`;
    const newStepOrder = step.order + 1;

    await prisma.flowStep.updateMany({
      where: {
        flowId: step.flowId,
        order: {
          gt: step.order,
        },
      },
      data: {
        order: {
          increment: 1,
        },
      },
    });

    const newStep = await prisma.flowStep.create({
      data: {
        flowId: step.flowId,
        name: newStepName,
        link: step.link,
        content: step.content || {},
        order: newStepOrder,
        isDeleted: false,
      },
    });

    return NextResponse.json(newStep);
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
      { error: "Failed to duplicate step" },
      { status: statusCode }
    );
  }
}


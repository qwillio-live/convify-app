import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
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
    const flow = await prisma.flow.findUnique({
      where: { id: String(flowId) },
    });

    if (!flow || flow.userId !== userId) {
      return NextResponse.json(
        { error: "Flow not found or access denied" },
        { status: 404 }
      );
    }

    const updatedFlow = await prisma.flow.update({
      where: { id: String(flowId) },
      data: { isPublished: true },
    });

    // Perform any additional actions needed for publishing

    return NextResponse.json(updatedFlow);
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
      { error: "Failed to publish flow" },
      { status: statusCode }
    );
  }
   
}


import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const data = await getServerSession(authOptions);
  if (!data) {
    const statusCode = 401;
    const errorMessage = "User is not authenticated";
    const userId = 0;
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

  const { steps } = reqBody;

  if (!Array.isArray(steps) || steps.some(step => typeof step.id !== 'string' || typeof step.order !== 'number')) {
    return NextResponse.json(
      { error: "Invalid steps format" },
      { status: 400 }
    );
  }

  try {
    await prisma.$transaction(
      steps.map(step => prisma.flowStep.update({
        where: { id: step.id },
        data: { order: step.order },
      }))
    );

    return NextResponse.json({ message: "Steps order updated successfully" });
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
      { error: "Failed to update steps order" },
      { status: statusCode }
    );
  }
}

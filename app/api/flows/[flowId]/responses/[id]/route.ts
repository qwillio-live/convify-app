import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { z } from "zod"

const ResponseUpdateRequestSchema = z
  .object({
    content: z.record(z.unknown()).optional(),
  })
  .strict()

export async function PUT(
  req: NextRequest,
  { params }: { params: { flowId: string; id: string } }
) {
  const { flowId, id } = params;

  try {
    const flow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        isDeleted: false,
      },
    });

    if (!flow) {
      const statusCode = 404;
      const errorMessage = "Flow not found";
      const requestUrl = req.url;
      await logError({
        statusCode,
        errorMessage,
        requestUrl,
        userId: "unknown",
      });
      const response = NextResponse.json({ error: errorMessage }, { status: statusCode });
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "PUT, GET, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return response;
    }

    let data;
    try {
      data = await req.json();
      ResponseUpdateRequestSchema.parse(data);
    } catch (error) {
      await logError({
        statusCode: 400,
        errorMessage: "Request body is empty or invalid",
        requestUrl: req.url,
        userId: "unknown",
      });
      const response = NextResponse.json(
        { error: "Request body is empty or invalid" },
        { status: 400 }
      );
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "PUT, GET, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return response;
    }

    const response = await prisma.response.update({
      where: { id: String(id) },
      data,
    });

    const jsonResponse = NextResponse.json(response);
    jsonResponse.headers.set("Access-Control-Allow-Origin", "*");
    jsonResponse.headers.set("Access-Control-Allow-Methods", "PUT, GET, OPTIONS");
    jsonResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return jsonResponse;
  } catch (error) {
    const statusCode = 500;
    const errorMessage = error.message || "An unexpected error occurred";
    const requestUrl = req.url;
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" });
    const response = NextResponse.json({ error: errorMessage }, { status: statusCode });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "PUT, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "PUT, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

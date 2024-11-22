import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logError } from "@/lib/utils/logger";
import { z } from "zod";

const ResponseCreateRequestSchema = z
  .object({
    content: z.record(z.unknown()).optional(),
  })
  .strict();

export async function POST(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params;

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
      response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return response;
    }

    let data;
    try {
      data = await req.json();
      ResponseCreateRequestSchema.parse(data);
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
      response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return response;
    }

    const userAgent = req.headers.get("user-agent") || "unknown";
    const ipAddr =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const response = await prisma.response.create({
      data: {
        flowId: String(flowId),
        ip: ipAddr,
        userAgent: userAgent,
        content: data.content,
      },
    });
    flow.numberOfResponses = flow.numberOfResponses ? flow.numberOfResponses : 0;
    await prisma.flow.update({
      where: { id: String(flowId) },
      data: { numberOfResponses: flow.numberOfResponses + 1 },
    });

    const jsonResponse = NextResponse.json(response);
    jsonResponse.headers.set("Access-Control-Allow-Origin", "*");
    jsonResponse.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    jsonResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return jsonResponse;
  } catch (error) {
    const statusCode = 500;
    const errorMessage = error.message || "An unexpected error occurred";
    const requestUrl = req.url;
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" });
    const response = NextResponse.json({ error: errorMessage }, { status: statusCode });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { flowId: string } }
) {
  const { flowId } = params

  try {
    const flow = await prisma.flow.findFirst({
      where: {
        id: String(flowId),
        isDeleted: false,
      },
      include: {
        responses: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!flow) {
      const statusCode = 404
      const errorMessage = "Flow not found"
      const requestUrl = req.url
      await logError({
        statusCode,
        errorMessage,
        requestUrl,
        userId: "unknown",
      })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }
    flow.responses.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
    return NextResponse.json(flow.responses)
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

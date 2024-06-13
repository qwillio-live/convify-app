import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { z } from "zod"

const ResponseUpdateRequestSchema = z
  .object({
    isFinished: z.boolean().optional(),
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
        return NextResponse.json({ error: errorMessage }, { status: statusCode });
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
        return NextResponse.json(
          { error: "Request body is empty or invalid" },
          { status: 400 }
        );
      }
  
      const response = await prisma.response.update({
        where: { id: String(id) },
        data,
      });
  
      if (data.isFinished) {
        await prisma.flow.update({
          where: { id: String(flowId) },
          data: { numberOfResponses: { increment: 1 } },
        });
      }
  
      return NextResponse.json(response);
    } catch (error) {
      const statusCode = 500;
      const errorMessage = error.message || "An unexpected error occurred";
      const requestUrl = req.url;
      await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" });
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  }

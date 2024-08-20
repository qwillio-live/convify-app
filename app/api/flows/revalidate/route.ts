import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    revalidateTag("publishedFlow")
    return NextResponse.json({ revalidated: true })
  } catch (error) {
    console.error(error)

    const statusCode = 500

    return NextResponse.json(
      { error: "Failed to revalidate flow" },
      { status: statusCode }
    )
  }
}

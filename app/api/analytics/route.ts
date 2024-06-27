import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import UAParser from "ua-parser-js"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const flowId = searchParams.get("flowId")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!flowId || !startDate || !endDate) {
    const statusCode = 400
    const errorMessage = "Flow ID, start date, and end date are required"
    const requestUrl = req.url
    await logError({
      statusCode,
      errorMessage,
      requestUrl,
      userId: "unknown",
    })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  try {
    const startDateObj = new Date(startDate as string)
    const endDateObj = new Date(endDate as string)

    const visits = await prisma.visit.findMany({
      where: {
        flowId: String(flowId),
        createdAt: {
          gte: startDateObj,
          lte: endDateObj,
        },
      },
      distinct: ["userAgent", "ip"],
    })
    const totalVisits = visits.length

    const submits = await prisma.response.findMany({
      where: {
        flowId: String(flowId),
        createdAt: {
          gte: startDateObj,
          lte: endDateObj,
        },
      },
    })
    const totalSubmits = submits.length

    const conversionRate =
      totalVisits > 0 ? ((totalSubmits / totalVisits) * 100).toFixed(2) : 0

    let mobileVisits = 0
    let desktopVisits = 0

    visits.forEach((visit) => {
      const ua = new UAParser(visit.userAgent)
      const deviceType = ua.getDevice().type
      if (deviceType === "mobile") {
        mobileVisits++
      } else {
        desktopVisits++
      }
    })

    const mobileDevicePercentage =
      totalVisits > 0 ? ((mobileVisits / totalVisits) * 100).toFixed(2) : 0
    const desktopDevicePercentage =
      totalVisits > 0 ? ((desktopVisits / totalVisits) * 100).toFixed(2) : 0

    const uniqueVisitsPerDate: { [key: string]: number } = {}
    const submitsPerDate: { [key: string]: number } = {}

    visits.forEach((visit) => {
      const date = visit.createdAt.toISOString().split("T")[0]
      if (!uniqueVisitsPerDate[date]) {
        uniqueVisitsPerDate[date] = 0
      }
      uniqueVisitsPerDate[date]++
    })

    submits.forEach((submit) => {
      const date = submit.createdAt.toISOString().split("T")[0]
      if (!submitsPerDate[date]) {
        submitsPerDate[date] = 0
      }
      submitsPerDate[date]++
    })

    const uniqueVisitsArray = Object.keys(uniqueVisitsPerDate).map((date) => ({
      date,
      count: uniqueVisitsPerDate[date],
    }))

    const submitsArray = Object.keys(submitsPerDate).map((date) => ({
      date,
      count: submitsPerDate[date],
    }))

    return NextResponse.json({
      totalVisits,
      totalSubmits,
      conversionRate,
      mobileDevicePercentage,
      desktopDevicePercentage,
      uniqueVisitsArray,
      submitsArray,
    })
  } catch (error) {
    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, requestUrl, userId: "unknown" })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

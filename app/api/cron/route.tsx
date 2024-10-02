import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { cookies } from "next/headers"
import axios from "axios"
import FormData from "form-data"
import { Buffer } from "buffer"
import { revalidateFlow } from "@/actions/flow/revalidateFlow"
import { chromium } from "playwright" // Import Playwright

export async function GET(req: NextRequest) {
  console.log("Entered cron")

  try {
    // const searchParams = req.nextUrl.searchParams
    // const flowId = searchParams.get("flowId")
    // const session = await getServerSession(authOptions)
    // const cookie = cookies().getAll() // Get all cookies from the request
    // if (!session) {
    //   return new Response("Unauthorized", { status: 403 })
    // }
    // console.log("flowId", flowId)
    // const requiredEntitiess = await prisma.flowStep.findMany({
    //   where: {
    //     isDeleted: false,
    //     order: 0,
    //     flowId: flowId ? flowId : "",
    //   },
    // })
    // let requiredEntities =
    //   requiredEntitiess.length > 0 ? requiredEntitiess[0] : null

    // let updatedFlow: any = null
    // const fetchLinksAndTakeScreenshots = async () => {
    //   try {
    //     if (requiredEntities) {
    //       revalidateFlow({ tag: "previewFlow" })
    //       const browser = await chromium.launch() // Launch Playwright browser
    //       const page = await browser.newPage()

    //       // Format cookies to include necessary fields like domain
    //       const formattedCookies = cookie.map((c) => ({
    //         name: c.name,
    //         value: c.value,
    //         domain: process.env.NEXT_PUBLIC_APP_URL?.replace(
    //           "https://",
    //           ""
    //         ).replace("http://", ""),
    //         path: "/",
    //       }))

    //       // Set cookies before navigating to the page
    //       await page.context().addCookies(formattedCookies)
    //       console.log(
    //         "linkkkk",
    //         `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preview-flow/${flowId}?screen=${requiredEntities.name}`
    //       )
    //       await page.goto(
    //         `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preview-flow/${flowId}?screen=${requiredEntities.name}`,
    //         {
    //           waitUntil: "networkidle",
    //         }
    //       )

    //       // Save screenshot as a buffer
    //       const screenshotBuffer = await page.screenshot({
    //         type: "png",
    //         fullPage: true,
    //       })
    //       console.log("Screenshot captured for", requiredEntities.name)

    //       // Ensure the screenshot buffer is correctly handled as a Buffer
    //       const formData = new FormData()
    //       formData.append("image", Buffer.from(screenshotBuffer), {
    //         filename: `${requiredEntities.name}.png`,
    //         contentType: "image/png",
    //       })
    //       formData.append("bucket_name", "convify-images")
    //       formData.append("sizes[0]", "100x100")
    //       formData.append("sizes[1]", "200x200")

    //       try {
    //         const response = await axios.post(
    //           "https://file-uploader.picreel.bid/upload",
    //           formData,
    //           {
    //             headers: {
    //               ...formData.getHeaders(),
    //             },
    //           }
    //         )

    //         console.log(
    //           `Upload successful for ${requiredEntities.name}:`,
    //           response.data.data.images
    //         )
    //         if (flowId && response.data.data?.images?.original)
    //           updatedFlow = await prisma.flow.update({
    //             where: {
    //               id: flowId,
    //             },
    //             data: {
    //               thumbnail_updatedAt: new Date(),
    //               previewImage: response.data.data?.images?.original,
    //             },
    //           })
    //       } catch (uploadError) {
    //         console.error(
    //           `Failed to upload screenshot for ${requiredEntities.name}:`,
    //           uploadError
    //         )
    //       }
    //       await browser.close() // Close Playwright browser
    //     }
    //   } catch (error) {
    //     console.error("Error fetching links or taking screenshots:", error)
    //   }
    // }

    // // Execute screenshot function
    // await fetchLinksAndTakeScreenshots()

    // return NextResponse.json({
    //   flows: updatedFlow ? updatedFlow : requiredEntities?.name ?? "false",
    // })
    return NextResponse.json({ status: true })
  } catch (error) {
    console.error("Error fetching flows:", error)
    const statusCode = 500
    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

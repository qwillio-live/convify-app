import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import puppeteer from "puppeteer"
import { cookies } from "next/headers"
import axios from "axios"
import FormData from "form-data" // Import FormData to handle file upload
import { Buffer } from "buffer" // Import Buffer to work with screenshot data
import { revalidateFlow } from "@/actions/flow/revalidateFlow"

export async function GET(req: NextRequest) {
  console.log("Entered cron")

  try {
    const searchParams = req.nextUrl.searchParams
    const flowId = searchParams.get("flowId")
    const session = await getServerSession(authOptions)
    const cookie = cookies().getAll() // Get all cookies from the request
    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }
    console.log("flowId", flowId)
    const requiredEntitiess = await prisma.flowStep.findMany({
      where: {
        isDeleted: false,
        order: 0,
        flowId: flowId ? flowId : "",
      },
    })
    let requiredEntities =
      requiredEntitiess.length > 0 ? requiredEntitiess[0] : null
    // Function to fetch links from /api/cron and take screenshots
    let updatedFlow = null
    const fetchLinksAndTakeScreenshots = async () => {
      try {
        if (requiredEntities) {
          revalidateFlow({ tag: "previewFlow" })
          const browser = await puppeteer.launch() // Launch Puppeteer

          const page = await browser.newPage()

          // Format cookies to include necessary fields like domain
          const formattedCookies = cookie.map((c) => ({
            name: c.name,
            value: c.value,
            domain: process.env.NEXT_PUBLIC_APP_URL?.replace(
              "https://",
              ""
            ).replace("http://", ""), // Set domain or url
            path: "/",
          }))

          // Set cookies before navigating to the page
          await page.setCookie(...formattedCookies)
          console.log(
            "linkkkk",
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preview-flow/${flowId}?screen=${requiredEntities.name}`
          )
          await page.goto(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/preview-flow/${flowId}?screen=${requiredEntities.name}`,
            {
              waitUntil: "networkidle0",
            }
          ) // Navigate to the link

          // Save screenshot as a buffer
          const screenshotBuffer = await page.screenshot({
            type: "png",
            fullPage: true,
          })
          console.log("Screenshot captured for", requiredEntities.name)

          // Ensure the screenshot buffer is correctly handled as a Buffer
          const formData = new FormData()
          formData.append("image", Buffer.from(screenshotBuffer), {
            filename: `${requiredEntities.name}.png`, // Set the file name
            contentType: "image/png", // Set the content type
          })
          formData.append("bucket_name", "convify-images") // Bucket name
          formData.append("sizes[0]", "100x100")
          formData.append("sizes[1]", "200x200")

          try {
            const response = await axios.post(
              "https://file-uploader.picreel.bid/upload",
              formData,
              {
                headers: {
                  ...formData.getHeaders(), // Ensure to send the correct multipart headers
                },
              }
            )

            console.log(
              `Upload successful for ${requiredEntities.name}:`,
              response.data.data.images
            )
            if (flowId && response.data.data?.images?.original)
              updatedFlow = await prisma.flow.update({
                where: {
                  id: flowId,
                },
                data: {
                  thumbnail_updatedAt: new Date(),
                  previewImage: response.data.data?.images?.original,
                },
              })
          } catch (uploadError) {
            console.error(
              `Failed to upload screenshot for ${requiredEntities.name}:`,
              uploadError
            )
          }
          await browser.close() // Close Puppeteer
        }
      } catch (error) {
        console.error("Error fetching links or taking screenshots:", error)
      }
    }

    // Execute screenshot function
    await fetchLinksAndTakeScreenshots()

    return NextResponse.json({
      flows: updatedFlow ? updatedFlow : requiredEntities.name ?? "false",
    })
  } catch (error) {
    console.error("Error fetching flows:", error)
    const statusCode = 500
    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

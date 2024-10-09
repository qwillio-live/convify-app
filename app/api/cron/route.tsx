import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { cookies } from "next/headers"
import axios from "axios"
import FormData from "form-data"
import { Buffer } from "buffer"
import { revalidateFlow } from "@/actions/flow/revalidateFlow"
// import domtoimage from "dom-to-image-more"
import nodeHtmlToImage from "node-html-to-image" // Import node-html-to-image

export async function GET(req: NextRequest) {
  console.log("Entered cron")

  try {
    const searchParams = req.nextUrl.searchParams
    const flowId = searchParams.get("flowId")
    const session = await getServerSession(authOptions)
    const cookie = cookies().getAll()

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
    let updatedFlow: null | object = null

    const fetchLinksAndTakeScreenshots = async () => {
      try {
        if (requiredEntities) {
          revalidateFlow({ tag: "previewFlow" })

          const url = `${process.env.NEXT_PUBLIC_APP_URL}/cron-preview/${flowId}?screen=${requiredEntities.name}`

          const wrappedHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <style>
                  body {
                      margin: 0;
                      padding: 0;
                      overflow: hidden; /* Prevent overflow */
                  }
                  iframe {
                      border: none; /* Remove border */
                      width: 100vw; /* Full viewport width */
                      height: 100vh; /* Full viewport height */
                  }
              </style>
          </head>
          <body>
              <iframe src="${url}" sandbox="allow-same-origin allow-scripts"></iframe>
          </body>
          </html>
          `

          // Create the image from the wrapped HTML
          const imageBuffer = await nodeHtmlToImage({
            html: wrappedHtml, // Use the wrapped HTML
            quality: 100,
            type: "png",
          })

          console.log("Screenshot captured for", requiredEntities.name)
          console.log("Screenshot captured for", requiredEntities.name)
          console.log("buffer", imageBuffer)
          const formData = new FormData()
          // Directly pass imageBuffer since it's already a Buffer
          formData.append("image", imageBuffer, {
            filename: `${requiredEntities.name}.png`,
            contentType: "image/png",
          })
          formData.append("bucket_name", "convify-images")
          formData.append("sizes[0]", "100x100")
          formData.append("sizes[1]", "200x200")

          try {
            const uploadResponse = await axios.post(
              "https://file-uploader.picreel.bid/upload",
              formData,
              {
                headers: formData.getHeaders(),
              }
            )

            console.log(
              `Upload successful for ${requiredEntities.name}:`,
              uploadResponse.data.data.images
            )

            if (flowId && uploadResponse.data.data?.images?.original) {
              updatedFlow = await prisma.flow.update({
                where: {
                  id: flowId,
                },
                data: {
                  thumbnail_updatedAt: new Date(),
                  previewImage: uploadResponse.data.data?.images?.original,
                },
              })
            }
          } catch (uploadError) {
            console.error(
              `Failed to upload screenshot for ${requiredEntities.name}:`,
              uploadError
            )
          }
        }
      } catch (error) {
        console.error("Error fetching links or taking screenshots:", error)
      }
    }

    await fetchLinksAndTakeScreenshots()

    return NextResponse.json({
      flows: updatedFlow ? updatedFlow : requiredEntities?.name ?? "false",
    })
  } catch (error) {
    console.error("Error fetching flows:", error)
    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: 500 }
    )
  }
}

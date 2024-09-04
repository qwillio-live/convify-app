import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { logError } from "@/lib/utils/logger"
import { authOptions } from "@/lib/auth"
import footerScreenData from "@/components/user/screens/screen-footer.json"
import headerScreenData from "@/components/user/screens/screen-header.json"

// Helper function to generate random letters
const generateRandomLetters = (length: number) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
// Function to generate a unique published name
const generateUniqueName = async (baseName: string) => {
  let uniqueName = baseName
  let isUnique = await checkPublishedNameExists(uniqueName)

  // Generate a unique publishedName if needed
  while (!isUnique) {
    const randomSuffix = generateRandomLetters(6) // Append 6 random characters
    uniqueName = `${baseName}-${randomSuffix}`
    isUnique = await checkPublishedNameExists(uniqueName)
  }

  return uniqueName
}

// Function to check if the published name exists
const checkPublishedNameExists = async (publishedName: string) => {
  try {
    const count = await prisma.flow.count({
      where: {
        publishedName,
      },
    })
    return count === 0
  } catch (error) {
    console.error("Error checking published name existence:", error)
    return false
  }
}
export async function GET(req: NextRequest) {
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
    const flows = await prisma.flow.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(flows)
  } catch (error) {
    console.error(error)

    const statusCode = 500
    await logError({
      statusCode: statusCode,
      errorMessage: error.message || "An unexpected error occurred",
      userId,
      requestUrl: req.url || "unknown",
    })

    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: statusCode }
    )
  }
}

export async function POST(req: NextRequest) {
  const flowDomain = process.env.NEXT_PUBLIC_FLOW_DOMAIN || ""
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
  const userEmail = data.user.email

  let reqBody
  try {
    reqBody = await req.json()
  } catch (error) {
    await logError({
      statusCode: 400,
      errorMessage: "Request body is empty",
      userId,
      requestUrl: req.url,
    })
    return NextResponse.json(
      { error: "Request body is empty" },
      { status: 400 }
    )
  }
  console.log(reqBody)
  const { templateId, status, previewImage, link, name, flowSettings } = reqBody

  if (!templateId) {
    const statusCode = 400
    const errorMessage = "Template ID is required"
    const requestUrl = req.url
    await logError({ statusCode, errorMessage, userId, requestUrl })
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      const statusCode = 404
      const errorMessage = "Template not found"
      const requestUrl = req.url
      await logError({ statusCode, errorMessage, userId, requestUrl })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const templateSteps = await prisma.templateStep.findMany({
      where: {
        templateId: template.id,
      },
    })
    let sortedSteps = templateSteps.sort((a, b) => a.order - b.order)
    let uniqueName = await generateUniqueName(name || template.name)
    const flow = await prisma.flow.create({
      data: {
        templateId: template.id,
        name: name || template.name,
        flowSettings: flowSettings || template.templateSettings,
        status: status || "active",
        previewImage: previewImage || template.preview,
        link:
          sortedSteps.length > 0
            ? `${flowDomain}/${uniqueName}?screen=${sortedSteps[0].name}`
            : `${flowDomain}/${uniqueName}`,
        numberOfSteps: templateSteps.length === 0 ? 1 : templateSteps.length,
        numberOfResponses: 0,
        userId,
        headerData: JSON.stringify(headerScreenData),
        footerData: JSON.stringify(footerScreenData),
        thumbnail_updatedAt: new Date(),
      },
    })
    const flowId = flow.id
    if (templateSteps.length > 0) {
      console.log("template steps eetered", templateSteps.length)
      const flowSteps = templateSteps.map((step) => ({
        flowId,
        name: step.name,
        link: step.link || "",
        content: step.content || {},
        order: step.order,
      }))
      await prisma.flowStep.createMany({
        data: flowSteps,
      })
    } else {
      await prisma.flowStep.create({
        data: {
          flowId,
          name: "one",
          link: "",
          content: {
            ROOT: {
              type: "UserContainer",
              nodes: ["fxUOaKZg8l", "rlca7E5r-5", "pJuarHFYBL", "4Wzqo77fQZ"],
              props: {
                padding: 5,
                expanded: "true",
                className:
                  "min-h-[400px] min-w-full flex flex-col items-center py-5 new-screens",
                background: "transparent",
              },
              custom: {},
              hidden: false,
              isCanvas: true,
              displayName: "New Screen",
              linkedNodes: {},
            },
            "4Wzqo77fQZ": {
              type: {
                resolvedName: "Select",
              },
              nodes: [],
              props: {
                size: "medium",
                label: "Select2",
                width: "small",
                border: 2,
                height: 50,
                disabled: false,
                required: false,
                tracking: false,
                fieldName: "select-bbac00",
                fullWidth: true,
                marginTop: 20,
                fontFamily: {
                  value: "--font-poppins",
                  globalStyled: true,
                  isCustomized: false,
                },
                labelColor: "#292929",
                marginLeft: 0,
                paddingTop: "20",
                borderColor: {
                  value: "#eaeaeb",
                  globalStyled: false,
                  isCustomized: false,
                },
                marginRight: 0,
                paddingLeft: "16",
                placeholder: "Please select an option",
                settingsTab: ["c", "o", "n", "t", "e", "n", "t", "spacing"],
                marginBottom: 20,
                paddingRight: "16",
                paddingBottom: "20",
                selectOptions: [
                  {
                    id: "select-option-item-2200",
                    value: "Option 1",
                  },
                  {
                    id: "select-option-item-3800",
                    value: "Option 2",
                  },
                  {
                    id: "select-option-item-9a00",
                    value: "Option 3",
                  },
                ],
                trackingEvent: "select-6ff500",
                borderHoverColor: {
                  value: "#13aa1d",
                  globalStyled: true,
                  isCustomized: false,
                },
                sortAlphabetically: false,
                containerBackground: "transparent",
                selectedOptionTextColor: "#ffffff",
                selectedOptionBackgroundColor: {
                  value: "#13aa1d",
                  globalStyled: true,
                  isCustomized: false,
                },
              },
              custom: {},
              hidden: false,
              parent: "ROOT",
              isCanvas: false,
              displayName: "Select",
              linkedNodes: {},
            },
            fxUOaKZg8l: {
              type: {
                resolvedName: "HeadlineText",
              },
              nodes: [],
              props: {
                text: "Headlines for your business",
                tagType: "h1",
                fontSize: {
                  value: 42,
                  globalStyled: false,
                  isCustomized: false,
                },
                marginTop: {
                  value: 0,
                  globalStyled: false,
                  isCustomized: false,
                },
                textAlign: {
                  value: "left",
                  globalStyled: false,
                  isCustomized: false,
                },
                textColor: {
                  value: "#292929",
                  globalStyled: false,
                  isCustomized: false,
                },
                fontFamily: {
                  value: "--font-poppins",
                  globalStyled: false,
                  isCustomized: false,
                },
                fontWeight: {
                  value: "600",
                  globalStyled: false,
                  isCustomized: false,
                },
                marginLeft: {
                  value: 0,
                  globalStyled: false,
                  isCustomized: false,
                },
                marginRight: {
                  value: 0,
                  globalStyled: false,
                  isCustomized: false,
                },
                marginBottom: {
                  value: 0,
                  globalStyled: false,
                  isCustomized: false,
                },
              },
              custom: {},
              hidden: false,
              parent: "ROOT",
              isCanvas: false,
              displayName: "HeadlineText",
              linkedNodes: {},
            },
            pJuarHFYBL: {
              type: {
                resolvedName: "IconButton",
              },
              nodes: [],
              props: {
                gap: 4,
                icon: "aperture",
                size: "medium",
                text: "Continue",
                color: {
                  value: "#ffffff",
                  globalStyled: false,
                  isCustomized: true,
                },
                width: "medium",
                border: 2,
                height: "auto",
                preset: "filled",
                radius: {
                  value: "8",
                  globalStyled: false,
                  isCustomized: false,
                },
                disabled: false,
                tracking: false,
                fullWidth: true,
                marginTop: 20,
                alignItems: "center",
                background: {
                  value: "#13aa1d",
                  globalStyled: true,
                  isCustomized: false,
                },
                buttonSize: "medium",
                colorHover: {
                  value: "#ffffff",
                  globalStyled: false,
                  isCustomized: true,
                },
                enableIcon: true,
                fontFamily: {
                  value: "--font-poppins",
                  globalStyled: true,
                  isCustomized: false,
                },
                marginLeft: 0,
                nextScreen: {
                  screenId: "clygvxu1f002z13b1xakyonpi",
                  screenName: "one",
                },
                paddingTop: "14",
                borderColor: {
                  value: "#13aa1d",
                  globalStyled: true,
                  isCustomized: false,
                },
                marginRight: 0,
                paddingLeft: "16",
                settingsTab: "content",
                buttonAction: "next-screen",
                marginBottom: 20,
                paddingRight: "16",
                flexDirection: "row",
                paddingBottom: "14",
                trackingEvent: "button-ce6d00",
                justifyContent: "space-between",
                backgroundHover: {
                  value: "#119c1b",
                  globalStyled: true,
                  isCustomized: false,
                },
                borderHoverColor: {
                  value: "#13aa1d",
                  globalStyled: true,
                  isCustomized: false,
                },
                containerBackground: "rgba(255,255,255,0)",
              },
              custom: {},
              hidden: false,
              parent: "ROOT",
              isCanvas: false,
              displayName: "IconButton",
              linkedNodes: {},
            },
            "rlca7E5r-5": {
              type: {
                resolvedName: "UserText",
              },
              nodes: [],
              props: {
                text: "Your text here",
                tagType: "p",
                fontSize: 24,
                fullWidth: true,
                marginTop: 0,
                textAlign: "center",
                textColor: "#504a54",
                fontFamily: "--font-roboto",
                fontWeight: "400",
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
              },
              custom: {},
              hidden: false,
              parent: "ROOT",
              isCanvas: false,
              displayName: "UserText",
              linkedNodes: {},
            },
          },
          order: 1,
          isDeleted: false,
          templateId: template.id,
        },
      })
    }

    await prisma.integration.create({
      data: {
        flowId: flow.id,
        email: userEmail,
      },
    })
    return NextResponse.json({ id: flow.id })
  } catch (error) {
    console.error(error)

    const statusCode = 500
    const errorMessage = error.message || "An unexpected error occurred"
    const requestUrl = req.url
    await logError({
      statusCode,
      errorMessage,
      userId,
      requestUrl,
    })

    return NextResponse.json(
      { error: "Failed to create a flow" },
      { status: statusCode }
    )
  }
}

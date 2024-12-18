"use client"

import { useState, useEffect } from "react"
import { LocalIcons } from "@/public/icons"
import { TIntegrationCardData } from "@/types"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { usePathname } from "next/navigation"

type HandleStatusUpdateFunction = (newStatus: string) => void

const extractFlowIdFromUrl = () => {
  const url = window.location.pathname // Get the current URL path
  const match = url.match(/dashboard\/([^\/]+)\/connect/) // Use regex to match the flowId
  if (match && match[1] && match[1] !== "flows") {
    return match[1]
  }
  return "flows"
}
interface ContentProps {
  handleStatusUpdate: HandleStatusUpdateFunction
  status: string
  userEmail: string
  flowData: any
  setEffectCall: any
}
interface User {
  name: string
  email: string
  image: string
  id: string
}

export const EmailContent: React.FC<ContentProps> = ({
  handleStatusUpdate,
  status,
  flowData,
  setEffectCall,
}) => {
  const [email, setEmail] = useState<string>(
    flowData.email ? flowData.email : ""
  )
  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl())
  const [integrationId, setIntegrationId] = useState<string>(
    flowData.id ? flowData.id : ""
  )
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)
  const t = useTranslations("CreateFlow.ConnectPage")
  const [isLoader, setIsLoader] = useState<boolean>(false)

  const putRequest = (email: string, flowId: string, integrationId: string) => {
    if (integrationId !== "") {
      fetch(`/api/flows/${flowId}/integrations/${integrationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `${email}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setEmail(data.email)
          setEffectCall("email")
          if (
            data.email === "" ||
            data.email === null ||
            data.email === undefined
          ) {
            handleStatusUpdate("inactive")
          } else {
            handleStatusUpdate("active")
          }
        })
        .catch((error) => console.error("Error fetching user data:", error))
        .finally(() => setIsLoader(false))
    }
  }

  // Check if the URL contains "pt" for Portuguese
  useEffect(() => {
    setIsPortuguese(window.location.href.includes("/pt"))

    // Set initial window size
    setIsSmallScreen(window.innerWidth < 400)

    if (flowId === "flows") {
      // Fetch user data
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          setEmail(data.email)
        })
        .catch((error) => console.error("Error fetching user data:", error))
    }

    // Handle window resize
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
    } else {
      handleStatusUpdate("active")
    }
  }

  const buttonStyle =
    (isPortuguese && isSmallScreen) || window.innerWidth < 370
      ? { fontSize: "11px" }
      : {}

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <Input
          placeholder={t("Enter your email")}
          id="email"
          onChange={handleInputChange}
          value={email}
        />
      </div>
      <p className="mb-4 mt-1.5 text-[#9B9A99] text-xs md:text-sm">
        {t("Email address to which the response is sent")}
      </p>
      <div className="flex w-full justify-between">
        <AccordionPrimitive.Trigger>
          <Button
            variant="secondary"
            className="bg-[#F2F2F2] font-normal text-[#23262C] text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
            style={buttonStyle}
          >
            {t("Close")}
          </Button>
        </AccordionPrimitive.Trigger>
        <div>
          {status !== "active" ? (
            <Button
              disabled={!email?.trim()}
              onClick={() => {
                putRequest(email, flowId ?? "", integrationId ?? "")
                handleClick()
                setIsLoader(true) // Show loader
              }}
              style={buttonStyle}
              className="font-normal text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
            >
              {isLoader && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {t("Connect")}
            </Button>
          ) : (
            <div className={`flex ${isSmallScreen ? "gap-0" : "gap-1.5"}`}>
              <Button
                variant="ghost"
                className="font-normal text-[#CF2B24] hover:bg-red-100 hover:text-red-500 text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
                onClick={() => {
                  handleClick()
                  putRequest("", flowId ?? "", integrationId ?? "")
                }}
                style={buttonStyle}
              >
                {t("Disconnect")}
              </Button>
              <Button
                className="hidden font-normal text-white md:block text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
                style={buttonStyle}
                onClick={() => {
                  putRequest(email, flowId ?? "", integrationId ?? "")
                }}
              >
                {t("Save changes")}
              </Button>
              <Button
                className="block font-normal text-white md:hidden text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
                style={buttonStyle}
                onClick={() => {
                  putRequest(email, flowId ?? "", integrationId ?? "")
                }}
              >
                {t("Save")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const GAnalytics: React.FC<ContentProps> = ({
  handleStatusUpdate,
  status,
  flowData,
  setEffectCall,
}) => {
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")
  // const currentPath = usePathname()
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>(
    flowData.googleAnalyticsId ? flowData.googleAnalyticsId : ""
  )
  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl())
  const [integrationId, setIntegrationId] = useState<string>(
    flowData.id ? flowData.id : ""
  )

  const putRequest = (
    googleAnalyticsId: string,
    flowId: string,
    integrationId: string
  ) => {
    fetch(`/api/flows/${flowId}/integrations/${integrationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleAnalyticsId: `${googleAnalyticsId?.trim()}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoogleAnalyticsId(data.googleAnalyticsId)
        setEffectCall("googleAnalytics")
        if (
          data.googleAnalyticsId === "" ||
          data.googleAnalyticsId === null ||
          data.googleAnalyticsId === undefined
        ) {
          handleStatusUpdate("inactive")
        } else {
          handleStatusUpdate("active")
        }
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoader(false))
  }

  useEffect(() => {
    setIsPortuguese(window.location.href.includes("/pt"))
    setIsSmallScreen(window.innerWidth < 400)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleAnalyticsId(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
    } else {
      handleStatusUpdate("active")
    }
  }

  const buttonStyle =
    (isPortuguese && isSmallScreen) || window.innerWidth < 370
      ? { fontSize: "11px" }
      : {}
  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-left text-[#505050]">
          {t(
            "Changes to the Google Analytics 4 integration will only become active after re-publishing"
          )}
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="">
              <label
                className="mb-1.5 block text-black"
                htmlFor="measurement-id"
              >
                {t("Measurement ID")}
              </label>
              <Input
                placeholder="G-XXXXXXXXXX"
                id="measurement-id"
                onChange={handleInputChange}
                value={googleAnalyticsId}
              />
            </div>
            <p className="mt-1.5 text-left text-[#9B9A99] text-xs md:text-sm">
              {t("Copy and paste your Google Analytics 4 Measurement ID here")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button
              variant="secondary"
              className="bg-[#F2F2F2] font-normal text-[#23262C] text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
              style={buttonStyle}
            >
              {t("Close")}
            </Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!googleAnalyticsId?.trim() || isLoader}
                onClick={() => {
                  putRequest(
                    googleAnalyticsId,
                    flowId ?? "",
                    integrationId ?? ""
                  )
                  handleClick()
                  setIsLoader(true) // Show loader
                }}
                style={buttonStyle}
                className="font-normal text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
              >
                {isLoader && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("Connect")}
              </Button>
            ) : (
              <div className={`flex ${isSmallScreen ? "gap-0" : "gap-1.5"}`}>
                <Button
                  variant="ghost"
                  style={buttonStyle}
                  className="text-[12px] font-normal text-[#CF2B24] hover:bg-red-100 hover:text-red-500 md:text-[14px]"
                  onClick={() => {
                    handleClick()
                    putRequest("", flowId ?? "", integrationId ?? "")
                  }}
                >
                  {t("Disconnect")}
                </Button>
                <Button
                  style={buttonStyle}
                  className="text-[12px] md:text-[14px] font-normal"
                  onClick={() => {
                    putRequest(
                      googleAnalyticsId,
                      flowId ?? "",
                      integrationId ?? ""
                    )
                  }}
                >
                  {t("Save changes")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const GTagManager: React.FC<ContentProps> = ({
  handleStatusUpdate,
  status,
  flowData,
  setEffectCall,
}) => {
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")
  const [googleTagManagerId, setGoogleTagManagerId] = useState<string>(
    flowData.googleTagManagerId ? flowData.googleTagManagerId : ""
  )

  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl())
  const [integrationId, setIntegrationId] = useState<string>(
    flowData.id ? flowData.id : ""
  )

  const putRequest = (
    googleTagManagerId: string,
    flowId: string,
    integrationId: string
  ) => {
    fetch(`/api/flows/${flowId}/integrations/${integrationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleTagManagerId: `${googleTagManagerId?.trim()}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoogleTagManagerId(data.googleTagManagerId)
        setEffectCall("googleTagManager")
        if (
          data.googleTagManagerId === "" ||
          data.googleTagManagerId === null ||
          data.googleTagManagerId === undefined
        ) {
          handleStatusUpdate("inactive")
        } else {
          handleStatusUpdate("active")
        }
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoader(false))
  }
  useEffect(() => {
    setIsPortuguese(window.location.href.includes("/pt"))
    setIsSmallScreen(window.innerWidth < 400)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleTagManagerId(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
    } else {
      handleStatusUpdate("active")
    }
  }
  const buttonStyle =
    (isPortuguese && isSmallScreen) || window.innerWidth < 370
      ? { fontSize: "11px" }
      : {}

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-left text-sm text-[#505050]">
          {t(
            "Changes to the Google Tag Manager integration will only become active after re-publishing"
          )}
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="">
              <label className="mb-1.5 block text-black" htmlFor="container-id">
                {t("Container ID")}
              </label>
              <Input
                placeholder="GTM-XXXXXX"
                id="container-id"
                onChange={handleInputChange}
                value={googleTagManagerId}
              />
            </div>
            <p className="mt-1.5 text-left text-[#9B9A99] text-xs md:text-sm">
              {t("Copy and paste your Google Analytics 4 Measurement ID here")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button
              variant="secondary"
              className="bg-[#F2F2F2] font-normal text-[#23262C] text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
              style={buttonStyle}
            >
              {t("Close")}
            </Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!googleTagManagerId?.trim() || isLoader}
                onClick={() => {
                  putRequest(
                    googleTagManagerId,
                    flowId ?? "",
                    integrationId ?? ""
                  )
                  handleClick()
                  setIsLoader(true) // Show loader
                }}
                style={buttonStyle}
                className="font-normal text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
              >
                {isLoader && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("Connect")}
              </Button>
            ) : (
              <div className={`flex ${isSmallScreen ? "gap-0" : "gap-1.5"}`}>
                <Button
                  variant="ghost"
                  className="text-[12px] font-normal text-[#CF2B24] hover:bg-red-100 hover:text-red-500 md:text-[14px]"
                  onClick={() => {
                    handleClick()
                    putRequest("", flowId ?? "", integrationId ?? "")
                  }}
                  style={buttonStyle}
                >
                  {t("Disconnect")}
                </Button>
                <Button
                  style={buttonStyle}
                  className="text-[12px] md:text-[14px] font-normal"
                  onClick={() =>
                    putRequest(
                      googleTagManagerId,
                      flowId ?? "",
                      integrationId ?? ""
                    )
                  }
                >
                  {t("Save changes")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const MetaPixel: React.FC<ContentProps> = ({
  handleStatusUpdate,
  status,
  flowData,
  setEffectCall,
}) => {
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")

  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl())
  const [integrationId, setIntegrationId] = useState<string>(
    flowData.id ? flowData.id : ""
  )
  const [metaPixelAccessToken, setMetaPixelAccessToken] = useState<string>(
    flowData.metaPixelAccessToken ? flowData.metaPixelAccessToken : ""
  )
  const [metaPixelId, setMetaPixelId] = useState<string>(
    flowData.metaPixelId ? flowData.metaPixelId : ""
  )

  const putRequest = (
    metaPixelAccessToken: string,
    metaPixelId: string,
    flowId: string,
    integrationId: string
  ) => {
    fetch(`/api/flows/${flowId}/integrations/${integrationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metaPixelAccessToken: `${metaPixelAccessToken}`,
        metaPixelId: `${metaPixelId}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMetaPixelAccessToken(data.metaPixelAccessToken)
        setMetaPixelId(data.metaPixelId)
        setEffectCall("metaPixel")
        if (
          data.metaPixelId === "" ||
          data.metaPixelId === null ||
          data.metaPixelId === undefined
        ) {
          handleStatusUpdate("inactive")
        } else {
          handleStatusUpdate("active")
        }
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoader(false))
  }
  useEffect(() => {
    setIsPortuguese(window.location.href.includes("/pt"))
    setIsSmallScreen(window.innerWidth < 400)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
    } else {
      handleStatusUpdate("active")
    }
  }
  const buttonStyle =
    (isPortuguese && isSmallScreen) || window.innerWidth < 370
      ? { fontSize: "11px" }
      : {}

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-left text-sm text-gray-800">
          {t(
            "Changes to the Meta Pixel integration will only become active after re-publishing"
          )}
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="mb-4">
              <label className="mb-1.5 block text-black" htmlFor="pixel-id">
                {t("Pixel ID")}
              </label>
              <Input
                placeholder="124970192730929"
                id="pixel-id"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMetaPixelId(event.target.value)
                }}
                value={metaPixelId}
              />
            </div>
            <div className="">
              <label className="mb-1.5 block text-black" htmlFor="event">
                {t("Submit Event")}
              </label>
              <Input
                placeholder={t("CompleteRegistration")}
                id="event"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMetaPixelAccessToken(event.target.value)
                }}
                value={metaPixelAccessToken}
              />
            </div>
            <p className="mt-1.5 text-left text-[#9B9A99] text-xs md:text-sm">
              {t("Copy and paste your Google Analytics 4 Measurement ID here")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button
              variant="secondary"
              className="bg-[#F2F2F2] font-normal text-[#23262C] text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
              style={buttonStyle}
            >
              {t("Close")}
            </Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!metaPixelId?.trim() || isLoader}
                onClick={() => {
                  putRequest(
                    metaPixelAccessToken,
                    metaPixelId,
                    flowId ?? "",
                    integrationId ?? ""
                  )
                  handleClick()
                  setIsLoader(true) // Show loader
                }}
                style={buttonStyle}
                className="font-normal text-xs md:text-sm h-[35px] md:h-[40px] px-3 md:px-4"
              >
                {isLoader && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("Connect")}
              </Button>
            ) : (
              <div className={`flex ${isSmallScreen ? "gap-0" : "gap-1.5"}`}>
                <Button
                  variant="ghost"
                  className="text-[12px] font-normal text-[#CF2B24] hover:bg-red-100 hover:text-red-500 md:text-[14px]"
                  onClick={() => {
                    handleClick()
                    putRequest("", "", flowId ?? "", integrationId ?? "")
                  }}
                  style={buttonStyle}
                >
                  {t("Disconnect")}
                </Button>
                <Button
                  style={buttonStyle}
                  className="text-[12px] md:text-[14px] font-normal"
                  onClick={() => {
                    putRequest(
                      metaPixelAccessToken,
                      metaPixelId,
                      flowId ?? "",
                      integrationId ?? ""
                    )
                  }}
                >
                  {t("Save changes")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const DummyIntregationCardData: TIntegrationCardData[] = [
  {
    id: 1,
    title: "Email",
    description: "email des",
    image: LocalIcons.email,
    status: "active",
    alt: "intregation option",
    Content: EmailContent,
  },
  {
    id: 2,
    title: "Google Analytics 4",
    description: "google analytics des",
    image: LocalIcons.googleAnalytics,
    status: "inactive",
    alt: "google analytics 4",
    Content: GAnalytics,
  },
  {
    id: 3,
    title: "Google Tag Manager",
    description: "google tag manager des",
    image: LocalIcons.googleTagManager,
    status: "inactive",
    alt: "google tag manager",
    Content: GTagManager,
  },
  {
    id: 4,
    title: "Meta Pixel",
    description: "meta pixel des",
    image: LocalIcons.metaPixel,
    status: "inactive",
    alt: "meta pixel",
    Content: MetaPixel,
  },
]

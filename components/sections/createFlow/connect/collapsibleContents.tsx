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
  const url = window.location.pathname; // Get the current URL path
  const match = url.match(/dashboard\/([^\/]+)\/connect/); // Use regex to match the flowId
  if (match && match[1] && match[1] !== "flows") {
    return match[1];
  }
  return null;
};
interface ContentProps {
  handleStatusUpdate: HandleStatusUpdateFunction
  status: string
  userEmail: string
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
}) => {
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)
  const t = useTranslations("CreateFlow.ConnectPage")
  const currentPath = usePathname()
  const [flowId, setFlowId] = useState<string | null>(null);
  const [req, setReq] = useState<boolean>(false)
  useEffect(() => {
    const extractFlowIdFromUrl = async () => {
      const url = currentPath; // Get the current URL
      const match = url && url.match(/dashboard\/([^\/]+)\/connect/); // Use regex to match the flowId
      if (match && match[1] && match[1] !== "flows") {
        setFlowId(match[1]);
        setReq(!req)
      } else if (match && match[1] === "flows") {
        setFlowId(null)
      }
    };
    extractFlowIdFromUrl();
  }, []);

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setEmail(data.email)
        })
        .catch((error) => console.error("Error fetching user data:", error))
        .finally(() => setIsLoading(false))
    }
  }, [req])

  const putRequest = (email: string) => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": `${email}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => setReq(!req))
        .catch((error) => console.error("Error fetching user data:", error))
        .finally(() => setIsLoading(false))
    }
  }

  // Check if the URL contains "pt" for Portuguese
  useEffect(() => {
    setIsPortuguese(window.location.href.includes('/pt'))

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
        .finally(() => setIsLoading(false))
    }


    // Handle window resize
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
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
      setReq(!req)
    }
  }

  if (isLoading) {
    return null  // Render nothing while loading
  }

  const buttonStyle = isPortuguese && isSmallScreen ? { fontSize: '12px' } : {}


  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <Input
          placeholder="Enter your email"
          id="email"
          onChange={handleInputChange}
          value={email}
        />
      </div>
      <p className="mt-0.5 mb-4 text-xs text-gray-600">
        {t("Email address to which the response is sent")}
      </p>
      <div className="flex w-full justify-between">
        <AccordionPrimitive.Trigger>
          <Button variant="secondary" style={buttonStyle}>{t("Close")}</Button>
        </AccordionPrimitive.Trigger>
        <div>
          {status !== "active" ? (
            <Button disabled={!email.trim()} onClick={handleClick} style={buttonStyle}>
              {t("Connect")}
            </Button>
          ) : (
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                className="text-red-500 hover:bg-red-100 hover:text-red-500"
                onClick={handleClick}
                style={buttonStyle}
              >
                {t("Disconnect")}
              </Button>
              <Button style={buttonStyle} onClick={() => { putRequest(email) }}>{t("Save changes")}</Button>
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
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")
  // const currentPath = usePathname()
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>("")
  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl());

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setGoogleAnalyticsId(data.googleAnalyticsId)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error)
          setIsLoading(false)
        })
    }
  }, [])

  const putRequest = (googleAnalyticsId: string, flowId: string) => {
    fetch(`/api/flows/${flowId}/integrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "googleAnalyticsId": `${googleAnalyticsId?.trim()}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoogleAnalyticsId(data.googleAnalyticsId)
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    setIsPortuguese(window.location.href.includes('/pt'))
    setIsSmallScreen(window.innerWidth < 400)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
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
      putRequest("", flowId ?? "")
    }
  }
  if (isLoading) {
    return null  // Render nothing while loading
  }
  const buttonStyle = isPortuguese && isSmallScreen ? { fontSize: '12px' } : {}
  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-sm text-gray-800 text-justify">
          {t(
            "Changes to the Google Analytics 4 integration will only become active after re-publishing"
          )}
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="">
              <label className="text-black" htmlFor="measurement-id">
                {t("Measurement ID")}
              </label>
              <Input
                placeholder="G-XXXXXXXXXX"
                id="measurement-id"
                onChange={handleInputChange}
                value={googleAnalyticsId}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-600 text-justify">
              {t("Copy and paste your Google Analytics 4 Measurement ID here")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button variant="secondary" style={buttonStyle}>{t("Close")}</Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!googleAnalyticsId?.trim() || isLoader}
                onClick={
                  () => {
                    putRequest(googleAnalyticsId, flowId ?? "")
                    handleClick()
                    setIsLoader(true) // Show loader
                  }}
                style={buttonStyle}
              >
                {isLoader && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("Connect")}
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={handleClick}
                  style={buttonStyle}
                >
                  {t("Disconnect")}
                </Button>
                <Button style={buttonStyle} onClick={() => {
                  putRequest(googleAnalyticsId, flowId ?? "")
                }}>{t("Save changes")}</Button>
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
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")
  const [googleTagManagerId, setGoogleTagManagerId] = useState<string>("")

  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl());

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setGoogleTagManagerId(data.googleTagManagerId)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching user data:", error)
          setIsLoading(false)
        })
    }
  }, [])

  const putRequest = (googleTagManagerId: string, flowId: string) => {
    fetch(`/api/flows/${flowId}/integrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "googleTagManagerId": `${googleTagManagerId?.trim()}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGoogleTagManagerId(data.googleTagManagerId)

      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    setIsPortuguese(window.location.href.includes('/pt'))
    setIsSmallScreen(window.innerWidth < 400)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
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
      putRequest("", flowId ?? "")
    }
  }
  if (isLoading) {
    return null  // Render nothing while loading
  }
  const buttonStyle = isPortuguese && isSmallScreen ? { fontSize: '12px' } : {}

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-sm text-gray-800 text-justify">
          {t(
            "Changes to the Google Tag Manager integration will only become active after re-publishing"
          )}
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="">
              <label className="text-black" htmlFor="container-id">
                {t("Container ID")}
              </label>
              <Input
                placeholder="GTM-XXXXXX"
                id="container-id"
                onChange={handleInputChange}
                value={googleTagManagerId}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-600 text-justify">
              {t("Copy and paste your Google Analytics 4 Measurement ID here")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button variant="secondary" style={buttonStyle}>{t("Close")}</Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!googleTagManagerId?.trim() || isLoader}
                onClick={
                  () => {
                    putRequest(googleTagManagerId, flowId ?? "")
                    handleClick()
                    setIsLoader(true) // Show loader
                  }}
                style={buttonStyle}
              >
                {isLoader && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("Connect")}
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={handleClick}
                  style={buttonStyle}
                >
                  {t("Disconnect")}
                </Button>
                <Button style={buttonStyle} onClick={() => putRequest(googleTagManagerId, flowId ?? "")}>{t("Save changes")}</Button>
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
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoader, setIsLoader] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")

  const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl());
  const [metaPixelAccessToken, setMetaPixelAccessToken] = useState<string>("")
  const [metaPixelId, setMetaPixelId] = useState<string>("")

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMetaPixelAccessToken(data.metaPixelAccessToken)
          setMetaPixelId(data.metaPixelId)
        })
        .catch((error) => {
          console.error("Error fetching user data:", error)
          setIsLoading(false)
        })
    }
  }, [])

  const putRequest = (metaPixelAccessToken: string, metaPixelId: string, flowId: string) => {
    fetch(`/api/flows/${flowId}/integrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "metaPixelAccessToken": `${metaPixelAccessToken}`,
        "metaPixelId": `${metaPixelId}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMetaPixelAccessToken(data.metaPixelAccessToken)
        setMetaPixelId(data.metaPixelId)
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    setIsPortuguese(window.location.href.includes('/pt'))
    setIsSmallScreen(window.innerWidth < 400)

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
    } else {
      handleStatusUpdate("active")
      putRequest("", "", flowId ?? "")
    }
  }

  if (isLoading) {
    return null  // Render nothing while loading
  }
  const buttonStyle = isPortuguese && isSmallScreen ? { fontSize: '12px' } : {}

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-sm text-gray-800 text-justify">
          {t(
            "Changes to the Meta Pixel integration will only become active after re-publishing"
          )}
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="mb-4">
              <label className="text-black" htmlFor="pixel-id">
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
              <label className="text-black" htmlFor="event">
                {t("Submit Event")}
              </label>
              <Input
                placeholder="CompleteRegistration"
                id="event"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMetaPixelAccessToken(event.target.value)
                }}
                value={metaPixelAccessToken}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-600 text-justify">
              {t("Copy and paste your Google Analytics 4 Measurement ID here")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button variant="secondary" style={buttonStyle}>{t("Close")}</Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!metaPixelId?.trim() || isLoader}
                onClick={() => {
                  putRequest(metaPixelAccessToken, metaPixelId, flowId ?? "")
                  handleClick()
                  setIsLoader(true) // Show loader
                }}
                style={buttonStyle}
              >
                {isLoader && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("Connect")}
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={handleClick}
                  style={buttonStyle}
                >
                  {t("Disconnect")}
                </Button>
                <Button style={buttonStyle} onClick={() => {
                  putRequest(metaPixelAccessToken, metaPixelId, flowId ?? "")
                }}>{t("Save changes")}</Button>
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

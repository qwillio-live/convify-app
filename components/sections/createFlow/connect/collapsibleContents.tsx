"use client"

import { useState, useEffect } from "react"
import { LocalIcons } from "@/public/icons"
import { TIntegrationCardData } from "@/types"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

type HandleStatusUpdateFunction = (newStatus: string) => void

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
  const [userData, setUserData] = useState<User>()
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)
  const t = useTranslations("CreateFlow.ConnectPage")

  useEffect(() => {
    // Check if the URL contains "pt" for Portuguese
    setIsPortuguese(window.location.href.includes('/pt'))

    // Set initial window size
    setIsSmallScreen(window.innerWidth < 400)

    // Fetch user data
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUserData(data)
        setEmail(data.email)
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoading(false))

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
      setEmail("")
    } else {
      handleStatusUpdate("active")
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
              <Button style={buttonStyle}>{t("Save changes")}</Button>
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
  const [measurementId, setMeasurementId] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")

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
    setMeasurementId(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
      setMeasurementId("")
    } else {
      handleStatusUpdate("active")
    }
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
                value={measurementId}
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
                disabled={!measurementId.trim() || isLoading}
                onClick={handleClick}
                style={buttonStyle}
              >
                {isLoading && (
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
                <Button style={buttonStyle}>{t("Save changes")}</Button>
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
  const [containerId, setContainerId] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")

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
    setContainerId(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
      setContainerId("")
    } else {
      handleStatusUpdate("active")
    }
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
                value={containerId}
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
                disabled={!containerId.trim() || isLoading}
                onClick={handleClick}
                style={buttonStyle}
              >
                {isLoading && (
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
                <Button style={buttonStyle}>{t("Save changes")}</Button>
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
  const [pixelId, setPixelId] = useState<string>("")
  const [eventName, setEventName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPortuguese, setIsPortuguese] = useState<boolean>(false)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)

  const t = useTranslations("CreateFlow.ConnectPage")

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

  const handlePixelId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPixelId(event.target.value)
  }

  const handleEventName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
      setPixelId("")
      setEventName("")
    } else {
      handleStatusUpdate("active")
    }
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
                onChange={handlePixelId}
                value={pixelId}
              />
            </div>
            <div className="">
              <label className="text-black" htmlFor="event">
                {t("Submit Event")}
              </label>
              <Input
                placeholder="CompleteRegistration"
                id="event"
                onChange={handleEventName}
                value={eventName}
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
                disabled={!pixelId.trim() || isLoading}
                onClick={handleClick}
                style={buttonStyle}
              >
                {isLoading && (
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
                <Button style={buttonStyle}>{t("Save changes")}</Button>
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

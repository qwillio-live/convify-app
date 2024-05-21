"use client"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LocalIcons } from "@/public/icons"
import { TIntegrationCardData } from "@/types"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { useState } from "react"

type HandleStatusUpdateFunction = (newStatus: string) => void

interface ContentProps {
  handleStatusUpdate: HandleStatusUpdateFunction
  status: string
}

export const EmailContent: React.FC<ContentProps> = ({
  handleStatusUpdate,
}) => {
  return (
    <div className="border-t border-solid border-gray-200 p-5">
      EmailContent
    </div>
  )
}

export const GAnalytics: React.FC<ContentProps> = ({
  handleStatusUpdate,
  status,
}) => {
  const [measurementId, setMeasurementId] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-sm text-gray-800">
          Changes to the Google Analytics 4 integration will only become active
          after re-publishing.
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="">
              <label className="text-black" htmlFor="measurement-id">
                Measurement ID
              </label>
              <Input
                placeholder="G-XXXXXXXXXX"
                id="measurement-id"
                onChange={handleInputChange}
                value={measurementId}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-600">
              Copy and paste your Google Analytics 4 Measurement ID here.
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button variant="secondary">Close</Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!measurementId.trim() || isLoading}
                onClick={handleClick}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Connect
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={handleClick}
                >
                  Disconnect
                </Button>
                <Button>Save changes</Button>
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

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-sm text-gray-800">
          Changes to the Google Tag Manager integration will only become active
          after re-publishing.
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="">
              <label className="text-black" htmlFor="container-id">
                Container ID
              </label>
              <Input
                placeholder="GTM-XXXXXX"
                id="container-id"
                onChange={handleInputChange}
                value={containerId}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-600">
              Copy and paste your Google Analytics 4 Measurement ID here.
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button variant="secondary">Close</Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!containerId.trim() || isLoading}
                onClick={handleClick}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Connect
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={handleClick}
                >
                  Disconnect
                </Button>
                <Button>Save changes</Button>
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
  const [pixelId, setpixelId] = useState<string>("")
  const [eventName, setEventName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePixelId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setpixelId(event.target.value)
  }

  const handleEventName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(event.target.value)
  }

  const handleClick = () => {
    if (status === "active") {
      handleStatusUpdate("inactive")
      setpixelId("")
      setEventName("")
    } else {
      handleStatusUpdate("active")
    }
  }

  return (
    <div className="border-t border-solid border-gray-200 p-5">
      <div className="">
        <p className="mb-4 text-sm text-gray-800">
          Changes to the Meta Pixel integration will only become active after
          re-publishing.
        </p>
        <div className="mb-4">
          <div className="input-container css-1ee99c9 e1veqj306">
            <div className="mb-4">
              <label className="text-black" htmlFor="pixel-id">
                Pixel ID
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
                Submit Event
              </label>
              <Input
                placeholder="CompleteRegistration"
                id="event"
                onChange={handleEventName}
                value={eventName}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-600">
              Copy and paste your Google Analytics 4 Measurement ID here.
            </p>
          </div>
        </div>
        <div className="flex w-full justify-between">
          <AccordionPrimitive.Trigger>
            <Button variant="secondary">Close</Button>
          </AccordionPrimitive.Trigger>
          <div>
            {status !== "active" ? (
              <Button
                disabled={!pixelId.trim() || isLoading}
                onClick={handleClick}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Connect
              </Button>
            ) : (
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={handleClick}
                >
                  Disconnect
                </Button>
                <Button>Save changes</Button>
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
    description: "Recive an email every time a user submit their answer",
    image: LocalIcons.email,
    status: "active",
    alt: "intregation option",
    Content: EmailContent,
  },
  {
    id: 2,
    title: "Google Analytics 4",
    description:
      "Discover how respondents find and interact with your heyflow. Get the data you need to measure ad campaigns, improve your conversion rate, and more.",
    image: LocalIcons.googleAnalytics,
    status: "inactive",
    alt: "google analytics 4",
    Content: GAnalytics,
  },
  {
    id: 3,
    title: "Google Tag Manager",
    description:
      "Get even more analytics features for most ambitious data mining demands.",
    image: LocalIcons.googleTagManager,
    status: "inactive",
    alt: "google tag manager",
    Content: GTagManager,
  },
  {
    id: 4,
    title: "Meta Pixel",
    description:
      "The Meta pixel helps you measure customer actions, build audiences and unlock optimization tools.",
    image: LocalIcons.metaPixel,
    status: "inactive",
    alt: "meta pixel",
    Content: MetaPixel,
  },
]

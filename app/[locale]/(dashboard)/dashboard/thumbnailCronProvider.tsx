"use client"
import React, { useEffect } from "react"

export const ScreenshotsProvider = ({ children }) => {
  const autoScreenshotTime = parseInt(
    process.env.NEXT_PUBLIC_CRON_TIME || "3000000",
    10
  )
  console.log("timeee", autoScreenshotTime)

  // Function to fetch links from /api/cron and take screenshots
  const fetchLinksAndTakeScreenshots = async () => {
    try {
      const response = await fetch("/api/flows")
      const flows = await response.json()
      const filteredFlows = flows.filter((flow) => {
        const updatedAtTime = new Date(flow.updatedAt).getTime() // Parse updatedAt date
        const thumbnailUpdatedAtTime = new Date(
          flow?.thumbnail_updatedAt
        ).getTime() // Parse thumbnail_updatedAt date

        // Calculate the time difference in milliseconds
        const timeDifferenceInMilliseconds = Math.abs(
          thumbnailUpdatedAtTime - updatedAtTime
        )

        // Convert the difference to minutes
        const timeDifferenceInMinutes =
          timeDifferenceInMilliseconds / (1000 * 60)

        console.log("Difference in minutes:", timeDifferenceInMinutes)

        // Check if the difference is greater than or equal to 5 minutes
        return timeDifferenceInMinutes >= 5
      })

      console.log("flowsss", flows, "filteredFlows", filteredFlows)
      if (filteredFlows && filteredFlows.length > 0) {
        for (let eachFlow of filteredFlows) {
          const response = await fetch(`/api/cron?flowId=${eachFlow.id}`)
          // Handle the response data if needed
        }
      }
    } catch (error) {
      console.error("Error fetching links or taking screenshots:", error)
    }
  }

  useEffect(() => {
    // Trigger the screenshot functionality every minute
    const interval = setInterval(
      () => {
        console.log("calling screenshot")
        // fetchLinksAndTakeScreenshots() // Call the function every interval
      },
      autoScreenshotTime,
      10
    )

    // Cleanup interval when component unmounts
    return () => clearInterval(interval)
  }, []) //

  return <>{children}</>
}

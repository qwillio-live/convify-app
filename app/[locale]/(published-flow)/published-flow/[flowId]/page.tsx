//this below command makes it static, you can check build logs as well, it is static
import React from "react"

import FlowStateSetter from "../../storeSetter"
import { unstable_setRequestLocale } from "next-intl/server"
import { Analytics } from "@/components/analytics"
import MetaGoogleAnalytics from "@/components/googleMetaAnalytics"
import StaticPublishedFile from "@/components/user/publishedFlowStaticFile"
import dynamic from "next/dynamic"

interface PageProps {
  params: {
    flowId: string
    locale: any
  }
  searchParams: {
    screen: string
  }
}

export default async function PublishedFlows({
  params,
  searchParams,
}: PageProps) {
  unstable_setRequestLocale(params.locale)

  const flowId = params?.flowId
  // api to fetch steps and make it static -- need to update it with s3 link instead
  const response = await fetch(
    `https://conv-hassan.picreel.bid/api/flows/published/${flowId}`,
    {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["publishedFlow"] },
    }
  )
  const data = await response.json()
  const screenNames = data?.steps?.map((screen) => screen.name)
  const screenName = searchParams?.screen || screenNames[0]
  console.log("dataaaaa in publisedh", screenName, screenNames)
  return (
    <>
      <MetaGoogleAnalytics
        gtm={data?.integrations?.googleTagManagerId}
        gta={data?.integrations?.googleAnalyticsId}
        meta={data?.integrations?.metaPixelId}
      />
      <FlowStateSetter flowData={data} screenNames={screenNames} />
      <StaticPublishedFile
        data={data}
        screenName={screenName === undefined ? screenNames[0] : screenName}
        allScreens={screenNames}
      />
    </>
  )
}

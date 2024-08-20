import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useTranslations } from "next-intl"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import InsightsFlowComponents from "@/components/sections/createFlow/insights/Insights"
import ResponseFlowComponents from "@/components/sections/createFlow/response/Response"

const ResultFlowComponents = () => {
  const t = useTranslations("CreateFlow.ResultsPage")

  return (
    <div className="w-full min-h-screen font-poppins">
      <Tabs defaultValue="insights">
        <header className="flex h-14 lg:h-[88px] items-center justify-center gap-4 border-b bg-muted/20 lg:px-12 px-4 bg-white">
          <div className="tabs-list-container flex size-full items-center justify-center sm:justify-start">
            <TabsList className="flex w-full md:w-fit h-full bg-inherit py-0">
              <TabsTrigger
                className="w-full h-full rounded-none border-b-2 md:border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit text-[#9B9A99] data-[state=active]:text-[#23262C] data-[state=active]:font-semibold font-medium px-3 text-base md:text-xl"
                value="insights"
              >
                {t("insights")}
              </TabsTrigger>
              <TabsTrigger
                className="w-full h-full rounded-none  border-b-2 md:border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit text-[#9B9A99] data-[state=active]:text-[#23262C] data-[state=active]:font-semibold font-medium px-3 text-base md:text-xl"
                value="responses"
              >
                {t("responses")}
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <main className="content relative z-50 flex  items-start justify-center bg-[#FAFAFA] px-4 lg:px-6 overflow-y-auto h-[99vh] sm:h-[calc(100vh-120px)]  md:h-[calc(100vh-120px)]  lg:h-[calc(100vh-120px)] xl:h-[calc(100vh+45px)]">
          <div className="tabs-content flex w-full items-center">
            <TabsContent
              className="mt-0 w-full sm:mt-[10px]"
              value="insights"
            >
              <InsightsFlowComponents />
            </TabsContent>
            <TabsContent
              className="mt-0 size-full"
              value="responses"
            >
              <ResponseFlowComponents />
            </TabsContent>
          </div>
        </main>
      </Tabs>
    </div>
  )
}

export default ResultFlowComponents

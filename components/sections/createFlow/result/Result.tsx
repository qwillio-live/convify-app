import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useTranslations } from "next-intl"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import InsightsFlowComponents from "@/components/sections/createFlow/insights/Insights"
import ResponseFlowComponents from "@/components/sections/createFlow/response/Response"

const ResultFlowComponents = () => {
  const t = useTranslations("CreateFlow.ResultsPage")

  return (
    <div className="w-full min-h-screen">
      <Tabs defaultValue="insights">
        <header className="flex h-14 items-center justify-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px] bg-white">
          <div className="tabs-list-container flex size-full sm:w-3/5 items-center justify-center sm:justify-start">
            <TabsList className="flex h-full bg-inherit py-0">
              <TabsTrigger
                className="h-full rounded-none border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit px-3"
                value="insights"
              >
                {t("insights")}
              </TabsTrigger>
              <TabsTrigger
                className="h-full rounded-none  border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit px-3"
                value="responses"
              >
                {t("responses")}
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <main className="content relative  z-50 flex  items-start justify-center bg-[#FAFAFA] px-4 lg:px-6 overflow-y-scroll">
          <div className="tabs-content flex w-full items-center">
            <TabsContent
              className="mt-0 w-full h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)] sm:mt-[10px]"
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

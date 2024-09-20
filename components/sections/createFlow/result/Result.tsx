import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useTranslations } from "next-intl"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import InsightsFlowComponents from "@/components/sections/createFlow/insights/Insights"
import ResponseFlowComponents from "@/components/sections/createFlow/response/Response"

const ResultFlowComponents = () => {
  const t = useTranslations("CreateFlow.ResultsPage")

  return (
    <div className="font-poppins w-full">
      <Tabs defaultValue="insights">
        <header className="bg-muted/20 flex h-14 items-center justify-center gap-4 border-b bg-white px-4 lg:h-[88px] lg:px-12">
          <div className="tabs-list-container flex size-full items-center justify-center sm:justify-start">
            <TabsList className="flex h-full w-full bg-inherit py-0 md:w-fit">
              <TabsTrigger
                className="h-full w-full rounded-none border-b-2 border-transparent px-3 text-base font-medium uppercase text-[#9B9A99] data-[state=active]:border-current data-[state=active]:bg-inherit data-[state=active]:font-semibold data-[state=active]:text-[#23262C] md:border-b-4 md:text-xl"
                value="insights"
              >
                {t("insights")}
              </TabsTrigger>
              <TabsTrigger
                className="h-full w-full rounded-none  border-b-2 border-transparent px-3 text-base font-medium uppercase text-[#9B9A99] data-[state=active]:border-current data-[state=active]:bg-inherit data-[state=active]:font-semibold data-[state=active]:text-[#23262C] md:border-b-4 md:text-xl"
                value="responses"
              >
                {t("responses")}
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <main className="content relative z-50 h-[calc(100vh-168px)] bg-[#FAFAFA] lg:h-[calc(100vh-144px)]">
          <TabsContent
            className="mt-0 size-full overflow-y-auto px-4 sm:pt-[10px] lg:px-6"
            value="insights"
          >
            <InsightsFlowComponents />
          </TabsContent>
          <TabsContent
            className="my-0 size-full overflow-y-auto p-4 lg:p-8"
            value="responses"
          >
            <ResponseFlowComponents />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  )
}

export default ResultFlowComponents

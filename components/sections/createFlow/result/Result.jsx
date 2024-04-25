import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// sections components
import InsightsFlowComponents from "@/components/sections/createFlow/insights/Insights"
import ResponseFlowComponents from "@/components/sections/createFlow/response/Response"

const ResultFlowComponents = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="insights">
        <header className="flex h-14 items-center justify-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px]">
          <div className="tabs-list-container flex h-full w-3/5 items-center justify-start">
            <TabsList className="flex h-full bg-inherit py-0 ">
              <TabsTrigger
                className="h-full rounded-none border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit "
                value="insights"
              >
                insights
              </TabsTrigger>
              <TabsTrigger
                className="h-full rounded-none  border-b-4 border-transparent uppercase data-[state=active]:border-current data-[state=active]:bg-inherit"
                value="responses"
              >
                responses
              </TabsTrigger>
            </TabsList>
          </div>
        </header>
        <main className="content relative  z-50 flex  items-start justify-center overflow-hidden bg-gray-100   px-4 lg:px-6 ">
          <div className="tabs-content flex w-3/5 items-center justify-start ">
            <TabsContent className="mt-0 w-full " value="insights" style={{height:"87.3vh"}}>
              <InsightsFlowComponents />
            </TabsContent>
            <TabsContent className="mt-0 size-full" value="responses">
              <ResponseFlowComponents />
            </TabsContent>
          </div>
        </main>
      </Tabs>
    </div>
  )
}

export default ResultFlowComponents

import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { InsightsDevices } from "@/constant"
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Percent, User } from "lucide-react"
import { useState } from "react"

const InsightsFlowComponents = () => {
  const [date, setDate] = useState(new Date())
  const [selected, setSelected] = useState(InsightsDevices[0] || {})
  return (
    <Tabs defaultValue="custom">
      <header className="mt-4 flex items-center gap-4 px-4 lg:px-6">
        <div className="tabs-list-container flex items-center justify-start rounded-lg bg-muted p-1">
          <TabsList className="flex h-full bg-inherit py-0">
            <TabsTrigger className="" value="custom">
              <DatePickerWithRange />
            </TabsTrigger>
            <TabsTrigger
              className="border-transparent px-3 py-1 text-sm font-medium data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
              value="28days"
            >
              Last 28 days
            </TabsTrigger>
            <TabsTrigger
              className="border-transparent px-3 py-1 text-sm font-medium data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
              value="14days"
            >
              Last 14 days
            </TabsTrigger>
            <TabsTrigger
              className="border-transparent px-3 py-1 text-sm font-medium data-[state=active]:bg-white data-[state=inactive]:bg-transparent"
              value="7days"
            >
              Last 7 days
            </TabsTrigger>
          </TabsList>
        </div>
      </header>
      <main className="content relative z-50 flex items-start overflow-hidden bg-gray-100 px-4 lg:px-6">
        <div className="tabs-content flex w-full items-center justify-start">
          <TabsContent
            className="mt-0 w-full overflow-y-auto"
            value="custom"
            style={{ height: "87.3vh" }}
          >
            <div className="mt-4 flex w-full gap-4">
              <Card className="flex flex-1 flex-col">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                  <h3 className="text-sm font-medium tracking-tight">Visits</h3>
                  <User />
                </div>
                <div className="flex flex-1 flex-col justify-end p-6 pt-0">
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </div>
              </Card>
              <Card className="flex flex-1 flex-col">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                  <h3 className="text-sm font-medium tracking-tight">
                    Submits
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-goal"
                  >
                    <path d="M12 13V2l8 4-8 4" />
                    <path d="M20.561 10.222a9 9 0 1 1-12.55-5.29" />
                    <path d="M8.002 9.997a5 5 0 1 0 8.9 2.02" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col justify-end p-6 pt-0">
                  <div className="text-2xl font-bold">898</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </div>
              </Card>
              <Card className="flex flex-1 flex-col">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                  <h3 className="text-sm font-medium tracking-tight">
                    Conversion Rate
                  </h3>
                  <Percent />
                </div>
                <div className="flex flex-1 flex-col justify-end p-6 pt-0">
                  <div className="text-2xl font-bold">109%</div>
                  <p className="text-xs text-muted-foreground">
                    +32% from last month
                  </p>
                </div>
              </Card>
              <Card className="flex flex-1 flex-col">
                <div className="flex w-full flex-1 justify-evenly gap-2 p-6 px-0">
                  <div className="">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="size-8"
                      >
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <line x1="8" x2="16" y1="21" y2="21" />
                        <line x1="12" x2="12" y1="17" y2="21" />
                      </svg>
                      <p className="pb-1 text-sm font-medium tracking-tight">
                        Desktop
                      </p>
                    </div>
                    <span className="text-2xl font-bold">0 %</span>
                  </div>
                  <div className="">
                    <div>
                      <svg
                        viewBox="0 0 48 48"
                        width="18"
                        height="18"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-8"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                        >
                          <path
                            d="M16.5 30l3.346-2.51a3.14 3.14 0 014.494.77h0a3.138 3.138 0 010 3.48l-3.29 4.934a9 9 0 01-4.146 3.364L12 42v4.5M18 19.5l-7.2 3.082a9 9 0 00-4.726 4.728L3.728 32.8A9 9 0 003 36.348V46.5"
                            stroke-width="3"
                          ></path>
                          <path
                            d="M18 28.876V7.5a6 6 0 016-6h15a6 6 0 016 6v33a6 6 0 01-6 6H24a6 6 0 01-6-6v-1M20.428 37.5H45"
                            stroke-width="3"
                          ></path>
                        </g>
                      </svg>
                      <p className="pb-1 text-sm font-medium tracking-tight">
                        Mobile
                      </p>
                    </div>
                    <span className="text-2xl font-bold">0 %</span>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className=""></div>
              <Card>
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Step</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Exits</TableHead>
                      <TableHead>Drop-off rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>One</TableCell>
                      <TableCell>123</TableCell>
                      <TableCell>499</TableCell>
                      <TableCell>25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell>Two</TableCell>
                      <TableCell>123</TableCell>
                      <TableCell>499</TableCell>
                      <TableCell>25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell>Three</TableCell>
                      <TableCell>123</TableCell>
                      <TableCell>499</TableCell>
                      <TableCell>25</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
          <TabsContent className="mt-0 size-full" value="28days"></TabsContent>
          <TabsContent className="mt-0 size-full" value="14days"></TabsContent>
          <TabsContent className="mt-0 size-full" value="7days"></TabsContent>
        </div>
      </main>
    </Tabs>
  )
}

export default InsightsFlowComponents

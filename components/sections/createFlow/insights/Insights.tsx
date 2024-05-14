import { useState } from "react"
import { InsightsDevices } from "@/constant"
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Percent, User } from "lucide-react"
import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
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
import { DatePickerWithRange } from "@/components/DatePickerWithRange"

const data = [
  {
    time: 5.05,
    visits: 4,
  },
  {
    time: 6.05,
    visits: 3,
  },
  {
    time: 7.05,
    visits: 2,
  },
  {
    time: 8.05,
    visits: 1,
  },
  {
    time: 9.05,
    visits: 0,
  },
  {
    time: 10.05,
    visits: 5,
  },
  {
    time: 11.05,
    visits: 6,
  },
]

const InsightsFlowComponents = () => {
  const [date, setDate] = useState(new Date())
  const [selected, setSelected] = useState(InsightsDevices[0] || {})
  return (
    <Tabs defaultValue="custom">
      <header className="mt-4 flex items-center gap-4 px-4 lg:px-6">
        <div className="tabs-list-container flex items-center justify-start rounded-lg bg-white p-1">
          <TabsList className="flex h-full bg-inherit py-0">
            <TabsTrigger
              className="[&>div>button]:data-[state=active]:border-input [&>div>button]:data-[state=inactive]:border-transparent [&>div>button]:data-[state=inactive]:bg-transparent [&>div>button]:data-[state=active]:bg-muted [&>div>button]:font-medium"
              value="custom"
            >
              <DatePickerWithRange className="" />
            </TabsTrigger>
            <TabsTrigger
              className="px-3 py-1 text-sm font-medium data-[state=active]:bg-muted data-[state=inactive]:bg-transparent rounded-md border data-[state=active]:border-input data-[state=inactive]:border-transparent"
              value="28days"
            >
              Last 28 days
            </TabsTrigger>
            <TabsTrigger
              className="px-3 py-1 text-sm font-medium data-[state=active]:bg-muted data-[state=inactive]:bg-transparent rounded-md  border data-[state=active]:border-input data-[state=inactive]:border-transparent"
              value="14days"
            >
              Last 14 days
            </TabsTrigger>
            <TabsTrigger
              className="px-3 py-1 text-sm font-medium data-[state=active]:bg-muted data-[state=inactive]:bg-transparent rounded-md border data-[state=active]:border-input data-[state=inactive]:border-transparent"
              value="7days"
            >
              Last 7 days
            </TabsTrigger>
          </TabsList>
        </div>
      </header>
      <main className="content relative z-50 flex items-start overflow-hidden bg-transparent px-4 lg:px-6">
        <div className="tabs-content flex w-full items-center justify-start">
          <TabsContent
            className="mt-0 w-full overflow-y-auto"
            value="custom"
            style={{ height: "87.3vh" }}
          >
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 w-full gap-4">
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
                        className="w-8 h-8"
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
                        className="w-8 h-8"
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
            <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
              <Card className="">
                <div className="p-3 flex justify-start">
                  <div className="p-1 flex gap-0 bg-secondary rounded-lg">
                    <Button
                      variant="secondary"
                      className="text-sm bg-white rounded-md border border-input hover:bg-white"
                    >
                      Visits
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm bg-transparent rounded-md hover:bg-transparent"
                    >
                      Submits
                    </Button>
                  </div>
                </div>
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 0,
                        right: 20,
                        left: 0,
                        bottom: 20,
                      }}
                      className="w-full"
                    >
                      {/* <CartesianGrid strokeDasharray="3 3" /> */}
                      <XAxis dataKey="time" fontSize={14} />
                      <YAxis dataKey="visits" fontSize={14} />
                      <Tooltip />
                      {/* <Legend /> */}
                      <Bar
                        dataKey="visits"
                        fill="#000"
                        activeBar={<Rectangle fill="#000" />}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
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
          <TabsContent className="mt-0 w-full" value="28days">
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 w-full gap-4">
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
                        className="w-8 h-8"
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
                        className="w-8 h-8"
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
            <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
              <Card className="">
                <div className="p-3 flex justify-start">
                  <div className="p-1 flex gap-0 bg-secondary rounded-lg">
                    <Button
                      variant="secondary"
                      className="text-sm bg-white rounded-md border border-input hover:bg-white"
                    >
                      Visits
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm bg-transparent rounded-md hover:bg-transparent"
                    >
                      Submits
                    </Button>
                  </div>
                </div>
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 0,
                        right: 20,
                        left: 0,
                        bottom: 20,
                      }}
                      className="w-full"
                    >
                      {/* <CartesianGrid strokeDasharray="3 3" /> */}
                      <XAxis dataKey="time" fontSize={14} />
                      <YAxis dataKey="visits" fontSize={14} />
                      <Tooltip />
                      {/* <Legend /> */}
                      <Bar
                        dataKey="visits"
                        fill="#000"
                        activeBar={<Rectangle fill="#000" />}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
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
          <TabsContent className="mt-0 w-full" value="14days">
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 w-full gap-4">
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
                        className="w-8 h-8"
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
                        className="w-8 h-8"
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
            <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
              <Card className="">
                <div className="p-3 flex justify-start">
                  <div className="p-1 flex gap-0 bg-secondary rounded-lg">
                    <Button
                      variant="secondary"
                      className="text-sm bg-white rounded-md border border-input hover:bg-white"
                    >
                      Visits
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm bg-transparent rounded-md hover:bg-transparent"
                    >
                      Submits
                    </Button>
                  </div>
                </div>
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 0,
                        right: 20,
                        left: 0,
                        bottom: 20,
                      }}
                      className="w-full"
                    >
                      {/* <CartesianGrid strokeDasharray="3 3" /> */}
                      <XAxis dataKey="time" fontSize={14} />
                      <YAxis dataKey="visits" fontSize={14} />
                      <Tooltip />
                      {/* <Legend /> */}
                      <Bar
                        dataKey="visits"
                        fill="#000"
                        activeBar={<Rectangle fill="#000" />}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
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
          <TabsContent className="mt-0 w-full" value="7days">
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 w-full gap-4">
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
              <Card className="flex flex-col">
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
                        className="w-8 h-8"
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
                        className="w-8 h-8"
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
            <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
              <Card className="">
                <div className="p-3 flex justify-start">
                  <div className="p-1 flex gap-0 bg-secondary rounded-lg">
                    <Button
                      variant="secondary"
                      className="text-sm bg-white rounded-md border border-input hover:bg-white"
                    >
                      Visits
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-sm bg-transparent rounded-md hover:bg-transparent"
                    >
                      Submits
                    </Button>
                  </div>
                </div>
                <div className="w-full" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 0,
                        right: 20,
                        left: 0,
                        bottom: 20,
                      }}
                      className="w-full"
                    >
                      {/* <CartesianGrid strokeDasharray="3 3" /> */}
                      <XAxis dataKey="time" fontSize={14} />
                      <YAxis dataKey="visits" fontSize={14} />
                      <Tooltip />
                      {/* <Legend /> */}
                      <Bar
                        dataKey="visits"
                        fill="#000"
                        activeBar={<Rectangle fill="#000" />}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
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
        </div>
      </main>
    </Tabs>
  )
}

export default InsightsFlowComponents

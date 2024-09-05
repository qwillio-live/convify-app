import { useState, useEffect } from "react"
import { InsightsDevices } from "@/constant"
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Percent, User } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useRouter, usePathname } from "next/navigation"
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
import { pt } from "date-fns/locale"
import { differenceInCalendarDays, format, parse, subDays } from "date-fns"

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const visitsAndSubmitsData: SubmitData[] = [
  {
    time: convertDate(subDays(new Date(), 5).toISOString()),
    visits: 0,
    submits: 0,
  },
  {
    time: convertDate(subDays(new Date(), 4).toISOString()),
    visits: 0,
    submits: 0,
  },
  {
    time: convertDate(subDays(new Date(), 3).toISOString()),
    visits: 0,
    submits: 0,
  },
  {
    time: convertDate(subDays(new Date(), 2).toISOString()),
    visits: 0,
    submits: 0,
  },
  {
    time: convertDate(subDays(new Date(), 1).toISOString()),
    visits: 0,
    submits: 0,
  },
]

function convertDate(dateStr: string): string {
  if (!dateStr) return "0"
  const date = new Date(dateStr)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${day}.${month}`
}

const visitConverter = (
  data: SubmitData[],
  startDate: Date,
  endDate: Date,
  loc: string
): { time: string; visits?: number; visitas?: number }[] => {
  // Create an array of dates from startDate to endDate
  const dateArray: string[] = []
  let currentDate = new Date(startDate)
  while (currentDate <= new Date(endDate)) {
    dateArray.push(convertDate(currentDate.toDateString()))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  // Map through the dateArray and replace if there's a match with convertDate(d.date)
  return dateArray.map((date: string) => {
    const matchingData = data.find(
      (d: SubmitData) => convertDate(d.date ?? "0") === date
    )

    const count = matchingData ? matchingData.count ?? 0 : 0
    return {
      time: date,
      visits: loc === "pt" ? undefined : count,
      visitas: loc === "pt" ? count : undefined,
    }
  })
}

const submitConverter = (
  data: SubmitData[],
  startDate: Date,
  endDate: Date,
  loc: string
): { time: string; submits?: number; envios?: number }[] => {
  // Create an array of dates from startDate to endDate
  const dateArray: string[] = []
  let currentDate = new Date(startDate)
  while (currentDate <= new Date(endDate)) {
    dateArray.push(convertDate(currentDate.toDateString()))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  // Map through the dateArray and replace if there's a match with convertDate(d.date)
  return dateArray.map((date: string) => {
    const matchingData = data.find(
      (d: SubmitData) => convertDate(d.date ?? "0") === date
    )
    const count = matchingData ? matchingData.count ?? 0 : 0
    return {
      time: date,
      submits: loc === "pt" ? undefined : count,
      envios: loc === "pt" ? count : undefined,
    }
  })
}

interface SubmitData {
  time?: string
  submits?: number
  visits?: number
  date?: string
  count?: number
}

const formatDate = (dateString) => {
  if (!dateString) return "0"
  const date = new Date(dateString)
  const year = date.getFullYear()
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}
interface Analytics {
  totalVisits: number
  totalSubmits: number
  conversionRate: string
  desktopDevicePercentage: string
  mobileDevicePercentage: string
  submitsArray: Array<SubmitData>
  uniqueVisitsArray: Array<SubmitData>
}

interface Dropoff {
  stepName: string
  visits: number
  exits: number
  dropOffRate: string
}

const fakeDropOff = []

const setItems = (key: string, value: any) => {
  const storedFlowData = JSON.parse(localStorage.getItem("flowData") ?? "null")
  if (storedFlowData) {
    const updatedFlowData = {
      ...storedFlowData,
      [key]: value,
    }
    // Store the updated flowData object back in localStorage
    localStorage.setItem("flowData", JSON.stringify(updatedFlowData))
  }
}

const getItems = (key: string) => {
  const storedFlowData = JSON.parse(localStorage.getItem("flowData") ?? "null")
  if (storedFlowData) {
    return storedFlowData[key]
  }
}
const getInitialDate = () => {
  const storedDate = getItems("date")
  if (storedDate) {
    return {
      startDate: new Date(storedDate.startDate),
      endDate: new Date(storedDate.endDate),
    }
  } else {
    return {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    }
  }
}

const navbarHighlighter = () => {
  const storedDate = getItems("date")
  if (storedDate) {
    const startDate = storedDate.startDate
    const endDate = storedDate.endDate
    const isToday =
      new Date().toDateString() === new Date(endDate).toDateString()
    const difference = differenceInCalendarDays(
      new Date(endDate),
      new Date(startDate)
    )
    // add one day to enddate and compare it today
    const oneDayToday =
      differenceInCalendarDays(new Date(endDate), new Date()) === 1
    if ((isToday && difference === 7) || (oneDayToday && difference === 8)) {
      return "custom"
    } else if (isToday && difference === 14) {
      return "14days"
    } else if (isToday && difference === 28) {
      return "28days"
    } else {
      return "calendar"
    }
  } else {
    return "custom"
  }
}

const InsightsFlowComponents = () => {
  const currentPath = usePathname()
  const [paddingScreen, setPaddingScreen] = useState<string>("inherit")
  const [windowSize, setWindowSize] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Determine height based on window width
  const getHeight = () => {
    return windowSize < 600 ? "fit-content" : 350
  }

  useEffect(() => {
    if (windowSize <= 370) {
      setPaddingScreen("0.2rem")
    } else if (windowSize <= 390) {
      setPaddingScreen("0.3rem")
    } else if (windowSize <= 450) {
      setPaddingScreen("0.4rem")
    } else {
      getHeight()
      setPaddingScreen("inherit")
    }
  }, [windowSize])

  const [date, setDate] = useState(() => {
    return getInitialDate()
  })
  const [days, setDays] = useState(() => {
    const days = getItems("days") || 7
    return days
  })
  const [status, setStatus] = useState(false)
  // will be replaced dynamic flow id
  const [flowId, setFlowId] = useState<string | null>(null)
  const [firstRender, setFirstRender] = useState(false)
  useEffect(() => {
    const extractFlowIdFromUrl = async () => {
      const url = currentPath // Get the current URL
      const match = url && url.match(/dashboard\/([^\/]+)\/results/) // Use regex to match the flowId
      if (match && match[1] && match[1] !== "flows") {
        setFlowId(match[1])
        setDays(days)

        const storedFlowId = getItems("flowId")
        const storedFlowData = localStorage.getItem("flowData")
        if (storedFlowId && match[1]) {
          if (storedFlowId !== match[1]) {
            setDate({
              startDate: subDays(new Date(), 7),
              endDate: new Date(),
            })
            const flowData = {
              flowId: match[1],
              days: 7,
              date: {
                startDate: subDays(new Date(), 7),
                endDate: new Date(),
              },
              Dropoff: [],
            }
            setFirstRender(true)
            setDays(7)
            localStorage.setItem("flowData", JSON.stringify(flowData))
          }
        }
        if (!storedFlowData) {
          const flowData = {
            flowId: match[1],
            days: 7,
            date: {
              startDate: subDays(new Date(), 7),
              endDate: new Date(),
            },
            Dropoff: [],
          }
          localStorage.setItem("flowData", JSON.stringify(flowData))
        }
      }
    }
    extractFlowIdFromUrl()
  }, [])

  const [dataKey, setDataKey] = useState(getItems("dataKey") ?? "visits")

  useEffect(() => {
    setItems("dataKey", dataKey)
  }, [dataKey])

  const [data, setData] = useState<SubmitData[]>(visitsAndSubmitsData)
  let [dropoff, setDropoff] = useState<Dropoff[]>(() => {
    const dataRes = getItems("Dropoff")
    const url = currentPath // Get the current URL
    const match = url && url.match(/dashboard\/([^\/]+)\/results/)
    const storedFlowId = getItems("flowId")
    if (dataRes && match && storedFlowId === match[1]) {
      // Added null check for 'match'
      return dataRes
    } else {
      return []
    }
  })

  const t = useTranslations("CreateFlow.ResultsPage")
  const locale = useLocale() // Get the locale from the query parameters
  const datePickerLocale = locale === "pt" ? pt : undefined

  const [analytics, setAnalytics] = useState<Analytics>({
    totalVisits: 0,
    totalSubmits: 0,
    conversionRate: "0",
    desktopDevicePercentage: "0",
    mobileDevicePercentage: "0",
    submitsArray: visitsAndSubmitsData,
    uniqueVisitsArray: visitsAndSubmitsData,
  })

  useEffect(() => {
    // Parse analytics from local storage when component mounts or updates
    const dataRes = getItems("analyticsData")
    if (dataRes) {
      const parsedData = dataRes // Parse the dataRes string into an object
      setAnalytics(parsedData)
      if (dataKey === "submits" && parsedData.submitsArray?.length > 0)
        setData(
          submitConverter(
            parsedData.submitsArray,
            date.startDate,
            date.endDate,
            locale
          )
        )
      else if (dataKey === "visits" && parsedData.uniqueVisitsArray?.length > 0)
        setData(
          visitConverter(
            parsedData.uniqueVisitsArray,
            date.startDate,
            date.endDate,
            locale
          )
        )
      else if (dataKey === "submits" && parsedData.submitsArray?.length <= 0)
        setData(
          submitConverter(
            visitsAndSubmitsData,
            date.startDate,
            date.endDate,
            locale
          )
        )
      else if (
        dataKey === "visits" &&
        parsedData.uniqueVisitsArray?.length <= 0
      )
        setData(
          visitConverter(
            visitsAndSubmitsData,
            date.startDate,
            date.endDate,
            locale
          )
        )
    }
  }, [])

  function setDateBasedOnDays(day: number) {
    setDate({
      startDate: subDays(new Date(), day),
      endDate: new Date(),
    })
    setItems("date", {
      startDate: subDays(new Date(), day),
      endDate: new Date(),
    })
  }

  useEffect(() => {
    const getDropoff = async () => {
      const response = await fetch(
        `/api/analytics/dropoff/?flowId=${flowId}&startDate=${formatDate(
          date.startDate
        )}&endDate=${formatDate(date.endDate)}`
      )
      const dataRes = await response.json()
      setDropoff(dataRes)
      setItems("Dropoff", dataRes)
    }
    if (flowId) {
      getDropoff()
    }
  }, [status, flowId])

  useEffect(() => {
    const getAnalytics = async () => {
      const response = await fetch(
        `/api/analytics/?flowId=${flowId}&startDate=${formatDate(
          date.startDate
        )}&endDate=${formatDate(date.endDate)}`
      )
      const dataRes = await response.json()
      setAnalytics(dataRes)
      setItems("analyticsData", dataRes)
      if (dataKey === "submits" && dataRes.submitsArray.length > 0)
        setData(
          submitConverter(
            dataRes.submitsArray,
            date.startDate,
            date.endDate,
            locale
          )
        )
      else if (dataKey === "visits" && dataRes.uniqueVisitsArray.length > 0)
        setData(
          visitConverter(
            dataRes.uniqueVisitsArray,
            date.startDate,
            date.endDate,
            locale
          )
        )
      else if (dataKey === "submits" && dataRes.submitsArray.length <= 0)
        setData(
          submitConverter(
            dataRes.submitsArray,
            date.startDate,
            date.endDate,
            locale
          )
        )
      else if (dataKey === "visits" && dataRes.uniqueVisitsArray.length <= 0)
        setData(
          visitConverter(
            dataRes.uniqueVisitsArray,
            date.startDate,
            date.endDate,
            locale
          )
        )
    }
    if (flowId) {
      getAnalytics()
    }
  }, [status, flowId])

  // tooltip component
  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const { value, payload: pl } = payload[0]

      return (
        <div
          className="rounded-md border border-[#E6E2DD] bg-white px-3 py-2"
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p className="text-sm font-medium text-[#23262C]">
            {label}, {pl?.year}
          </p>
          <p className="text-xs text-[#9B9A99]">
            <span className="capitalize">{dataKey}</span> <span className="text-[#23262C]">{value}</span>
          </p>
        </div>
      )
    }

    return null
  }

  const repeatedJSX = (
    <>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex w-full flex-col gap-4 md:w-[57%] md:flex-row md:gap-6">
          <div className="h-[160px] md:h-[196px] flex w-full flex-col rounded-[12px] border border-[#E9E9E9] bg-white p-5 md:rounded-[20px] md:p-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-base font-semibold text-[#23262C]">
                {t("Visits")}
              </h3>
              <User className="h-6 text-[#7B7D80]" />
            </div>
            <div className="flex flex-1 flex-col justify-end">
              <h1 className="text-[48px] font-semibold text-[#23262C] md:text-[52px]">
                {analytics.totalVisits || 0}
              </h1>
              <div className="flex h-[22px] w-fit items-center rounded-full bg-[#E9E9E9]/60 px-3 text-xs text-[#505050]">
                {t("visits from last month", { visits: "0%" })}
              </div>
            </div>
          </div>

          <div className="h-[160px] md:h-[196px] flex w-full flex-col rounded-[12px] border border-[#E9E9E9] bg-white p-5 md:rounded-[20px] md:p-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-base font-semibold text-[#23262C]">
                {t("Submits")}
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7B7D80"
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
            <div className="flex flex-1 flex-col justify-end">
              <h1 className="text-[48px] font-semibold text-[#23262C] md:text-[52px]">
                {analytics.totalSubmits}
              </h1>
              <div className="flex h-[22px] w-fit items-center rounded-full bg-[#E9E9E9]/60 px-3 text-xs text-[#505050]">
                {t("submits from last month", { submits: "0%" })}
              </div>
            </div>
          </div>

          <div className="h-[160px] md:h-[196px] flex w-full flex-col rounded-[12px] border border-[#E9E9E9] bg-white p-5 md:rounded-[20px] md:p-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-base font-semibold text-[#23262C]">
                {t("Conversion Rate")}
              </h3>
              <Percent className="h-6 text-[#7B7D80]" />
            </div>
            <div className="flex flex-1 flex-col justify-end">
              <div className="text-[48px] font-semibold text-[#23262C] md:text-[52px]">
                {analytics.conversionRate}
              </div>
              <div className="flex h-[22px] w-fit items-center rounded-full bg-[#E9E9E9]/60 px-3 text-xs text-[#505050]">
                {t("conversionRate from last month", {
                  conversionRate: "0%",
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[12px] border border-[#E9E9E9] bg-transparent md:w-[43%] md:rounded-[20px]">
          <div className="flex h-full w-full flex-col md:flex-row md:gap-8">
            <div className="h-[160px] md:h-[196px] flex w-full flex-col justify-between p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#23262C]">
                  {t("Desktop")}
                </h3>
                <div>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.5 3H4.5C3.39543 3 2.5 3.89543 2.5 5V15C2.5 16.1046 3.39543 17 4.5 17H20.5C21.6046 17 22.5 16.1046 22.5 15V5C22.5 3.89543 21.6046 3 20.5 3Z"
                      stroke="#7B7D80"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8.5 21H16.5"
                      stroke="#7B7D80"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5 17V21"
                      stroke="#7B7D80"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="">
                <h1 className="text-[48px] font-semibold text-[#23262C] md:text-[52px]">
                  {`${
                    String(analytics.desktopDevicePercentage) === "0"
                      ? 0
                      : Number(analytics.desktopDevicePercentage).toFixed(1)
                  }`}
                  %
                </h1>
                <div className="flex h-[22px] w-fit items-center rounded-full bg-[#E9E9E9]/60 px-3 text-xs text-[#505050]">
                  {t("visits from last month", { visits: "0%" })}
                </div>
              </div>
            </div>

            <div className="px-6 py-0 md:px-0 md:py-6">
              <div className="w-full border-b border-[#EAEAEC] md:h-full md:border-r"></div>
            </div>

            <div className="h-[160px] md:h-[196px] flex w-full flex-col justify-between p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#23262C]">
                  {t("Mobile")}
                </h3>
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 6H13.5M16.286 3H7.714C6.768 3 6 3.806 6 4.8V19.2C6 20.194 6.768 21 7.714 21H16.286C17.233 21 18 20.194 18 19.2V4.8C18 3.806 17.233 3 16.286 3Z"
                      stroke="#7B7D80"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-[48px] font-semibold text-[#23262C] md:text-[52px]">
                  {`${
                    String(analytics.mobileDevicePercentage) === "0.00" ||
                    String(analytics.mobileDevicePercentage) === "0"
                      ? 0
                      : Number(analytics.mobileDevicePercentage).toFixed(1)
                  }`}
                  %
                </h1>
                <div className="flex h-[22px] w-fit items-center rounded-full bg-[#E9E9E9]/60 px-3 text-xs text-[#505050]">
                  {t("visits from last month", { visits: "0%" })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="w-full w-full rounded-[12px] border border-[#E9E9E9] bg-white p-6 md:w-[57%] md:rounded-[20px]">
          <div className="mb-6 flex justify-between">
            <h2 className="text-base font-semibold text-[#23262C] md:text-2xl">
              {t("Statistics")}
            </h2>
            <div className="flex h-[34px] gap-0 rounded-lg bg-[#EEEEEE] p-1 md:h-9">
              <Button
                variant="secondary"
                className={`h-[26px] w-[53px] rounded border-none text-sm font-normal md:h-7 md:w-[58px] md:text-base ${
                  dataKey === "visits"
                    ? "bg-white text-[#23262C] hover:bg-white"
                    : "bg-transparent text-[#7B7D80] hover:bg-transparent"
                }`}
                onClick={() => {
                  setDataKey("visits")
                  setData(
                    visitConverter(
                      analytics.uniqueVisitsArray,
                      date.startDate,
                      date.endDate,
                      locale
                    )
                  )
                }}
                size="sm"
              >
                {t("Visits")}
              </Button>
              <Button
                variant="secondary"
                className={`h-[26px] w-[73px] rounded border text-sm font-normal hover:bg-white md:h-7 md:w-[82px] md:text-base ${
                  dataKey === "submits"
                    ? "border-input bg-white text-[#23262C] hover:bg-white"
                    : "border-transparent bg-transparent text-[#7B7D80] hover:bg-transparent"
                }`}
                onClick={() => {
                  setDataKey("submits")
                  setData(
                    submitConverter(
                      analytics.submitsArray,
                      date.startDate,
                      date.endDate,
                      locale
                    )
                  )
                }}
                size="sm"
              >
                {t("Submits")}
              </Button>
            </div>
          </div>
          <div className="w-full overflow-x-auto h-[300px]">
            <ResponsiveContainer  minWidth={data.length * 20} height="100%">
              <BarChart
                data={data.map((data) => ({
                  ...data,
                  time: data?.time
                    ? format(
                        parse(
                          `${data.time.split(".")[1]}.${
                            data.time.split(".")[0]
                          }`,
                          "M.d",
                          new Date()
                        ),
                        "MMM dd"
                      ).toUpperCase()
                    : undefined,
                  year: data?.time
                    ? format(
                        parse(
                          `${data.time.split(".")[1]}.${
                            data.time.split(".")[0]
                          }.${new Date().getFullYear()}`,
                          "M.d.yyyy",
                          new Date()
                        ),
                        "yyyy"
                      )
                    : undefined,
                }))}
                margin={{
                  top: 0,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
                className="w-full"
              >
                <CartesianGrid
                  stroke="#EAEAEC"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  tickMargin={16}
                  axisLine={false}
                  className="text-[10px] text-[#9B9A99] md:text-sm"
                />
               
                <Tooltip content={<CustomTooltip />} cursor={false} />
                {/* <Legend /> */}
                <Bar
                  dataKey={
                    dataKey === "visits"
                      ? locale === "pt"
                        ? "visitas"
                        : "visits"
                      : locale === "pt"
                      ? "envios"
                      : "submits"
                  }
                  fill="#23262C"
                  activeBar={<Rectangle fill="#2B3398" />}
                  radius={4}
                  // barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-fill max-h-[436px] w-full w-full rounded-[12px] border border-[#E9E9E9] bg-white p-6 md:w-[43%] md:rounded-[20px]">
          <div
            className="size-full overflow-x-hidden sm:overflow-x-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#dfdfdf #fff" }}
          >
            <Table className="size-full">
              <TableHeader>
                <TableRow className="mb-0 border-b border-[#EAEAEC] text-xs md:text-base">
                  <TableHead className="hidden h-full whitespace-nowrap border-r border-[#EAEAEC] py-4 pr-0 font-normal text-[#9B9A99] md:block">
                    #
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap px-2 py-4 font-normal text-[#9B9A99] md:px-4"
                    // style={{ padding: paddingScreen }}
                  >
                    {t("Step")}
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap px-2 py-4 font-normal text-[#9B9A99]"
                    // style={{ padding: paddingScreen }}
                  >
                    {t("Visits")}
                  </TableHead>
                  <TableHead
                    className="whitespace-nowrap px-2 py-4 font-normal text-[#9B9A99]"
                    // style={{ padding: paddingScreen }}
                  >
                    {t("Exits")}
                  </TableHead>
                  <TableHead
                    className="whitespace-wrap px-2 py-4 font-normal text-[#9B9A99]"
                    // style={{ padding: paddingScreen }}
                  >
                    {t("Drop-off rate")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                {dropoff && dropoff.length >= 0
                  ? dropoff.map((item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-[#EAEAEC] px-2 py-4 text-xs text-[#23262C] md:px-4 md:text-base"
                      >
                        {" "}
                        {/* Reduced padding here */}
                        <TableCell className="hidden h-full border-r border-[#EAEAEC] px-2 py-4 pr-0 text-[#9B9A99] md:block md:px-4">
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className="whitespace-wrap px-2 py-4 md:px-4"
                          // style={{ padding: paddingScreen }}
                        >
                          {item.stepName}
                        </TableCell>
                        <TableCell
                          className="px-2 py-4"
                          // style={{ padding: paddingScreen }}
                        >
                          {item.visits}
                        </TableCell>
                        <TableCell
                          className="px-2 py-4"
                          // style={{ padding: paddingScreen }}
                        >
                          {item.exits}
                        </TableCell>
                        <TableCell
                          className="px-2 py-4"
                          // style={{ padding: paddingScreen }}
                        >
                          {item.dropOffRate.split(".")[0]}%
                        </TableCell>
                      </TableRow>
                    ))
                  : fakeDropOff.map((item, index) => (
                      <TableRow key={index} className="p-4">
                        {" "}
                        {/* Reduced padding here */}
                        <TableCell className="p-4"></TableCell>
                        <TableCell
                          className="whitespace-wrap p-4"
                          style={{ padding: paddingScreen }}
                        ></TableCell>
                        <TableCell
                          className="p-4"
                          style={{ padding: paddingScreen }}
                        ></TableCell>
                        <TableCell
                          className="p-4"
                          style={{ padding: paddingScreen }}
                        ></TableCell>
                        <TableCell
                          className="p-4"
                          style={{ padding: paddingScreen }}
                        ></TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
  return (
    <Tabs defaultValue={navbarHighlighter()} className="pb-6">
      <header className="z-[100] mt-4 flex items-center gap-4 px-0 md:fixed md:right-7 md:top-[84px] md:mt-0 lg:px-6">
        <div className="w-full tabs-list-container flex items-center justify-start overflow-x-hidden">
          <TabsList className="w-full flex h-full overflow-x-auto bg-inherit py-0">
            <TabsTrigger
              className="w-full [&>div>button]:data-[state=active]:border-[#E6E2DD] [&>div>button]:data-[state=inactive]:border-transparent [&>div>button]:data-[state=active]:text-[#23262C] [&>div>button]:data-[state=inactive]:text-[#9B9A99]"
              value="calendar"
              onClick={() => {
                setDays(days)
                setDateBasedOnDays(days)
              }}
            >
              <DatePickerWithRange
                className="w-full"
                firstRender={firstRender}
                days={days}
                setDays={setDays}
                locale={datePickerLocale}
                status={status}
                setStatus={setStatus}
                setDater={(v: any) =>
                  setDate({ startDate: v.startDate, endDate: v.endDate })
                }
              />
            </TabsTrigger>
            <TabsTrigger
              className="hidden whitespace-nowrap rounded-md border px-3 py-1 text-base data-[state=active]:border-[#E6E2DD] data-[state=inactive]:border-transparent data-[state=active]:text-[#23262C] data-[state=inactive]:text-[#9B9A99] md:block"
              value="28days"
              onClick={() => {
                setDays(28)
                setDateBasedOnDays(28)
                setStatus(!status)
              }}
            >
              {t("Last 28 days")}
            </TabsTrigger>
            <TabsTrigger
              className="hidden whitespace-nowrap rounded-md border px-3 py-1 text-base data-[state=active]:border-[#E6E2DD] data-[state=inactive]:border-transparent data-[state=active]:text-[#23262C] data-[state=inactive]:text-[#9B9A99] md:block"
              value="14days"
              onClick={() => {
                setDays(14)
                setDateBasedOnDays(14)
                setStatus(!status)
              }}
            >
              {t("Last 14 days")}
            </TabsTrigger>
            <TabsTrigger
              className="hidden whitespace-nowrap rounded-md border px-3 py-1 text-base data-[state=active]:border-[#E6E2DD] data-[state=inactive]:border-transparent data-[state=active]:text-[#23262C] data-[state=inactive]:text-[#9B9A99] md:block"
              value="custom"
              onClick={() => {
                setDays(7)
                setDateBasedOnDays(7)
                setStatus(!status)
              }}
            >
              {t("Last 7 days")}
            </TabsTrigger>
          </TabsList>
        </div>
      </header>
      <main className="content relative z-50 mb-4 flex items-start bg-transparent px-0 lg:px-6">
        <div className="tabs-content flex w-full items-center justify-start">
          <TabsContent className="mt-0 size-full" value="custom">
            {repeatedJSX}
          </TabsContent>
          <TabsContent className="mt-0 size-full" value="14days">
            {repeatedJSX}
          </TabsContent>
          <TabsContent className="mt-0 size-full" value="28days">
            {repeatedJSX}
          </TabsContent>
          <TabsContent className="mt-0 size-full" value="calendar">
            {repeatedJSX}
          </TabsContent>
        </div>
      </main>
    </Tabs>
  )
}

export default InsightsFlowComponents

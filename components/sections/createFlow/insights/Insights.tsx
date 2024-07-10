import { useState, useEffect } from "react"
import { InsightsDevices } from "@/constant"
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Percent, User } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import {
  Bar,
  BarChart,
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
import { pt } from 'date-fns/locale';
import { differenceInCalendarDays, subDays } from "date-fns"

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
  if (!dateStr) return "0";
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}`;
}

const visitConverter = (data: SubmitData[], startDate: Date, endDate: Date): { time: string; visits: number }[] => {
  // Create an array of dates from startDate to endDate
  const dateArray: string[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dateArray.push(convertDate(currentDate.toDateString()));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // Map through the dateArray and replace if there's a match with convertDate(d.date)
  return dateArray.map((date: string) => {
    const matchingData = data.find((d: SubmitData) => convertDate(d.date ?? "0") === date);
    return {
      time: date,
      visits: matchingData ? matchingData.count ?? 0 : 0,
    };
  });
};


const submitConverter = (data: SubmitData[], startDate: Date, endDate: Date): { time: string; submits: number }[] => {
  // Create an array of dates from startDate to endDate
  const dateArray: string[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dateArray.push(convertDate(currentDate.toDateString()));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // Map through the dateArray and replace if there's a match with convertDate(d.date)
  return dateArray.map((date: string) => {
    const matchingData = data.find((d: SubmitData) => convertDate(d.date ?? "0") === date);
    return {
      time: date,
      submits: matchingData ? matchingData.count ?? 0 : 0,
    };
  });
}

interface SubmitData {
  time?: string
  submits?: number
  visits?: number
  date?: string
  count?: number
}
const formatDate = (dateString) => {
  if (!dateString) return "0";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const fakeDropOff = [
  {
    stepName: "Step 1",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
  {
    stepName: "Step 2",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
  {
    stepName: "Step 3",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
  {
    stepName: "Step 4",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
  {
    stepName: "Step 5",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
  {
    stepName: "Step 6",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
  {
    stepName: "Step 7",
    visits: 0,
    exits: 0,
    dropOffRate: "0",
  },
]


const setItems = (key: string, value: any) => {
  const storedFlowData = JSON.parse(localStorage.getItem('flowData') ?? "null");
  if (storedFlowData) {
    const updatedFlowData = {
      ...storedFlowData,
      [key]: value,
    };
    // Store the updated flowData object back in localStorage
    localStorage.setItem('flowData', JSON.stringify(updatedFlowData));
  }
}

const getItems = (key: string) => {
  const storedFlowData = JSON.parse(localStorage.getItem('flowData') ?? "null");
  if (storedFlowData) {
    return storedFlowData[key];
  }
}
const getInitialDate = () => {
  const storedDate = getItems('date')
  if (storedDate) {
    return {
      startDate: new Date(storedDate.startDate),
      endDate: new Date(storedDate.endDate),
    };
  } else {
    return {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    };
  }
};


const navbarHighlighter = () => {
  const storedDate = getItems('date')
  if (storedDate) {
    const startDate = storedDate.startDate;
    const endDate = storedDate.endDate;
    const isToday = (new Date().toDateString() === new Date(endDate).toDateString());
    const difference = differenceInCalendarDays(new Date(endDate), new Date(startDate));

    if (isToday && difference === 7) {
      return "custom"
    }
    else if (isToday && difference === 14) {
      return "14days"
    }
    else if (isToday && difference === 28) {
      return "28days"
    }
    else {
      return "calendar"
    }
  } else {
    return "custom"
  }
}

const InsightsFlowComponents = () => {
  const currentPath = usePathname();
  const [paddingScreen, setPaddingScreen] = useState<string>("inherit")
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // Determine height based on window width
  const getHeight = () => {
    return windowSize < 600 ? 'fit-content' : 350;
  };

  useEffect(() => {
    if (windowSize <= 390) {
      setPaddingScreen("0.3rem")
    } else if (windowSize <= 450) {
      setPaddingScreen("0.4rem")
    } else {
      getHeight()
      setPaddingScreen("inherit")
    }
  }, [windowSize])


  const [date, setDate] = useState(() => {
    return getInitialDate();
  })
  const [days, setDays] = useState(() => {
    const days = getItems('days') || 7;
    return days;
  })
  const [status, setStatus] = useState(false)
  // will be replaced dynamic flow id
  const [flowId, setFlowId] = useState<string | null>(null);
  const [firstRender, setFirstRender] = useState(false);
  useEffect(() => {
    const extractFlowIdFromUrl = async () => {
      const url = currentPath; // Get the current URL
      const match = url && url.match(/dashboard\/([^\/]+)\/results/); // Use regex to match the flowId
      if (match && match[1] && match[1] !== "flows") {
        setFlowId(match[1]);
        setDays(days);

        const storedFlowId = getItems("flowId")
        if (storedFlowId && match[1]) {
          if (storedFlowId !== match[1]) {
            setDays(7);
            setDate({
              startDate: subDays(new Date(), 7),
              endDate: new Date(),
            });
            const flowData = {
              flowId: match[1],
              days: 7,
              date: {
                startDate: subDays(new Date(), 7),
                endDate: new Date(),
              },
            };
            setFirstRender(true);
            localStorage.setItem('flowData', JSON.stringify(flowData));
          }
        }

      }
    };
    extractFlowIdFromUrl();
  }, []);

  const [dataKey, setDataKey] = useState(getItems('dataKey') ?? 'visits');

  useEffect(() => {
    setItems('dataKey', dataKey)
  }, [dataKey]);

  const [data, setData] = useState<SubmitData[]>(visitsAndSubmitsData);
  let [dropoff, setDropoff] = useState<Dropoff[]>(() => {
    const dataRes = getItems('Dropoff');
    if (dataRes) {
      const parsedData = dataRes // Parse the dataRes string into an object
      return parsedData
    } else {
      []
    }
  });

  const t = useTranslations("CreateFlow.ResultsPage");
  const locale = useLocale() // Get the locale from the query parameters
  const datePickerLocale = locale === 'pt' ? pt : undefined

  const [analytics, setAnalytics] = useState<Analytics>({
    totalVisits: 0,
    totalSubmits: 0,
    conversionRate: '0',
    desktopDevicePercentage: '0',
    mobileDevicePercentage: '0',
    submitsArray: visitsAndSubmitsData,
    uniqueVisitsArray: visitsAndSubmitsData,
  })
  useEffect(() => {
    // Parse analytics from local storage when component mounts or updates
    const dataRes = getItems('analyticsData');
    if (dataRes) {
      const parsedData = dataRes; // Parse the dataRes string into an object
      setAnalytics(parsedData);
      if (dataKey === "submits" && parsedData.submitsArray?.length > 0) setData(submitConverter(parsedData.submitsArray, date.startDate, date.endDate))
      else if (dataKey === "visits" && parsedData.uniqueVisitsArray?.length > 0) setData(visitConverter(parsedData.uniqueVisitsArray, date.startDate, date.endDate))
      else if (dataKey === "submits" && parsedData.submitsArray?.length <= 0) setData(submitConverter(visitsAndSubmitsData, date.startDate, date.endDate))
      else if (dataKey === "visits" && parsedData.uniqueVisitsArray?.length <= 0) setData(visitConverter(visitsAndSubmitsData, date.startDate, date.endDate))
    }
  }, []);
  function setDateBasedOnDays(day: number) {
    setDate({
      startDate: subDays(new Date(), day),
      endDate: new Date(),
    })
    setItems('date', {
      startDate: subDays(new Date(), day),
      endDate: new Date(),
    })
  }

  useEffect(() => {
    const getDropoff = async () => {
      const response = await fetch(`/api/analytics/dropoff/?flowId=${flowId}&startDate=${formatDate(date.startDate)}&endDate=${formatDate(date.endDate)}`)
      const dataRes = await response.json()
      setDropoff(dataRes)
      setItems('Dropoff', dataRes)
    }
    if (flowId) {
      getDropoff()
    }
  }, [status])

  useEffect(() => {
    const getAnalytics = async () => {
      console.log("date endDate", formatDate(date.endDate))
      const response = await fetch(
        `/api/analytics/?flowId=${flowId}&startDate=${formatDate(date.startDate)}&endDate=${formatDate(date.endDate)}`
      )
      const dataRes = await response.json()
      setAnalytics(dataRes)
      setItems('analyticsData', dataRes)
      if (dataKey === "submits" && dataRes.submitsArray.length > 0) setData(submitConverter(dataRes.submitsArray, date.startDate, date.endDate))
      else if (dataKey === "visits" && dataRes.uniqueVisitsArray.length > 0) setData(visitConverter(dataRes.uniqueVisitsArray, date.startDate, date.endDate))
      else if (dataKey === "submits" && dataRes.submitsArray.length <= 0) setData(submitConverter(dataRes.submitsArray, date.startDate, date.endDate))
      else if (dataKey === "visits" && dataRes.uniqueVisitsArray.length <= 0) setData(visitConverter(dataRes.uniqueVisitsArray, date.startDate, date.endDate))
    }
    if (flowId) {
      getAnalytics()
    }
  }, [status, flowId])

  const repeatedJSX = (
    <>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4">
        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-normal tracking-tight font-geist text-muted-foreground"
              style={{ color: "#71717A" }}
            >
              {t("Visits")}
            </h3>
            <User />
          </div>
          <div className="flex flex-1 flex-col justify-end p-6 pt-0">
            <div className="text-4xl font-semibold font-geist" style={{ color: "#09090B" }}>
              {analytics.totalVisits || 0}
            </div>
            <p className="text-xs text-muted-foreground font-geist" style={{ color: "#71717A" }}>
              {t("visits from last month", { visits: "0%" })}
            </p>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-normal tracking-tight font-geist text-muted-foreground" style={{ color: "#71717A" }}>
              {t("Submits")}
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
            <div className=" text-4xl font-semibold font-geist" style={{ color: "#09090B" }}>{analytics.totalSubmits}</div>
            <p className="text-xs text-muted-foreground font-geist" style={{ color: "#71717A" }}>
              {t("submits from last month", { submits: "0%" })}
            </p>
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-normal tracking-tight font-geist text-muted-foreground" style={{ color: "#71717A" }}>
              {t("Conversion Rate")}
            </h3>
            <Percent />
          </div>
          <div className="flex flex-1 flex-col justify-end p-6 pt-0">
            <div className=" text-4xl font-semibold font-geist" style={{ color: "#09090B" }}>{analytics.conversionRate}</div>
            <p className="text-xs text-muted-foreground font-geist" style={{ color: "#71717A" }}>
              {t("conversionRate from last month", {
                conversionRate: "0%",
              })}
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
                <p className="pb-1 text-sm font-medium tracking-tight font-geist text-muted-foreground">
                  {t("Desktop")}
                </p>
              </div>
              <span className=" text-4xl font-semibold font-geist">
                {`${String(analytics.desktopDevicePercentage) === '0' ? 0 : Number(analytics.desktopDevicePercentage).toFixed(1)} `}%
              </span>
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
                <p className="pb-1 text-sm font-medium tracking-tight font-geist text-muted-foreground">
                  {t("Mobile")}
                </p>
              </div>
              <span className=" text-4xl font-semibold font-geist">
                {`${String(analytics.mobileDevicePercentage) === '0.00' || String(analytics.mobileDevicePercentage) === '0' ? 0 : Number(analytics.mobileDevicePercentage).toFixed(1)}`}%
              </span>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start" style={{ marginBottom: '70px', height: getHeight() }}>
        <Card className="w-full">
          <div className="p-[0.70rem] flex justify-start">
            <div className="p-0.5 flex gap-0 bg-secondary rounded-lg">
              <Button
                variant="secondary"
                className={`text-sm rounded-md border ${dataKey === "visits"
                  ? "bg-white border-input hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={() => {
                  setDataKey("visits")
                  setData(visitConverter(analytics.uniqueVisitsArray, date.startDate, date.endDate))
                }}
                size="sm"
              >
                {t("Visits")}
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border hover:bg-white ${dataKey === "submits"
                  ? "bg-white border-input hover:bg-white"
                  : "bg-transparent border-transparent hover:bg-transparent"
                  }`}
                onClick={() => {
                  setDataKey("submits")
                  setData(submitConverter(analytics.submitsArray, date.startDate, date.endDate))
                }}
                size="sm"
              >
                {t("Submits")}
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
                <YAxis dataKey={dataKey} fontSize={14} />
                <Tooltip cursor={false} />
                {/* <Legend /> */}
                <Bar
                  dataKey={dataKey}
                  fill="#000"
                  activeBar={<Rectangle fill="#000" />}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="w-full h-full min-h-[350px]">
          <div className="overflow-x-hidden sm:overflow-x-auto w-full h-full">
            <Table className="w-full h-full">
              <TableHeader>
                <TableRow className="p-[0.60rem]">
                  <TableHead className="whitespace-nowrap p-[0.60rem] pr-0">#</TableHead>
                  <TableHead className="whitespace-nowrap p-[0.60rem]" style={{ padding: paddingScreen }}>{t("Step")}</TableHead>
                  <TableHead className="whitespace-nowrap p-[0.60rem]" style={{ padding: paddingScreen }}>{t("Views")}</TableHead>
                  <TableHead className="whitespace-nowrap p-[0.60rem]" style={{ padding: paddingScreen }}>{t("Exits")}</TableHead>
                  <TableHead className="whitespace-wrap p-[0.60rem]" style={{ padding: paddingScreen }}>{t("Drop-off rate")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                {dropoff && dropoff.length > 0 ? (
                  dropoff.map((item, index) => (
                    <TableRow key={index} className="p-[0.60rem]"> {/* Reduced padding here */}
                      <TableCell className="p-[0.60rem] pr-0">{index + 1}</TableCell>
                      <TableCell className="p-[0.60rem] whitespace-wrap" style={{ padding: paddingScreen }}>{item.stepName}</TableCell>
                      <TableCell className="p-[0.60rem]" style={{ padding: paddingScreen }}>{item.visits}</TableCell>
                      <TableCell className="p-[0.60rem]" style={{ padding: paddingScreen }}>{item.exits}</TableCell>
                      <TableCell className="p-[0.60rem]" style={{ padding: paddingScreen }}>{item.dropOffRate.split('.')[0]}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  fakeDropOff.map((item, index) => (
                    <TableRow key={index} className="p-[0.60rem]"> {/* Reduced padding here */}
                      <TableCell className="p-[0.60rem]">{index + 1}</TableCell>
                      <TableCell className="p-[0.60rem] whitespace-wrap" style={{ padding: paddingScreen }}>{item.stepName}</TableCell>
                      <TableCell className="p-[0.60rem]" style={{ padding: paddingScreen }}>{item.visits}</TableCell>
                      <TableCell className="p-[0.60rem]" style={{ padding: paddingScreen }}>{item.exits}</TableCell>
                      <TableCell className="p-[0.60rem]" style={{ padding: paddingScreen }}>{item.dropOffRate}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div >
    </>
  )
  return (
    <Tabs defaultValue={navbarHighlighter()}
      className="">
      <header className="mt-4 flex items-center gap-4 px-0 lg:px-6">
        <div className="tabs-list-container flex items-center justify-start rounded-lg bg-white p-[0.70rem] overflow-x-hidden">
          <TabsList className="flex h-full bg-inherit py-0 overflow-x-auto" >
            <TabsTrigger
              className="[&>div>button]:data-[state=active]:border-input [&>div>button]:data-[state=inactive]:border-transparent [&>div>button]:data-[state=inactive]:bg-transparent [&>div>button]:data-[state=active]:bg-muted [&>div>button]:font-medium"
              value="calendar"
              onClick={() => {
                setDays(days);
                setDateBasedOnDays(days);
              }}
            >
              <DatePickerWithRange className="" firstRender={firstRender} days={days} setDays={setDays} locale={datePickerLocale} status={status} setStatus={setStatus} setDater={(v: any) => setDate({ startDate: v.startDate, endDate: v.endDate })} />
            </TabsTrigger>
            <TabsTrigger
              className="px-3 py-1 text-sm font-medium data-[state=active]:bg-muted data-[state=inactive]:bg-transparent rounded-md border data-[state=active]:border-input data-[state=inactive]:border-transparent whitespace-nowrap"
              value="28days"
              onClick={() => { setDays(28); setDateBasedOnDays(28); setStatus(!status); }}
            >
              {t("Last 28 days")}
            </TabsTrigger>
            <TabsTrigger
              className="px-3 py-1 text-sm font-medium data-[state=active]:bg-muted data-[state=inactive]:bg-transparent rounded-md border data-[state=active]:border-input data-[state=inactive]:border-transparent whitespace-nowrap"
              value="14days"
              onClick={() => { setDays(14); setDateBasedOnDays(14); setStatus(!status); }}
            >
              {t("Last 14 days")}
            </TabsTrigger>
            <TabsTrigger
              className="px-3 py-1 text-sm font-medium data-[state=active]:bg-muted data-[state=inactive]:bg-transparent rounded-md border data-[state=active]:border-input data-[state=inactive]:border-transparent whitespace-nowrap"
              value="custom"
              onClick={() => { setDays(7); setDateBasedOnDays(7); setStatus(!status); }}
            >
              {t("Last 7 days")}
            </TabsTrigger>
          </TabsList>
        </div>
      </header>
      <main className="content relative z-50 flex items-start bg-transparent px-0 mb-4 lg:px-6 mt-2">
        <div className="tabs-content flex w-full items-center justify-start">
          <TabsContent
            className="mt-0 w-full overflow-y-auto h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)]"
            value="custom"
          >
            {repeatedJSX}
          </TabsContent>
          <TabsContent
            className="mt-0 w-full overflow-y-auto h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)]"
            value="14days"
          >
            {repeatedJSX}
          </TabsContent>
          <TabsContent
            className="mt-0 w-full overflow-y-auto h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)]"
            value="28days"
          >
            {repeatedJSX}
          </TabsContent>
          <TabsContent
            className="mt-0 w-full overflow-y-auto h-[calc(100vh-232px)] lg:h-[calc(100vh-180px)]"
            value="calendar"
          >
            {repeatedJSX}
          </TabsContent>
        </div >
      </main >
    </Tabs >
  )
}

export default InsightsFlowComponents
import { useEffect, useState } from "react"
import { TIntegrationCardData } from "@/types"

import { Accordion } from "@/components/ui/accordion"
// ui componnets
import IntegrationCard from "@/components/IntegrationCard"
import SearchBar from "@/components/SearchBar"

import { DummyIntregationCardData } from "./collapsibleContents"
import { usePathname, useRouter } from "next/navigation"

import "./ConnectFlowComponents.css"
import Custom404 from "../share/404"

const extractFlowIdFromUrl = (currentPath) => {
  const url = currentPath // Get the current URL
  const match = url && url.match(/dashboard\/([^\/]+)\/connect/) // Use regex to match the flowId
  if (match && match[1] && match[1] !== "flows") {
    return match[1]
  } else if (match && match[1] === "flows") {
    return match[1]
  }
  return null
}
interface Flow {
  email: string
  googleAnalyticsId: string
  googleTagManagerId: string
  metaPixelAccessToken: string
  metaPixelId: string
}
const ConnectFlowComponents: React.FC = (): JSX.Element | null => {
  const [flowData, setFlowData] = useState<Flow>({
    email: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    metaPixelAccessToken: "",
    metaPixelId: "",
  })
  const [search, setSearch] = useState("")
  const [filteredDatas, setFilteredDatas] = useState<TIntegrationCardData[]>([])
  const currentPath = usePathname()
  const [flowId, setFlowId] = useState<string | null>(
    extractFlowIdFromUrl(currentPath)
  )
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [effectCall, setEffectCall] = useState("")

  useEffect(() => {
    if (flowId !== "flows" && flowId !== null) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error)
            setError(true)
            return
          }
          setFlowData(data)
        })
        .catch((error) => setError(true))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
      setError(false)
    }
  }, [flowId, effectCall])

  // Define the update function
  const updateStatus = (id, newStatus) => {
    // Find the index of the object in the array
    const index = filteredDatas.findIndex((item) => item.id === id)
    if (index !== -1) {
      // Update the status of the object
      const updatedData = [...filteredDatas]
      updatedData[index] = {
        ...updatedData[index],
        status: newStatus,
      }
      // Update the state with the new array
      setFilteredDatas(updatedData)
    }
  }
  useEffect(() => {
    if (search === "") {
      setFilteredDatas(DummyIntregationCardData)
    } else if (search) {
      let filteredData = DummyIntregationCardData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredDatas(filteredData)
    }
  }, [search])

  useEffect(() => {
    let filteredData = DummyIntregationCardData.map((item) => {
      if (item.title === "Email") {
        if (
          !flowData?.email ||
          flowData.email.trim() === "" ||
          flowData.email === null ||
          flowData.email === undefined
        ) {
          return { ...item, status: "inactive" }
        } else {
          return { ...item, status: "active" }
        }
      }

      if (item.title === "Google Analytics 4") {
        if (
          !flowData?.googleAnalyticsId ||
          flowData.googleAnalyticsId.trim() === "" ||
          flowData.googleAnalyticsId === null ||
          flowData.googleAnalyticsId === undefined
        ) {
          return { ...item, status: "inactive" }
        } else {
          return { ...item, status: "active" }
        }
      }

      if (item.title === "Google Tag Manager") {
        if (
          !flowData?.googleTagManagerId ||
          flowData.googleTagManagerId.trim() === "" ||
          flowData.googleTagManagerId === null ||
          flowData.googleTagManagerId === undefined
        ) {
          return { ...item, status: "inactive" }
        } else {
          return { ...item, status: "active" }
        }
      }

      if (item.title === "Meta Pixel") {
        if (
          !flowData?.metaPixelId ||
          flowData.metaPixelId === null ||
          flowData.metaPixelId === undefined ||
          flowData.metaPixelId.trim() === ""
        ) {
          return { ...item, status: "inactive" }
        } else {
          return { ...item, status: "active" }
        }
      }
      return item
    })

    setFilteredDatas(filteredData)
  }, [flowData])

  const router = useRouter()
  if (error) {
    router.push("404")
    return null
  }

  return loading ? (
    <div className="connect-flow-content max-h-[92.74vh] min-h-screen w-full overflow-auto pb-[20px]">
      <div className="mx-auto mt-8 flex flex-col items-center justify-center px-4 lg:w-7/12">
        <div className="mb-4 h-10 w-full animate-pulse rounded bg-gray-300"></div>
        <div className="mt-10 flex w-full flex-col">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="mb-2.5 animate-pulse rounded-md border bg-white shadow dark:bg-[#070e1f]"
            >
              <div className="flex min-h-32 flex-col items-start px-4 py-6 md:flex-row md:items-center">
                <div className="ml-0 md:mx-1 lg:ml-3.5 lg:mr-2.5">
                  <div className="h-16 w-16 rounded-full bg-gray-300"></div>
                </div>
                <div className="ml-0 mt-2 flex w-full items-center justify-between md:ml-1 md:mt-0 lg:ml-5">
                  <div className="w-full flex-col justify-start text-base font-normal text-black">
                    <div className="mb-1 flex items-center">
                      <div className="h-6 w-1/2 rounded bg-gray-300"></div>
                      <div className="ml-3 flex h-4 items-center rounded-2xl bg-gray-300 px-2 py-0.5"></div>
                    </div>
                    <div className="w-full text-left text-sm text-black dark:text-white">
                      <div className="h-4 w-full rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="h-24 rounded bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="connect-flow-content h-full max-h-[92.7vh] w-full overflow-auto pb-[20px]">
      <div className="md:bg-white md:py-6 py-4 md:border border-[#E6E2DD]">
        <div className="px-4 max-w-[480px] w-full mx-auto">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </div>
      <div className="mx-auto md:mt-8 flex flex-col items-center justify-center px-4 lg:w-7/12">
        <div className="flex w-full flex-col">
          {filteredDatas?.length > 0 ? (
            <Accordion type="multiple">
              {filteredDatas?.map((Integrationitem: TIntegrationCardData) => (
                <IntegrationCard
                  key={Integrationitem.id}
                  Integrationitem={Integrationitem}
                  updateStatus={updateStatus}
                  flowData={flowData}
                  setEffectCall={setEffectCall}
                />
              ))}
            </Accordion>
          ) : (
            <div className="flex h-96 w-full items-center justify-center">
              <p className="text-lg font-normal text-gray-500">
                No Integration found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectFlowComponents

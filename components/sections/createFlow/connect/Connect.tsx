import { useEffect, useState } from "react"
import { TIntegrationCardData } from "@/types"

import { Accordion } from "@/components/ui/accordion"
// ui componnets
import IntegrationCard from "@/components/IntegrationCard"
import SearchBar from "@/components/SearchBar"

import { DummyIntregationCardData } from "./collapsibleContents"
import { usePathname } from "next/navigation"

import "./ConnectFlowComponents.css";
interface Flow {
  email: string
  googleAnalyticsId: string
  googleTagManagerId: string
  metaPixelAccessToken: string
}
const ConnectFlowComponents = () => {
  const [flowData, setFlowData] = useState<Flow>({
    email: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    metaPixelAccessToken: ""
  })
  const [search, setSearch] = useState("")
  const [filteredDatas, setFilteredDatas] = useState<TIntegrationCardData[]>([])
  const currentPath = usePathname()
  const [flowId, setFlowId] = useState<string | null>(null);

  useEffect(() => {
    const extractFlowIdFromUrl = async () => {
      const url = currentPath; // Get the current URL
      const match = url && url.match(/dashboard\/([^\/]+)\/connect/); // Use regex to match the flowId
      if (match && match[1] && match[1] !== "flows") {
        setFlowId(match[1]);
      }
    };
    extractFlowIdFromUrl();
  }, []);

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFlowData(data)
        })
        .catch((error) => console.error("Error fetching user data:", error))
    }
  }, [flowId])


  // Define the update function
  const updateStatus = (id, newStatus) => {
    // Find the index of the object in the array
    const index = filteredDatas.findIndex((item) => item.id === id)
    if (index !== -1) {
      // Update the status of the object
      const updatedData = [...filteredDatas]
      updatedData[index] = {
        ...updatedData[index], status: newStatus,
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
        if (!flowData?.email || flowData.email.trim() === "" || flowData.email === null || flowData.email === undefined) {
          return { ...item, status: 'inactive' };
        } else {
          return { ...item, status: 'active' };
        }
      }

      if (item.title === "Google Analytics 4") {
        if (!flowData?.googleAnalyticsId || flowData.googleAnalyticsId.trim() === "" || flowData.googleAnalyticsId === null || flowData.googleAnalyticsId === undefined) {
          return { ...item, status: 'inactive' };
        } else {
          return { ...item, status: 'active' };
        }
      }

      if (item.title === 'Google Tag Manager') {
        if (!flowData?.googleTagManagerId || flowData.googleTagManagerId.trim() === "" || flowData.googleTagManagerId === null || flowData.googleTagManagerId === undefined) {
          return { ...item, status: 'inactive' };
        } else {
          return { ...item, status: 'active' };
        }
      }

      if (item.title === 'Meta Pixel') {
        if (!flowData?.metaPixelAccessToken || flowData.metaPixelAccessToken === null || flowData.metaPixelAccessToken === undefined || flowData.metaPixelAccessToken.trim() === "") {
          return { ...item, status: 'inactive' };
        } else {
          return { ...item, status: 'active' };
        }
      }
      return item;
    });

    setFilteredDatas(filteredData);
  }, [flowData])

  return (
    <div className="min-h-screen w-full overflow-auto pb-[80px] connect-flow-content" style={{ height: '100vh' }}>
      <div
        className="mx-auto mt-8  flex lg:w-7/12 px-4 flex-col items-center justify-center"
      >
        <SearchBar search={search} setSearch={setSearch} />
        <div className="mt-10 flex w-full flex-col">
          {filteredDatas?.length > 0 ? (
            <Accordion type="multiple">
              {filteredDatas?.map((Integrationitem: TIntegrationCardData) => (
                <IntegrationCard
                  key={Integrationitem.id}
                  Integrationitem={Integrationitem}
                  updateStatus={updateStatus}
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

import { useEffect, useState } from "react"
import { TIntegrationCardData } from "@/types"

import { Accordion } from "@/components/ui/accordion"
// ui componnets
import IntegrationCard from "@/components/IntegrationCard"
import SearchBar from "@/components/SearchBar"

import { DummyIntregationCardData } from "./collapsibleContents"
import { usePathname } from "next/navigation"

import "./ConnectFlowComponents.css";

const ConnectFlowComponents = () => {
  const [flowData, setFlowData] = useState<TIntegrationCardData | (() => TIntegrationCardData)>({} as TIntegrationCardData)
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

  /* 
  // POST request for creating integrations
  useEffect(() => {
    fetch("/api/flows/cly5ykibm000113jys2uywqmi/integrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify({
        "googleAnalyticsId": "GOOGLE_ANALYTICS_IDDDDDDDEEEDDD"
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("POST request", data))
      .catch((error) => console.log("Error fetching user data:", error))
  }, [])
  */

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

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}/integrations/cly7aycol0003ldftt9so8tod`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "googleAnalyticsId": "UA-123456789-1",
          "email": "someone@gmail.com",
        }),
      })
        .then((res) => res.json())
        // .then((data) => console.log("PUT request", data))
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

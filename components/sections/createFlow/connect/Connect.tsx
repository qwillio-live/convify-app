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
  const currentPath = usePathname();
  const [search, setSearch] = useState("")
  const [filteredDatas, setFilteredDatas] = useState<TIntegrationCardData[]>([])
  const [integrations, setIntegrations] = useState("")
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
      fetch(`/dashboard/${flowId}/connect`)
        .then((res) => res.json())
        .then((data) => {
          setIntegrations(data)
          console.log("data", data)
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

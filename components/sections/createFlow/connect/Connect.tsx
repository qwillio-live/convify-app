import { useEffect, useState } from "react"
import { TIntegrationCardData } from "@/types"

import { Accordion } from "@/components/ui/accordion"
// ui componnets
import IntegrationCard from "@/components/IntegrationCard"
import SearchBar from "@/components/SearchBar"

import { DummyIntregationCardData } from "./collapsibleContents"


const ConnectFlowComponents = () => {
  // const [email, setEmail] = useState<string>("user@email.com")
  const [search, setSearch] = useState("")
  const [filteredDatas, setFilteredDatas] = useState<TIntegrationCardData[]>([])
  // useEffect(() => {
  //   fetch("/api/users")
  //     .then((res) => res.json())
  //     .then((data) => setEmail(data.email))
  //     .catch((error) => console.error("Error fetching user data:", error))
  // }, [])
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
    <div className="min-h-screen w-full">
      <div
        className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center justify-center px-2 sm:px-4 lg:px-8"
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

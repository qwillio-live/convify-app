import { useEffect, useState } from "react"
import { DummyIntregationCardData } from "@/constant"
import { TIntegrationCardData } from "@/types"

// ui componnets
import IntegrationCard from "@/components/IntegrationCard"
import SearchBar from "@/components/SearchBar"

const ConnectFlowComponents = () => {
  const [search, setSearch] = useState("")
  const [filteredDatas, setFilteredData] = useState<TIntegrationCardData[]>([])

  useEffect(() => {
    if (search === "") {
      setFilteredData(DummyIntregationCardData)
    } else if (search) {
      let filteredData = DummyIntregationCardData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )

      setFilteredData(filteredData)
    }
  }, [search])

  return (
    <div className="min-h-screen w-full">
      <div
        className="mx-auto mt-8 flex w-7/12
        flex-col items-center justify-center"
      >
        <SearchBar search={search} setSearch={setSearch} />
        <div className="mt-10 flex w-full flex-col">
          {filteredDatas?.length > 0 ? (
            filteredDatas?.map((Integrationitem: TIntegrationCardData) => (
              <IntegrationCard
                key={Integrationitem.id}
                Integrationitem={Integrationitem}
              />
            ))
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
import { useState } from "react"
import { DummyIntregationCardData } from "@/constant"
import { TIntegrationCardData } from "@/types"

// ui componnets
import IntegrationCard from "@/components/IntegrationCard"
import SearchBar from "@/components/SearchBar"

const ConnectFlowComponents = () => {
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen w-full">
      <div
        className="mx-auto mt-8 flex w-7/12
        flex-col items-center justify-center"
      >
        <SearchBar search={search} setSearch={setSearch} />
        <div className="mt-10 flex w-full flex-col">
          {DummyIntregationCardData.filter((item) => {
            if (
              search === "" ||
              item.title.toLowerCase().includes(search.toLowerCase())
            ) {
              return item
            }
          }).map((Integrationitem: TIntegrationCardData) => (
            <IntegrationCard
              key={Integrationitem.id}
              Integrationitem={Integrationitem}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConnectFlowComponents

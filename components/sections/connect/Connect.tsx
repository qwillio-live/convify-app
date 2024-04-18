// ui componnets

import { useState } from "react"

import SearchBar from "@/components/SearchBar"

const ConnectFlowComponents = () => {
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen w-full">
      <div
        className="mx-auto mt-8 flex w-2/4
        flex-col items-center justify-center"
      >
        <SearchBar search={search} setSearch={setSearch} />
      </div>
    </div>
  )
}

export default ConnectFlowComponents

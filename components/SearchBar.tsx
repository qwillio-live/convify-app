import React from "react"
// icons
import { Search, X } from "lucide-react"

// ui componnets
import { Input } from "./ui/input"

interface SearchBarProps {
  search: string
  setSearch: (search: string) => void
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  return (
    <div className="flex w-full items-center rounded-md border-DEFAULT border-solid border-gray-400 px-3">
      <Search className="size-3.5" />
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search integations"
          value={search}
          className="w-full border-none bg-transparent py-4 text-sm font-medium outline-none placeholder:text-muted-foreground  focus-visible:outline-none
          focus-visible:ring-0 focus-visible:ring-offset-0
          "
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <X
            onClick={() => setSearch("")}
            className="pointer absolute right-0 top-[32%] size-3.5"
          />
        )}
      </div>
    </div>
  )
}

export default SearchBar

// icons
import { Search, X } from "lucide-react"
// ui componnets
import { useTranslations } from "next-intl"

import { Input } from "./ui/input"

interface SearchBarProps {
  search: string
  setSearch: (search: string) => void
}

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  const t = useTranslations("CreateFlow.ConnectPage")

  return (
    <div className="flex w-full items-center rounded-md border-[1px] border-solid border-gray-400 px-3 bg-white">
      <Search className="h-3.5 w-3.5" />
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={t("Search integations")}
          value={search}
          className="w-full border-none bg-transparent py-4 text-sm font-medium outline-none placeholder:text-muted-foreground  focus-visible:outline-none
          focus-visible:ring-0 focus-visible:ring-offset-0
          "
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <X
            onClick={() => setSearch("")}
            className="pointer absolute right-0 top-[32%] h-3.5 w-3.5"
          />
        )}
      </div>
    </div>
  )
}

export default SearchBar

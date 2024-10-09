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
    <div className="flex w-full items-center rounded-[8px] border border-[#E6E2DD] px-4 bg-white">
      <Search className="h-4 w-4 text-[#23262C] -mr-1" />
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={t("Search integations")}
          value={search}
          className="w-full border-none bg-transparent py-4 text-sm outline-none placeholder:text-[#9B9A99] focus-visible:outline-none
          focus-visible:ring-0 focus-visible:ring-offset-0 font-poppins"
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <X
            onClick={() => setSearch("")}
            className="pointer absolute right-0 top-[32%] h-4 w-4 text-[#23262C]"
          />
        )}
      </div>
    </div>
  )
}

export default SearchBar

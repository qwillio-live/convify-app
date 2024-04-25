import { TSelectOptions } from "@/types"
import { MonitorSpeaker } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomSelectProps<T> {
  selected: T
  setSelected: () => void
  selectedOptions: Array<T>
  placeholder: string
}

export function CustomSelect({
  selected,
  setSelected,
  selectedOptions,
  placeholder,
}: CustomSelectProps<TSelectOptions>) {
  const { value } = selected // Optional
  return (
    <Select defaultValue={value} onValueChange={setSelected}>
      <SelectTrigger className="focus:ring-none w-[180px] bg-gray-200 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ">
        <MonitorSpeaker />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {selectedOptions?.map((item) => (
          <SelectItem key={item.id} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

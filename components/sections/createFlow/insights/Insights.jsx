import { useState } from "react"
import { InsightsDevices } from "@/constant"

import { CustomSelect } from "@/components/CustomSelect"
import { DatePicker } from "@/components/DatePicker"

const InsightsFlowComponents = () => {
  const [date, setDate] = useState(new Date())
  const [selected, setSelected] = useState(InsightsDevices[0] || {})
  return (
    <div className="flex  flex-col">
      <div className="flex gap-3 border-b py-4">
        <div className="w-[40%]">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="w-[40%]">
          <CustomSelect
            selectedOptions={InsightsDevices}
            setSelected={setSelected}
            selected={selected}
            placeholder="Select device"
          />
        </div>
      </div>
    </div>
  )
}

export default InsightsFlowComponents

import { useState } from "react"
import { InsightsDevices } from "@/constant"

import { CustomSelect } from "@/components/CustomSelect"
import { DatePicker } from "@/components/DatePicker"
import { LocalImages } from "@/public/images"
import Image from "next/image"

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

      <div className="mt-10 text-2xl">Big picture</div>
      <div className="flex gap-10 py-4">
        <div className="w-[40%]">
          <div>Views</div>
          <div className="text-5xl">0</div>
        </div>
        <div className="w-[40%]">
          <div>Starts</div>
          <div className="text-5xl">0</div>
        </div>
        <div className="w-[40%]">
          <div>Submissions</div>
          <div className="text-5xl">0</div>
        </div>
        <div className="w-[40%]">
          <div>Completion rate</div>
          <div className="text-5xl">-</div>
        </div>
        <div className="w-[40%]">
          <div>Time To Complete</div>
          <div className="text-5xl">-</div>
        </div>
      </div>

      <div style={{ backgroundImage: "url('/images/bigPicture.png')", backgroundRepeat: "no-repeat", backgroundSize: "100% 370px" }}>
        <div className="flex justify-center" style={{background: "linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 90%)", padding: "40px"}}>

          <div className="m-auto items-center">
          <span className="text-sm leading-32 block text-center font-light items-center">
            QUESTION DROP-OFF RATE
          </span>

            <div className="mt-5 max-w-[360px]">
              <span className="block text-center text-xl leading-5 opacity-90 w-90" style={{ marginTop: "17px", fontSize: "24px", lineHeight: "33px" }}>
                Find out exactly where you're losing people
              </span>
              <span className="block text-center text-sm justify-center opacity-90 w-40 mt-2">
                See where people abandon your typeform—the first step to improving your questions so you get more responses
              </span>
              <span className="block text-center text-sm justify-center opacity-90 w-40 mt-2" style={{color: "rgb(2, 80, 65)"}}>
                Available on these plans: Business, Enterprise
              </span>
              <span className="block text-center text-sm justify-center opacity-90 w-40" style={{ marginTop: "17px" }}>
                <button className="button btn bg-green-900 rounded" style={{ backgroundColor: "rgb(2, 100, 81)", color: "#fff", padding: "10px" }}>Upgrade my plan</button>
              </span>
            </div>
          </div>


        </div>
      </div>
      <div style={{textAlign: "end", textDecoration: "underline", color: "rgb(2, 80, 65)"}}>Learn more about drop-off</div>
    </div>
  )
}

export default InsightsFlowComponents

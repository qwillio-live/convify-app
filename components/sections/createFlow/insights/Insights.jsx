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
        <div className="w-2/5">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="w-2/5 ">
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
        <div className="w-2/5">
          <div>Views</div>
          <div className="text-5xl">0</div>
        </div>
        <div className="w-2/5">
          <div>Starts</div>
          <div className="text-5xl">0</div>
        </div>
        <div className="w-2/5">
          <div>Submissions</div>
          <div className="text-5xl">0</div>
        </div>
        <div className="w-2/5">
          <div>Completion rate</div>
          <div className="text-5xl">-</div>
        </div>
        <div className="w-2/5">
          <div>Time To Complete</div>
          <div className="text-5xl">-</div>
        </div>
      </div>

      <div style={{ backgroundImage: "url('/images/bigPicture.png')", backgroundRepeat: "no-repeat", backgroundSize: "100% 370px" }}>
        <div className="flex justify-center" style={{background: "linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 90%)", padding: "40px"}}>

          <div className="m-auto items-center">
          <span className="leading-32  block items-center text-center  text-sm  font-light ">
            QUESTION DROP-OFF RATE
          </span>

            <div className="mt-5 max-w-[360px]">
              <span className="w-90 block text-center text-xl leading-5  opacity-90 " style={{ marginTop: "17px", fontSize: "24px", lineHeight: "33px" }}>
                Find out exactly where you&apos;re losing people
              </span>
              <span className="mt-2 block w-40 justify-center text-center text-sm opacity-90 ">
                See where people abandon your typeform—the first step to improving your questions so you get more responses
              </span>
              <span className="mt-2 block w-40 justify-center text-center text-sm  opacity-90 " style={{color: "rgb(2, 80, 65)"}}>
                Available on these plans: Business, Enterprise
              </span>
              <span className="block w-40 justify-center  text-center text-sm  opacity-90 " style={{ marginTop: "17px" }}>
                <button className="button btn rounded bg-green-900 " style={{ backgroundColor: "rgb(2, 100, 81)", color: "#fff", padding: "10px" }}>Upgrade my plan</button>
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

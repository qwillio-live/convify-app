import Image from "next/image"
import * as logo from "@/assets/convify_logo_black.svg"

import SelectTemplate from "@/components/select-template"

export default function SelectTemplatePage() {
  return (
    <div className="pt-8 pb-6 px-6 min-[960px]:py-12 min-[960px]:px-20">
      <div className="w-full min-[960px]:w-[80%] mx-auto">
        <div className="">
          <Image src={logo} alt="logo" className="min-[960px]:mb-4 mb-6 w-24" />
          <p className="text-[21px] leading-[1.36188] text-[#8a8a8a] min-[960px]:mb-4 mb-0">
            Building your first flow
          </p>
          <h1 className="text-[#1a1a1a] text-4xl min-[960px]:text-5xl mb-4 font-heading font-bold tracking-[-1.25px]">
            Your ideal template to start with
          </h1>
        </div>
        <div>
          <SelectTemplate />
        </div>
      </div>
    </div>
  )
}

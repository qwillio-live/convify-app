import Image from "next/image"
import * as logo from "@/assets/convify_logo_black.svg"

import SelectTemplate from "@/components/select-template"

export default function SelectTemplatePage() {
  return (
    <div className="pt-8 pb-6 px-6 lg:py-12 lg:px-20">
      <div className="w-full lg:w-[80%] mx-auto">
        <div className="">
          <Image src={logo} alt="logo" className="mb-4 w-24" />
          <p className="text-[21px] leading-[1.36188] text-[#8a8a8a] mb-4">
            Building your first flow
          </p>
          <h1 className="text-[#1a1a1a] text-4xl lg:text-5xl mb-4 font-heading font-bold">
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

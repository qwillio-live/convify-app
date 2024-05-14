import Image from "next/image"
import * as logo from "@/assets/convify_logo_black.svg"

import SelectTemplate from "@/components/select-template"

export default function SelectTemplatePage() {
  return (
    <div className="pt-8 pb-6 px-6 lg:px-12 lg:py-20">
      <div className="w-full lg:w-[80%] mx-auto">
        <div className="">
          <Image src={logo} alt="logo" className="mb-4" />
          <p className="text-xl text-gray-500 mb-4">Building your first flow</p>
          <h1 className="text-black text-4xl lg:text-5xl font-bold mb-4">
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

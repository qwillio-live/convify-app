"use client"
import ShareFlowComponents from "@/components/sections/createFlow/share/Share"
import Header from "../constants/headerEls"

export default function CreateFlowsPage({
  params,
}: {
  params: { flowId: string; en: string }
}) {
  const flowId = params?.flowId
  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-[60]">
          <Header />
        </div>
        <main className="content relative h-full flex-1 overflow-hidden border-t bg-[#FAFAFA]">
          <ShareFlowComponents isPublished={false} data={null} />
        </main>
      </div>
      {/* <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all delay-0 duration-200 ease-in-out">
        <button className="relative size-8 cursor-pointer rounded-[50%] border border-solid border-transparent bg-white p-0 shadow-[rgba(0,0,0,0.08)_0px_2px_4px,rgba(0,0,0,0.06)_0px_2px_12px,rgba(0,0,0,0.04)_0px_8px_14px,rgba(0,0,0,0.02)_0px_12px_16px] outline-none transition-all duration-500 ease-in hover:bg-[rgb(231,231,231)]">
          <div className="flex size-auto cursor-pointer items-center justify-center">
            <span className="SVGInline">
              <svg
                className="SVGInline-svg"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fillRule="evenodd">
                  <path
                    d="M0 5h2v.088H0V5zm0-1.25C0 1.494 1.626 0 4 0c2.377 0 4 1.488 4 3.75 0 1.462-.636 2.323-1.885 3.164l-.44.29c-.33.221-.482.355-.54.455C5.068 7.774 4.999 8.25 5 9l-2 .003c-.002-1.083.108-1.835.405-2.347.255-.439.59-.732 1.158-1.113l.435-.287C5.75 4.748 6 4.41 6 3.75 6 2.633 5.309 2 4 2c-1.305 0-2 .638-2 1.75v1.338H0V3.75z"
                    fillRule="nonzero"
                  ></path>
                  <path d="M3 10h2v2H3z"></path>
                </g>
              </svg>
            </span>
          </div>
        </button>
      </div> */}
    </div>
  )
}

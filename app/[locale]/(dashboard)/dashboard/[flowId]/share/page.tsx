"use client"
import ShareFlowComponents from "@/components/sections/createFlow/share/Share"
import Header from "../constants/headerEls"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Custom404 from "@/components/sections/createFlow/share/404"
import { resetScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch } from "@/lib/state/flows-state/hooks"

export default function CreateFlowsPage({
  params,
}: {
  params: { flowId: string; en: string }
}) {
  const currentPath = usePathname()
  const flowId = params?.flowId
  const [isPublished, setIsPublished] = useState<boolean>(false)
  const [isPublishedLoading, setIsPublishedLoading] = useState<boolean>(true)
  const [data, setData] = useState<any>({})
  const [error, setError] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (flowId) {
      fetch(`/api/flows/${flowId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error)
            setError(true)
            return
          }
          setData(data)
          setIsPublished(data.isPublished)
          setIsPublishedLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setError(true)
        })
    }
    dispatch(resetScreen())
  }, [flowId])

  if (error) {
    return <Custom404 />
  }

  return (
    <div className="fixed min-h-screen w-full overflow-hidden">
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-[60]">
          <Header flowId={flowId} />
        </div>
        <main className="content relative h-full flex-1 overflow-hidden border-t bg-[#FAFAFA]">
          {isPublishedLoading ? (
            <div className="hidden h-[calc(-52px+98vh)] flex-row items-start justify-between sm:flex">
              <div className="relative flex h-full w-64 flex-col overflow-hidden border-r border-[rgba(0,0,0,0.07)] bg-white">
                <nav className="grid items-start text-sm font-medium">
                  <div className="flex-0 border-b border-solid border-b-[rgba(0,0,0,0.07)] bg-[rgb(227,227,227)] px-4 py-2 font-medium leading-8 text-[rgb(38,38,39)] no-underline transition-[background] delay-0 duration-200 ease-in hover:bg-[rgb(240,240,240)]">
                    <div className="h-4 animate-pulse rounded bg-gray-300"></div>
                  </div>
                  <div className="flex-0 cursor-pointer border-b border-solid border-b-[rgba(0,0,0,0.07)] px-4 py-2 font-medium leading-8 text-[rgb(38,38,39)] no-underline transition-[background] delay-0 duration-200 ease-in hover:bg-[rgb(240,240,240)]">
                    <div className="h-4 animate-pulse rounded bg-gray-300"></div>
                  </div>
                  <div className="flex-0 cursor-pointer border-b border-solid border-b-[rgba(0,0,0,0.07)] px-4 py-2 font-medium leading-8 text-[rgb(38,38,39)] no-underline transition-[background] delay-0 duration-200 ease-in hover:bg-[rgb(240,240,240)]">
                    <div className="h-4 animate-pulse rounded bg-gray-300"></div>
                  </div>
                </nav>
                <div className="flex min-h-0 min-w-0 flex-1 pt-3"></div>
              </div>

              {/* Middle part */}
              <div className="h-full flex-1 overflow-hidden bg-[#FAFAFA] px-10 py-8">
                {/* Content */}
                <div className="flex h-full flex-col text-sm text-[rgb(38,38,39)]">
                  <div className="m-auto w-full max-w-[608px] flex-[0_0_auto]">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex w-full max-w-[267.3px] items-center">
                        <div className="inline-block w-full max-w-[350px] flex-[0_0_auto]">
                          <div className="ease durationease-in flex items-center rounded-[4px] rounded-r-none border border-solid border-[rgb(187,187,187)] bg-white text-[rgb(38,38,38)] transition-all">
                            <div className="flex-1">
                              <div className="h-6 w-full animate-pulse rounded bg-gray-300"></div>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled
                          className="flex h-7 w-auto flex-[0_0_auto] cursor-pointer items-center gap-[6px] whitespace-nowrap rounded-[4px] rounded-l-none border border-solid border-transparent bg-[rgb(38,38,38)] px-3 py-1 text-sm font-medium text-white outline-none transition-all duration-200 hover:bg-[rgb(76,76,76)]"
                        >
                          <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled
                        className="relative m-0 inline-block cursor-pointer border-none p-0 text-[rgb(115,115,115)] underline outline-none"
                      >
                        <div className="h-2 w-24 animate-pulse rounded bg-gray-300"></div>
                      </button>
                    </div>
                    <div className="text-[rgb(38,38,39)]] py-3 text-sm">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <div
                              key={index}
                              className="mx-1 flex h-[32px] w-11 flex-[0_0_auto] animate-pulse cursor-pointer items-center justify-center rounded-[4px] bg-gray-300"
                            ></div>
                          ))}
                        </div>
                        <div className="flex">
                          <button
                            className="flex flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] text-[rgb(115,115,115)] no-underline hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                            disabled
                          >
                            <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
                          </button>
                          <button
                            aria-label="qr code"
                            className="flex flex-[0_0_auto] cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] bg-transparent px-3 py-[6px] text-[rgb(115,115,115)] no-underline hover:bg-[rgb(227,227,227)] hover:text-[rgb(76,76,76)]"
                            disabled
                          >
                            <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 !flex-[1_0_auto] flex-col items-center pt-6">
                    <div className="max-h-[585px] w-full flex-[1_0_auto] rounded-2xl bg-gray-300 transition-[width] duration-300 ease-in will-change-[width]"></div>

                    <div
                      className="relative mt-5 flex w-full items-end justify-center"
                      style={{ marginBottom: "50px" }}
                    >
                      <div className="w-[200px]">
                        <div className="grid w-full grid-cols-2">
                          <div className="h-8 animate-pulse rounded bg-gray-300"></div>
                          <div className="h-8 animate-pulse rounded bg-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ShareFlowComponents
              isPublished={isPublished}
              data={data}
              flowId={flowId}
            />
          )}
          {/* <ShareFlowComponents isPublished={isPublished} data={data} /> */}
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

"use client"

import React, { useEffect } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

import {
  setCurrentScreenName,
  setSelectedScreen,
  setTotalRequired,
  setValidateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"

type Position = "static" | "relative" | "absolute" | "sticky" | "fixed"

export default function FlowLayout({
  isHeader,
  check,
}: {
  isHeader: boolean
  check: boolean
}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { flowId = "" } = useParams<{ flowId: string }>() ?? {}
  const search = searchParams?.get("screen") || ""
  const screens = useAppSelector((state) => state?.screen?.flows[flowId]?.screens)
  useEffect(() => {
    if (search !== currentScreenName) {
      dispatch(setCurrentScreenName(search))
    }
    const index: number | undefined = screens?.findIndex(
      (screen) => screen.screenName === search
    )
    console.log(
      search,
      "before dispatching",
      index,
      screens,
      index
      // screens[index]?.screenData
    )
    if (index !== -1 && index !== undefined) {
      console.log("-------dispatching---------")
      dispatch(setSelectedScreen({ flowId, value: index }))
    } else {
      console.error(
        "Screen not found, index is out of bounds, or screenData is undefined"
      )
    }
  }, [search, dispatch])
  const previewHeaderRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(90)

  const currentScreenName = useAppSelector(
    (state) => state?.screen?.currentScreenName
  )
  const selectedScreen = useAppSelector(
    (state) =>
      state?.screen?.flows[flowId]?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )

  const selectedScreenId = useAppSelector(
    (state) => state?.screen?.flows[flowId]?.screens[selectedScreen]?.screenId || ""
  )
  const selectedScreenError = useAppSelector(
    (state) =>
      state?.screen?.flows[flowId]?.screens[selectedScreen]?.screenToggleError || false
  )

  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const screenHeader = useAppSelector((state) => state?.screen?.flows[flowId]?.screensHeader)
  const headerPosition =
    useAppSelector((state) => state?.theme?.header?.headerPosition) ||
    "relative"

  const screenFooter = useAppSelector((state) => state?.screen?.flows[flowId]?.screensFooter)
  const headerMode =
    useAppSelector((state) => state?.screen?.flows[flowId]?.headerMode) || false
  const sf = useAppSelector((state) => state?.screen)
  useEffect(() => {
    dispatch(
      setValidateScreen({
        flowId: flowId,
        screenId: selectedScreenId,
        screenValidated: false,
        screenToggleError: false,
      })
    )
  }, [search])
  useEffect(() => {
    if (!selectedScreenError) {
      router.refresh()
    }
  }, [currentScreenName, pathname, search])
  useEffect(() => {
    if (headerMode) {
      const height =
        document.getElementById("preview_header")?.offsetHeight || 0
      setHeaderHeight(height)
    } else {
      const height = previewHeaderRef.current?.offsetHeight || 0
      setHeaderHeight(height)
    }
  }, [headerMode, headerHeight, headerPosition])
  useEffect(() => {
    dispatch(setTotalRequired({ flowId, value: true }))
  }, [])
  console.log("op", screens, sf, search, selectedScreen)
  if (check) return null
  return (
    <>
      {isHeader ? (
        <div
          ref={previewHeaderRef}
          id={currentScreenName}
          style={{
            position:
              (headerPosition as Position) === "absolute"
                ? "fixed"
                : "relative",
            width: "100%",
            top: "0",
            zIndex: 20,
            backgroundColor: backgroundColor,
            // marginBottom: "760px",
            // (headerPosition as Position) === "absolute"
            //   ? headerHeight + "px"
            //   : "0",
          }}
        >
          <ResolvedComponentsFromCraftState screen={screenHeader} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            fontFamily: "var(--font-geist)",
            backgroundColor: backgroundColor,
          }}
        >
          <ResolvedComponentsFromCraftState screen={screenFooter} />
        </div>
      )}
    </>
  )
}

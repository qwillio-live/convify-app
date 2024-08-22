"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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

export default function FlowLayout({ isHeader }: { isHeader: boolean }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.get("screen") || ""
  const screens = useAppSelector((state) => state?.screen?.screens)
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
      dispatch(setSelectedScreen(index))
    } else {
      console.error(
        "Screen not found, index is out of bounds, or screenData is undefined"
      )
    }
  }, [search, dispatch])
  const previewHeaderRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(90)

  const selectedScreenIdex =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0
  const firstScreenName =
    useAppSelector((state) => state?.screen?.firstScreenName) || ""

  const currentScreenName = useAppSelector(
    (state) => state?.screen?.currentScreenName
  )
  const selectedScreen = useAppSelector(
    (state) =>
      state?.screen?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )

  const selectedScreenId = useAppSelector(
    (state) => state?.screen?.screens[selectedScreen]?.screenId || ""
  )
  const selectedScreenError = useAppSelector(
    (state) =>
      state?.screen?.screens[selectedScreen]?.screenToggleError || false
  )

  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const screenHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const headerPosition =
    useAppSelector((state) => state?.theme?.header?.headerPosition) ||
    "relative"

  const screenFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const headerMode =
    useAppSelector((state) => state?.screen?.headerMode) || false
  const sf = useAppSelector((state) => state?.screen)
  useEffect(() => {
    dispatch(
      setValidateScreen({
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
    dispatch(setTotalRequired(true))
  }, [])
  console.log("op", screens, sf, search, selectedScreen)

  return null
  // return (
  //   <>
  //     {isHeader ? (
  //       <div
  //         ref={previewHeaderRef}
  //         id={currentScreenName}
  //         style={{
  //           position:
  //             (headerPosition as Position) === "absolute"
  //               ? "fixed"
  //               : "relative",
  //           width: "100%",
  //           top: "0",
  //           zIndex: 20,
  //           backgroundColor: backgroundColor,
  //           // marginBottom: "760px",
  //           // (headerPosition as Position) === "absolute"
  //           //   ? headerHeight + "px"
  //           //   : "0",
  //         }}
  //       >
  //         <ResolvedComponentsFromCraftState screen={screenHeader} />
  //       </div>
  //     ) : (
  //       <div
  //         style={{
  //           width: "100%",
  //           backgroundColor: backgroundColor,
  //         }}
  //       >
  //         <ResolvedComponentsFromCraftState screen={screenFooter} />
  //       </div>
  //     )}
  //   </>
  // )
}

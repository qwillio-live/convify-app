"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormProvider, useForm, useFormContext } from "react-hook-form"

import {
  setNewCurrentScreenName,
  setNewValidateScreen,
} from "@/lib/state/flows-state/features/newScreens"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"
import ResolvedNewComponentsFromCraftState from "../user/settings/new-resolved-components"

type Position = "static" | "relative" | "absolute" | "sticky" | "fixed"

export default function NewFlowPreview() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams?.get("screen") || ""
  useEffect(() => {
    const screens = document.querySelectorAll(".new-screens")
    screens.forEach((screen) => {
      screen.classList.remove("min-h-[400px]")
    })
  }, [])
  useEffect(() => {
    if (search !== currentScreenName) {
      dispatch(setNewCurrentScreenName(search))
    }
  }, [search])
  const previewHeaderRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(90)

  const selectedScreenIdex =
    useAppSelector((state) => state?.newScreens?.selectedScreen) || 0
  const firstScreenName =
    useAppSelector((state) => state?.newScreens?.firstScreenName) || ""

  const currentScreenName = useAppSelector(
    (state) => state?.newScreens?.currentScreenName
  )
  const selectedScreen = useAppSelector(
    (state) =>
      state?.newScreens?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )

  const selectedScreenId = useAppSelector(
    (state) => state?.newScreens?.screens[selectedScreen]?.screenId || ""
  )
  const selectedScreenError = useAppSelector(
    (state) =>
      state?.newScreens?.screens[selectedScreen]?.screenToggleError || false
  )

  const screens = useAppSelector((state) => state?.newScreens?.screens)
  const backgroundColor = useAppSelector(
    (state) => state?.newTheme?.general?.backgroundColor
  )
  const primaryColor = useAppSelector(
    (state) => state?.newTheme?.text?.primaryColor
  )
  const screenHeader = useAppSelector(
    (state) => state?.newScreens?.screensHeader
  )
  const headerPosition =
    useAppSelector((state) => state?.newTheme?.header?.headerPosition) ||
    "relative"

  const screenFooter = useAppSelector(
    (state) => state?.newScreens?.screensFooter
  )
  const headerMode =
    useAppSelector((state) => state?.newScreens?.headerMode) || false

  useEffect(() => {
    dispatch(
      setNewValidateScreen({
        screenId: selectedScreenId,
        screenValidated: false,
        screenToggleError: false,
      })
    )
  }, [])
  useEffect(() => {
    if (!selectedScreenError) {
      // console.log("SCREEN NOT VALIDATED BUT YES",screenValidated)

      router.push(
        `${pathname}?screen=${
          currentScreenName !== "" ? currentScreenName : firstScreenName
        }`,
        { scroll: false }
      )

      router.refresh()
      // router.replace(`${pathName}#${currentScreenName}`);
    }
  }, [currentScreenName, firstScreenName, pathname])

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

  console.log("primary", primaryColor)
  return (
    <>
      {screens?.map((screen, index) => (
        <div
          key={index}
          id={screen?.screenName + "-preview"}
          style={{
            display:
              currentScreenName === screen?.screenName ? "block" : "none",
            backgroundColor,
            color: primaryColor,
          }}
          className={`min-w-full shrink-0 basis-full pt-14 !color-[${primaryColor}]`}
        >
          <ResolvedNewComponentsFromCraftState
            key={index}
            screen={screen.screenData}
          />
        </div>
      ))}
    </>
  )
}

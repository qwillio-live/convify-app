"use client"

import React, { useEffect } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"
import { setCurrentScreenName, setValidateScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { usePathname, useRouter } from "next/navigation"
type Position = 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';

export default function FlowPreview() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathName = usePathname();

  const previewHeaderRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight,setHeaderHeight] = React.useState(90)

  const selectedScreenIdex = useAppSelector(
    (state) => state?.screen?.selectedScreen
  ) || 0
  const firstScreenName= useAppSelector(
    (state) => state?.screen?.firstScreenName
  ) || ""

  useEffect(() => {
    dispatch(setCurrentScreenName(firstScreenName))
  },[])
  const currentScreenName = useAppSelector(
    (state) => state?.screen?.currentScreenName
  )
  const selectedScreen = useAppSelector(
    (state) => state?.screen?.screens.findIndex((screen) => screen.screenName === currentScreenName)
   || 0)

  const selectedScreenId = useAppSelector((state) => state?.screen?.screens[selectedScreen]?.screenId || "");
  const selectedScreenError = useAppSelector((state) => state?.screen?.screens[selectedScreen]?.screenToggleError || false);

  const screens = useAppSelector((state) => state?.screen?.screens)
  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const screenHeader = useAppSelector((state) => state?.screen?.screensHeader)
  const headerPosition = useAppSelector((state) => state?.theme?.header?.headerPosition) || 'relative'

  const screenFooter = useAppSelector((state) => state?.screen?.screensFooter)
  const headerMode = useAppSelector((state) => state?.screen?.headerMode) || false

  useEffect(() => {
    dispatch(setValidateScreen({screenId: selectedScreenId, screenValidated: false,screenToggleError: false}))

  }, [])
  useEffect(() => {
    if(!selectedScreenError){
      // console.log("SCREEN NOT VALIDATED BUT YES",screenValidated)
      router.push(`${pathName}#${currentScreenName}`);
    }
  },[currentScreenName])

  useEffect(() => {
    if(headerMode){
      const height = document.getElementById('preview_header')?.offsetHeight || 0;
      setHeaderHeight(height)
    }else{
     const height = previewHeaderRef.current?.offsetHeight || 0;
      setHeaderHeight(height)
    }
  }, [headerMode,headerHeight,headerPosition])
  return (
    <>
    <div
    ref={previewHeaderRef}
    id="preview_header"
    style={{
      position: headerPosition as Position === 'absolute' ? 'fixed' : 'relative',
      width: '100%',
      top: '0',
      zIndex: 20,
      backgroundColor: backgroundColor,
      }}>
      <ResolvedComponentsFromCraftState screen={screenHeader} />
    </div>
      {screens?.map((screen, index) => {
        return (
          <div
            key={index}
            id={screen?.screenName}
            style={{
              backgroundColor: backgroundColor,
              marginTop: headerPosition === 'absolute' ? headerHeight+'px' : '0'
             }}
            className="my-14 min-h-screen
          shrink-0
          basis-full
          min-w-full"
          >
            <ResolvedComponentsFromCraftState
              key={index}
              screen={screen.screenData}
            />
          </div>
        )
      })}
      <ResolvedComponentsFromCraftState screen={screenFooter} />
    </>
  )
}

"use client"

import React, { useEffect, useRef } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import ResolvedComponentsFromCraftState from "@/components/user/settings/resolved-components"
import { setCurrentScreenName, setScrollY, setValidateScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
type Position = 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';

export default function FlowPreview() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.get('screen') || "";
  const lastScrollY = useRef(window.scrollY);
  const avatarBackgroundColor = useAppSelector((state) => state?.screen?.avatarBackgroundColor)
  useEffect(() => {
    const screens = document.querySelectorAll('.new-screens');
    screens.forEach(screen => {
      screen.classList.remove('min-h-[400px]');
    });
  }, [])
  useEffect(() => {
    if (search !== currentScreenName) {
      dispatch(setCurrentScreenName(search))
    }
  }, [search])
  const previewHeaderRef = React.useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = React.useState(90)

  const selectedScreenIdex = useAppSelector(
    (state) => state?.screen?.selectedScreen
  ) || 0
  const firstScreenName = useAppSelector(
    (state) => state?.screen?.firstScreenName
  ) || ""

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
    dispatch(setValidateScreen({ screenId: selectedScreenId, screenValidated: false, screenToggleError: false }))

  }, [])
  useEffect(() => {
    if (!selectedScreenError) {
      // console.log("SCREEN NOT VALIDATED BUT YES",screenValidated)
      router.push(`${pathname}?screen=${currentScreenName}`, { scroll: false });
      router.refresh()
      // router.replace(`${pathName}#${currentScreenName}`);
    }
  }, [currentScreenName, pathname])

  const handleWindowScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY !== lastScrollY.current) {
      dispatch(setScrollY(currentScrollY));
      lastScrollY.current = currentScrollY;
    }
  };

  useEffect(() => {
    if (headerMode) {
      const height = document.getElementById('preview_header')?.offsetHeight || 0;
      setHeaderHeight(height)
    } else {
      const height = previewHeaderRef.current?.offsetHeight || 0;
      setHeaderHeight(height)
    }
  }, [headerMode, headerHeight, headerPosition])

  React.useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [lastScrollY]);
  return (
    <>
      <div
        ref={previewHeaderRef}
        id={currentScreenName}
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
            id={screen?.screenName + '-preview'}
            style={{
              display: currentScreenName === screen?.screenName ? "block" : "none",
              backgroundColor: backgroundColor,
              paddingTop: headerPosition === 'absolute' ? headerHeight + 'px' : '0'
            }}
            className="my-14
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

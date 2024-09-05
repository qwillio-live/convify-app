"use client"
import React, { useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { track } from "@vercel/analytics/react"
import { debounce, throttle } from "lodash"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import {
  navigateToScreen,
  setAlarm,
  setCurrentScreenName,
  setErrorCount,
  setSelectedScreen,
  validateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useScreenNames } from "@/lib/state/flows-state/features/screenHooks"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button as CustomButton } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "./useButtonThemePresets"
import { IconButtonSettings } from "./user-icon-button.settings"
import { useSearchParams } from "next/navigation"
import { UserInputSizes } from "../input/user-input.component"

const IconsList = {
  aperture: (props) => <Aperture {...props} />,
  activity: (props) => <Activity {...props} />,
  dollarsign: (props) => <DollarSign {...props} />,
  anchor: (props) => <Anchor {...props} />,
  disc: (props) => <Disc {...props} />,
  mountain: (props) => <Mountain {...props} />,
  arrowright: (props) => <ArrowRight {...props} />,
}

const IconGenerator = ({ icon, size, className = "", ...rest }) => {
  const IconComponent = IconsList[icon]

  if (!IconComponent) {
    return null // or some default icon or error handling
  }

  return (
    <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />
  )
}

const ButtonSizeValues = {
  small: ".8rem",
  medium: "1rem",
  large: "1.2rem",
}
const IconSizeValues = {
  small: 18,
  medium: 22,
  large: 26,
}

const ButtonTextLimit = {
  small: 100,
  // small: 22,
  // medium: 30,
  // large: 40,
  // full: 82,

  medium: 100,
  large: 100,
  full: 100,
}
export const IconButtonGen = ({
  disabled,
  fontFamily,
  enableIcon,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  containerBackground,
  marginBottom,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  borderHoverColor,
  nextScreen,
  ...props
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const pathName = usePathname()
  const currentScreenName =
    useAppSelector((state) => state?.screen?.currentScreenName) || ""
  const alarm = useAppSelector(
    (state) =>
      state?.screen?.screens[state.screen.selectedScreen]?.alarm || false
  )
  const currentScreenTotal =
    useAppSelector(
      (state) =>
        state?.screen?.screens[state.screen.selectedScreen]?.totalRequired
    ) || ""
  const currentScreenFilled =
    useAppSelector(
      (state) =>
        state?.screen?.screens[state.screen.selectedScreen]?.totalFilled
    ) || ""
  const AllScreens = useAppSelector((state) => state?.screen?.screens)
  const selectedScreen = useAppSelector(
    (state) =>
      state?.screen?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )
  const sc = useAppSelector((state) => state?.screen?.screens) || []
  const screenValidated =
    useAppSelector(
      (state: RootState) =>
        state.screen?.screens[selectedScreen]?.screenValidated
    ) || false
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams || undefined)
    if (term) {
      params.set("screen", term)
    }
    console.log("new path", `${pathname}?${params.toString()}`)
    router.push(`${pathname}?${params.toString()}`)
  }
  const newScreensMapper = {
    "next-screen":
      selectedScreen + 1 < sc.length
        ? sc[selectedScreen + 1]?.screenName
        : sc[selectedScreen]?.screenName,
    "back-screen":
      selectedScreen - 1 >= 0
        ? sc[selectedScreen - 1]?.screenName
        : sc[selectedScreen]?.screenName,
    none: "none",
  }
  const newsc = nextScreen.screenName
  const updatedScreenName = newScreensMapper[props.buttonAction] || newsc
  const index = sc.findIndex(
    (screen) => screen.screenName === updatedScreenName
  )
  console.log(
    "next-screen to navigatte",
    newsc,
    updatedScreenName,
    props.buttonAction,
    selectedScreen,
    selectedScreen + 1,
    sc.length,
    selectedScreen + 1 < sc.length ? sc[selectedScreen + 1]?.screenName : "",
    sc
  )
  const handleNavigateToContent = () => {
    console.log(
      "btn navigating",
      "currentScreenFilled",
      currentScreenFilled,
      "currentScreenTotal",
      currentScreenTotal,
      "index",
      index
    )
    if (index !== -1) {
      if (currentScreenFilled === currentScreenTotal) {
        dispatch(
          validateScreen({
            current: currentScreenName,
            next: updatedScreenName,
          })
        )
        dispatch(setSelectedScreen(index))
        handleSearch(updatedScreenName)
      } else {
        console.log("alarm called")
        dispatch(setAlarm(true))
        dispatch(setErrorCount((sc[selectedScreen]?.errorCount || 0) + 1))
      }
    }
    // if(screenValidated){
    //   console.log("SCREEN NOT VALIDATED BUT YES",screenValidated)
    //   router.push(`${pathName}#${nextScreen?.screenName}`);
    //   dispatch(setCurrentScreenName(nextScreen?.screenName));
    // }else{
    //   console.log("SCREEN NOT VALIDATED", screenValidated)
    // }
  }

  return (
    <div
      className="relative w-full"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        justifyContent: "center",
        minWidth: "100%",
        paddingTop: `${props.marginTop}px`,
        paddingBottom: `${props.marginBottom}px`,
        paddingLeft: `${props.marginLeft}px`,
        paddingRight: `${props.marginRight}px`,
      }}
    >
      {/* <Link href={`${pathName}#${nextScreen}`} className="contents"> */}
      <StyledCustomButton
        fontFamily={fontFamily?.value}
        color={color.value}
        background={background.value}
        backgroundHover={backgroundHover.value}
        borderHoverColor={borderHoverColor?.value}
        colorHover={colorHover.value}
        radius={radius.value}
        flexDirection={flexDirection}
        justifyContent={justifyContent}
        borderColor={borderColor.value}
        border={border}
        marginLeft={marginLeft}
        width={width}
        size={size}
        buttonSize={buttonSize}
        height={height}
        marginRight={marginRight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        paddingLeft={paddingLeft}
        paddingTop={paddingTop}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
        alignItems={alignItems}
        gap={gap}
        mobileScreen={false}
        {...props}
        className="button-input-comp text-[1rem]"
        onClick={() => handleNavigateToContent()}
      >
        <div
          style={{
            maxWidth: "100%",
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
        {enableIcon && icon.pictureType !== PictureTypes.NULL && (
          <div
            className={cn("ml-[10px]", {
              "mt-[4px]":
                icon.pictureType === PictureTypes.EMOJI &&
                buttonSize === "large",
              "mt-[2px]":
                icon.pictureType === PictureTypes.EMOJI &&
                buttonSize === "medium",
              "mt-0":
                icon.pictureType === PictureTypes.EMOJI &&
                buttonSize === "small",
            })}
          >
            {icon.pictureType === PictureTypes.ICON ? (
              <SvgRenderer
                iconName={icon.picture}
                width={IconSizeValues[buttonSize]}
                height={IconSizeValues[buttonSize]}
              />
            ) : icon.pictureType === PictureTypes.EMOJI ? (
              <span
                className={cn("flex items-center justify-center", {
                  "text-[26px] leading-[26px]": buttonSize === "large",
                  "text-[22px] leading-[22px]": buttonSize === "medium",
                  "text-[18px] leading-[18px]": buttonSize === "small",
                })}
              >
                {icon.picture}
              </span>
            ) : (
              <picture key={(icon.picture as ImagePictureTypes)?.desktop}>
                <source
                  media="(max-width:100px)"
                  srcSet={(icon.picture as ImagePictureTypes)?.mobile}
                />
                <img
                  src={(icon.picture as ImagePictureTypes)?.desktop}
                  className={cn(
                    "aspect-auto h-auto overflow-hidden object-cover",
                    {
                      "w-[26px]": buttonSize === "large",
                      "w-[22px]": buttonSize === "medium",
                      "w-[18px]": buttonSize === "small",
                    }
                  )}
                  loading="lazy"
                />
              </picture>
            )}
          </div>
        )}
      </StyledCustomButton>
      {/* </Link> */}
    </div>
  )
}
interface StyledCustomButtonProps {
  fontFamily?: string
  color?: string
  background?: string
  backgroundHover?: string
  colorHover?: string
  size?: string
  buttonSize?: string
  marginLeft?: string | number
  width?: string | number
  height?: string | number
  marginRight?: string | number
  marginTop?: string | number
  marginBottom?: string | number
  paddingLeft?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  radius?: number
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  gap?: number
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
}
const StyledCustomButton = styled(CustomButton)<StyledCustomButtonProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  display: flex;
  flex-direction: row;
  position: relative;
  overflow: hidden;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  font-weight: 400;
  border: 1px dashed transparent;
  transition: all 0.2s ease;

  &:hover {
    border-style: solid;
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired hover border color */
    background: ${(props) => props.backgroundHover};
    color: ${(props) => props.colorHover};
  }

  &:focus {
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired focus border color */
  }

  background: ${(props) => props.background};
  color: ${(props) => props.color};
  overflow: hidden;
  box-sizing: border-box;
  height: ${(props) => props.height}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};

  ${({ size, mobileScreen }) => {
    if (size === UserInputSizes.small) {
      return { width: "250px" }
    } else if (size === UserInputSizes.medium) {
      if (mobileScreen) {
        return { width: "calc(100% - 22px)" }
      } else {
        return { width: "376px" }
      }
    } else if (size === UserInputSizes.large) {
      if (mobileScreen) {
        return { width: "calc(100% - 22px)" }
      } else {
        return { width: "576px" }
      }
    } else {
      return {
        width: "calc(100% - 22px)",
      }
    }
  }};

  @media (max-width: 600px) {
    ${({ size }) => {
      if (size === UserInputSizes.large) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }

  @media (max-width: 390px) {
    ${({ size }) => {
      if (size === UserInputSizes.medium) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }
`

export const IconButton = ({
  fontFamily,
  disabled,
  borderHoverColor,
  enableIcon,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  marginBottom,
  containerBackground,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  buttonAction,
  nextScreen,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }))
  const [hover, setHover] = React.useState(false)
  const t = useTranslations("Components")
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [buttonFullWidth, setButtonFullWidth] = React.useState(size === "full")
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state.theme?.general?.secondaryColor
  )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const screens = useAppSelector((state) => state?.screen?.screens)
  const screensLength = useAppSelector(
    (state: RootState) => state?.screen?.screens?.length ?? 0
  )
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  const nextScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
        ]?.screenName
    ) || ""
  const nextScreenId =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[
          selectedScreen + 1 < screensLength ? selectedScreen + 1 : 0
        ]?.screenId
    ) || ""
  const screenNames = useScreenNames()

  //editor load needs to be refreshed so that screenName value is re-populated but
  // it is working now because it refers screenId rather then screenName
  useEffect(() => {
    let screenNameChanged = false
    if (buttonAction === "next-screen") {
      setProp(
        (props) =>
          (props.nextScreen = {
            screenName: nextScreenName,
            screenId: nextScreenId,
          }),
        200
      )
    } else if (buttonAction === "custom-action") {
      screenNames?.map((screen) => {
        if (screen.screenId === nextScreen.screenId) {
          setProp(
            (props) =>
              (props.nextScreen = {
                screenName: screen.screenName,
                screenId: screen.screenId,
              }),
            200
          )
          screenNameChanged = true
        }
      })
      if (!screenNameChanged) {
        setProp((props) => (props.buttonAction = "next-screen"), 200)
        setProp(
          (props) =>
            (props.nextScreen = {
              screenId: nextScreenId,
              screenName: nextScreenName,
            })
        )
      }
    }
  }, [nextScreenName, buttonAction])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  useEffect(() => {
    if (primaryColor) {
      const backgroundPrimaryColor = getBackgroundForPreset(
        primaryColor,
        props.preset
      )
      const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(
        primaryColor,
        props.preset
      )

      if (background.globalStyled && !background.isCustomized) {
        setProp(
          (props) => (props.background.value = backgroundPrimaryColor),
          200
        )
      }
      if (color.globalStyled && !color.isCustomized) {
        setProp((props) => (props.color.value = primaryColor), 200)
      }
      if (borderColor.globalStyled && !borderColor.isCustomized) {
        setProp((props) => (props.borderColor.value = primaryColor), 200)
      }

      // hover colors

      if (backgroundHover.globalStyled && !backgroundHover.isCustomized) {
        setProp(
          (props) =>
            (props.backgroundHover.value = hoverBackgroundPrimaryColor),
          200
        )
      }
      if (borderHoverColor.globalStyled && !borderHoverColor.isCustomized) {
        setProp((props) => (props.borderHoverColor.value = primaryColor), 200)
      }
      if (colorHover.globalStyled && !colorHover.isCustomized) {
        setProp((props) => (props.colorHover.value = primaryColor), 200)
      }
    }
  }, [primaryColor])
  const maxLength = ButtonTextLimit[size]
  const handleTextChange = (e) => {
    if (ref.current) {
      const currentText = ref.current.innerText
      if (currentText.length <= maxLength) {
        // handlePropChangeThrottled('text',currentText);
        handlePropChangeDebounced("text", currentText)
      } else {
        const trimmedText = currentText.substring(0, maxLength)
        // handlePropChangeThrottled('text',trimmedText);
        handlePropChangeDebounced("text", trimmedText)
        ref.current.innerText = trimmedText
        placeCaretAtEnd(ref.current)
      }
    }

    // const value = e.target.innerText;
    // if(value >= maxLength){
    //   return;
    // }
    // if (parseInt(value?.length) <= parseInt(maxLength)) {
    //   // setProp((props) => props.text = value);
    //   // handlePropChangeDebounced('text',value);
    //   handlePropChangeThrottled('text',value.substring(0,maxLength))
    // } else {
    //   if(ref.current){
    //     // e.target.innerText = text || ''; // Restore the previous text
    //     const selection = window.getSelection();
    //     const range = document.createRange();
    //     range.selectNodeContents(ref.current);
    //     range.collapse(false); // Move cursor to the end
    //     selection?.removeAllRanges();
    //     selection?.addRange(range);
    //   }
    // }
  }

  const placeCaretAtEnd = (element) => {
    const range = document.createRange()
    const selection = window.getSelection()
    if (selection) {
      range.selectNodeContents(element)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      currentRef.addEventListener("input", handleTextChange)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", handleTextChange)
      }
    }
  }, [text, maxLength])
  const throttledSetProp = useCallback(
    throttle((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  )

  const handlePropChangeThrottled = (property, value) => {
    throttledSetProp(property, value)
  }

  const handleNavigateToScreen = async () => {
    console.log("entered validating")
    dispatch(
      validateScreen({ current: selectedScreen, next: nextScreen.screenName })
    )

    // dispatch(navigateToScreen(nextScreen));
    // if(screens){
    //   const screen = screens.find(screen => screen.screenName === nextScreen);
    //   if(screen){
    //     const screenData = screen.screenData;
    //     actions.deserialize(screenData);
    //   }
    // }
  }

  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }),
    [setProp]
  )

  const handlePropChangeDebounced = (property, value) => {
    debouncedSetProp(property, value)
  }

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className=""
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      {hover && <Controller nameOfComponent={t("Button")} />}
      <div
        className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: "border-box",
          minWidth: "100%",
          maxWidth: "100%",
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}
      >
        <StyledCustomButton
          fontFamily={fontFamily.value}
          color={color.value}
          background={background.value}
          backgroundHover={backgroundHover.value}
          colorHover={colorHover.value}
          radius={radius.value}
          flexDirection={flexDirection}
          justifyContent={justifyContent}
          borderColor={borderColor.value}
          borderHoverColor={borderHoverColor.value}
          border={border}
          marginLeft={marginLeft}
          mobileScreen={mobileScreen || false}
          width={width}
          height={height}
          marginRight={marginRight}
          marginTop={marginTop}
          marginBottom={marginBottom}
          paddingLeft={paddingLeft}
          paddingTop={paddingTop}
          paddingRight={paddingRight}
          paddingBottom={paddingBottom}
          alignItems={alignItems}
          gap={gap}
          size={size}
          buttonSize={buttonSize}
          className="button-input-comp"
          {...props}
          onClick={() => handleNavigateToScreen()}
        >
          <div className="relative flex min-h-[16px] min-w-[32px] max-w-[100%] flex-col overflow-hidden overflow-x-clip">
            {/** @ts-ignore */}
            {/** @ts-ignore */}
            <ContentEditable
              html={text.substring(0, maxLength)} // innerHTML of the editable div
              innerRef={ref}
              disabled={disabled}
              style={{
                maxWidth: "100%",
                position: "relative",
                border: text?.length <= 0 && "1px dotted white",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
              }}
              className="min-w-16 border-dotted border-transparent leading-relaxed hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
                // handlePropChangeThrottled('text',e.target.value.substring(0,maxLength))
              }}
              tagName="div"
            />
          </div>
          {enableIcon && icon.pictureType !== PictureTypes.NULL && (
            <div
              className={cn("ml-[10px]", {
                "mt-[4px]":
                  icon.pictureType === PictureTypes.EMOJI &&
                  buttonSize === "large",
                "mt-[2px]":
                  icon.pictureType === PictureTypes.EMOJI &&
                  buttonSize === "medium",
                "mt-0":
                  icon.pictureType === PictureTypes.EMOJI &&
                  buttonSize === "small",
              })}
            >
              {icon.pictureType === PictureTypes.ICON ? (
                <SvgRenderer
                  iconName={icon.picture}
                  width={IconSizeValues[buttonSize]}
                  height={IconSizeValues[buttonSize]}
                />
              ) : icon.pictureType === PictureTypes.EMOJI ? (
                <span
                  className={cn("flex items-center justify-center", {
                    "text-[26px] leading-[26px]": buttonSize === "large",
                    "text-[22px] leading-[22px]": buttonSize === "medium",
                    "text-[18px] leading-[18px]": buttonSize === "small",
                  })}
                >
                  {icon.picture}
                </span>
              ) : (
                <picture key={(icon.picture as ImagePictureTypes)?.desktop}>
                  <source
                    media="(max-width:100px)"
                    srcSet={(icon.picture as ImagePictureTypes)?.mobile}
                  />
                  <img
                    src={(icon.picture as ImagePictureTypes)?.desktop}
                    className={cn(
                      "aspect-auto h-auto w-full overflow-hidden object-cover",
                      {
                        "w-[26px]": buttonSize === "large",
                        "w-[22px]": buttonSize === "medium",
                        "w-[18px]": buttonSize === "small",
                      }
                    )}
                    loading="lazy"
                  />
                </picture>
              )}
            </div>
          )}
        </StyledCustomButton>
      </div>
    </div>
  )
}

export enum IconButtonSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export type IconButtonProps = {
  fontFamily: StyleProperty
  disabled: boolean
  enableIcon: boolean
  size: IconButtonSizes
  containerBackground: string
  background: StyleProperty
  backgroundHover: StyleProperty
  color: StyleProperty
  colorHover: StyleProperty
  text: string
  icon: {
    picture: ImagePictureTypes | string | null
    pictureType: PictureTypes
  }
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  radius: StyleProperty
  flexDirection: string
  alignItems: string
  justifyContent: string
  gap: number
  border: number
  borderColor: StyleProperty
  borderHoverColor: StyleProperty
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
  fullWidth: boolean
  preset: string
  settingsTab: string
  buttonSize: string
  tracking: boolean
  trackingEvent: string
  buttonAction: "next-screen" | "custom-action" | "none"
  nextScreen: {
    screenId: string
    screenName: string
  }
}

export const IconButtonDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "rgba(255, 255, 255, 0.886)",
  background: {
    value: "#4050ff",
    globalStyled: false,
    isCustomized: false,
  },
  color: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,
  },
  backgroundHover: {
    value: "#3182ce",
    globalStyled: false,
    isCustomized: false,
  },
  colorHover: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,
  },
  radius: {
    value: "0",
    globalStyled: false,
    isCustomized: false,
  },
  justifyContent: "center",
  borderColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  borderHoverColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  disabled: false,
  enableIcon: true,
  width: "366",
  height: "auto",
  size: IconButtonSizes.medium,
  buttonSize: "medium",
  text: "Get quote",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  icon: {
    picture: null,
    pictureType: PictureTypes.NULL,
  },
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  border: 0,
  fullWidth: true,
  preset: "filled",
  settingsTab: "content",
  tracking: false,
  trackingEvent: "button_clicked",
  nextScreen: {
    screenId: "",
    screenName: "",
  },
  buttonAction: "next-screen",
}

IconButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: IconButtonSettings,
  },
}

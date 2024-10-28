"use client"
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { debounce } from "lodash"
// import {
//   Activity,
//   Anchor,
//   Aperture,
//   ArrowRight,
//   Disc,
//   DollarSign,
//   Mountain,
// } from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
// import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import {
  getAllFilledAnswers,
  setAlarm,
  setErrorCount,
  setSelectedScreen,
  validateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useScreenNames } from "@/lib/state/flows-state/features/screenHooks"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { cn } from "@/lib/utils"
// import { ButtonProps, Button as CustomButton } from "@/components/ui/button"
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { IconButtonSettings } from "./user-icon-button.settings"
import { useSearchParams } from "next/navigation"
import { UserInputSizes } from "../input/user-input.component"
import hexoid from "hexoid"
// import { getNextScreenInfoFromStore } from "./utils"

// const IconsList = {
//   aperture: (props) => <Aperture {...props} />,
//   activity: (props) => <Activity {...props} />,
//   dollarsign: (props) => <DollarSign {...props} />,
//   anchor: (props) => <Anchor {...props} />,
//   disc: (props) => <Disc {...props} />,
//   mountain: (props) => <Mountain {...props} />,
//   arrowright: (props) => <ArrowRight {...props} />,
// }

// const IconGenerator = ({ icon, size, className = "", ...rest }) => {
//   const IconComponent = IconsList[icon]

//   if (!IconComponent) {
//     return null // or some default icon or error handling
//   }

//   return (
//     <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />
//   )
// }

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
  // const pathName = usePathname()
  const currentScreenName =
    useAppSelector((state) => state?.screen?.currentScreenName) || ""
  // const alarm = useAppSelector(
  //   (state) =>
  //     state?.screen?.screens[state.screen.selectedScreen]?.alarm || false
  // )
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
  // const AllScreens = useAppSelector((state) => state?.screen?.screens)
  const selectedScreen = useAppSelector(
    (state) =>
      state?.screen?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )
  const sc = useAppSelector((state) => state?.screen?.screens || [])
  // const screenValidated =
  //   useAppSelector(
  //     (state: RootState) =>
  //       state.screen?.screens[selectedScreen]?.screenValidated
  //   ) || false
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // const { replace } = useRouter()
  function handleSearch(term: string) {
    const params = new URLSearchParams((searchParams || "").toString())
    if (term) {
      params.set("screen", term)
    }
    // console.log("new path", `${pathname}?${params.toString()}`)
    router.push(`${pathname}?${params.toString()}`)
  }

  const newScreensMapper = useMemo(
    () => ({
      "next-screen":
        selectedScreen + 1 < sc.length
          ? sc[selectedScreen + 1]?.screenName
          : sc[selectedScreen]?.screenName,
      "back-screen":
        selectedScreen - 1 >= 0
          ? sc[selectedScreen - 1]?.screenName
          : sc[selectedScreen]?.screenName,
      none: "none",
    }),
    [selectedScreen, sc]
  )
  const newsc = nextScreen.screenName
  const updatedScreenName = newScreensMapper[props.buttonAction] || newsc
  const index = sc.findIndex(
    (screen) => screen.screenName === updatedScreenName
  )
  // console.log(
  //   "next-screen to navigatte",
  //   newsc,
  //   updatedScreenName,
  //   props.buttonAction,
  //   selectedScreen,
  //   selectedScreen + 1,
  //   sc.length,
  //   selectedScreen + 1 < sc.length ? sc[selectedScreen + 1]?.screenName : "",
  //   sc
  // )
  const handleNavigateToContent = () => {
    // console.log(
    //   "btn navigating",
    //   "currentScreenFilled",
    //   currentScreenFilled,
    //   "currentScreenTotal",
    //   currentScreenTotal,
    //   "index",
    //   index
    // )
    if (index !== -1) {
      if (currentScreenFilled === currentScreenTotal) {
        dispatch(
          validateScreen({
            current: currentScreenName,
            next: updatedScreenName,
          })
        )
        dispatch(getAllFilledAnswers(true))
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
      className="relative flex w-full min-w-full justify-center"
      style={{
        background: `${containerBackground}`,
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
          <div dangerouslySetInnerHTML={{ __html: text }} />
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
                  // alt="button-icon"
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
// const StyledCustomButton = styled(CustomButton)<StyledCustomButtonProps>`
//   font-family: ${(props) => `var(${props?.fontFamily})`};
//   display: flex;
//   flex-direction: row;
//   position: relative;
//   overflow: hidden;
//   font-weight: 400;
//   transition: all 0.2s ease;
//   ${({ buttonSize }) => {
//     if (buttonSize) {
//       return {
//         fontSize: ButtonSizeValues[buttonSize || "medium"],
//         paddingTop: ButtonSizeValues[buttonSize || "medium"],
//         paddingBottom: ButtonSizeValues[buttonSize || "medium"],
//       }
//     }
//     return null
//   }}

//   &:hover {
//     border-style: solid;
//     border-color: ${(props) =>
//       props.borderHoverColor}; /* Change to your desired hover border color */
//     background: ${(props) => props.backgroundHover};
//     color: ${(props) => props.colorHover};
//   }

//   &:focus {
//     border-color: ${(props) =>
//       props.borderHoverColor}; /* Change to your desired focus border color */
//   }

//   background: ${(props) => props.background};
//   color: ${(props) => props.color};
//   box-sizing: border-box;
//   height: ${(props) => props.height}px;
//   margin-top: ${(props) => props.marginTop}px;
//   margin-left: ${(props) => props.marginLeft}px;
//   margin-right: ${(props) => props.marginRight}px;
//   margin-bottom: ${(props) => props.marginBottom}px;
//   padding-left: ${(props) => props.paddingLeft}px;
//   padding-right: ${(props) => props.paddingRight}px;
//   border-radius: ${(props) => props.radius}px;
//   flex-direction: ${(props) => props.flexDirection};
//   align-items: ${(props) => props.alignItems};
//   justify-content: ${(props) => props.justifyContent};
//   gap: ${(props) => props.gap}px;
//   border: ${(props) => props.border}px solid ${(props) => props.borderColor};

//   ${({ size, mobileScreen }) => {
//     if (size === UserInputSizes.small) {
//       return { width: "250px" }
//     } else if (size === UserInputSizes.medium) {
//       if (mobileScreen) {
//         return { width: "calc(100% - 22px)" }
//       } else {
//         return `
//         width: 376px;
//         @media (max-width: 390px) {
//           width: calc(100% - 22px)
//         }
//         `
//       }
//     } else if (size === UserInputSizes.large) {
//       if (mobileScreen) {
//         return { width: "calc(100% - 22px)" }
//       } else {
//         return `
//         width: 576px;
//         @media (max-width: 600px) {
//           width: calc(100% - 22px)
//         }
//         `
//       }
//     } else {
//       return {
//         width: "calc(100% - 22px)",
//       }
//     }
//   }};
// `

const StyledCustomButton = ({
  fontFamily,
  buttonSize,
  borderHoverColor,
  backgroundHover,
  colorHover,
  background,
  color,
  height,
  marginTop,
  marginLeft,
  marginRight,
  marginBottom,
  paddingLeft,
  paddingRight,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  borderColor,
  border,
  mobileScreen,
  size,
  className,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & StyledCustomButtonProps) => {
  const generateWidthClass = useMemo(() => {
    if (size !== UserInputSizes.small && mobileScreen)
      return "w-[calc(100%-22px)]"
    switch (size) {
      case UserInputSizes.large:
        return "w-[576px] max-[600px]:w-[calc(100%-22px)]"
      case UserInputSizes.medium:
        return "w-[376px] max-[390px]:w-[calc(100%-22px)]"
      case UserInputSizes.small:
        return "w-[250px]"
      default:
        return "w-[calc(100%-22px)]"
    }
  }, [size, mobileScreen])

  const customStyles: CSSProperties = {
    "--icon-button-background": background,
    "--icon-button-border-color": borderColor,
    "--icon-button-border-hover-color": borderHoverColor,
    "--icon-button-size": ButtonSizeValues[buttonSize || "medium"],
    "--icon-button-margin-top": `${marginTop}px`,
    "--icon-button-margin-left": `${marginLeft}px`,
    "--icon-button-margin-right": `${marginRight}px`,
    "--icon-button-margin-bottom": `${marginBottom}px`,
    "--icon-button-background-hover": backgroundHover,
    "--icon-button-color-hover": colorHover,
    "--icon-button-color": color,
    "--icon-button-border-radius": `${radius}px`,
    "--icon-button-gap": `${gap}px`,
    "--icon-button-height": height === "auto" ? "auto" : `${height}px`,
    "--icon-button-padding-right": `${paddingRight}px`,
    "--icon-button-padding-left": `${paddingLeft}px`,
    fontFamily: `var(${fontFamily})`,
    justifyContent,
    alignItems,
    color,
    borderWidth: border,
    ...style,
  } as CSSProperties

  return (
    <button
      className={cn(
        `relative box-border flex overflow-hidden font-medium transition-all duration-200 hover:border-solid`,
        borderColor && "border-[var(--icon-button-border-color)]",
        gap && "gap-[var(--icon-button-gap)]",
        "h-[var(--icon-button-height)]",
        `flex-${flexDirection || "row"}`,
        radius && "rounded-[var(--icon-button-border-radius)]",
        borderHoverColor &&
          "hover:border-[var(--icon-button-border-hover-color)] focus:border-[var(--icon-button-border-hover-color)]",
        buttonSize &&
          "py-[var(--icon-button-size)] text-[var(--icon-button-size)]",
        paddingLeft && "pl-[var(--icon-button-padding-left)]",
        paddingRight && "pr-[var(--icon-button-padding-right)]",
        marginTop && "mt-[var(--icon-button-margin-top)]",
        marginLeft && "ml-[var(--icon-button-margin-left)]",
        marginRight && "mr-[var(--icon-button-margin-right)]",
        marginBottom && "mb-[var(--icon-button-margin-bottom)]",
        backgroundHover && "hover:bg-[var(--icon-button-background-hover)]",
        colorHover && "hover:text-[var(--icon-button-color-hover)]",
        background && "bg-[var(--icon-button-background)]",
        generateWidthClass,
        className
      )}
      {...props}
      style={customStyles}
    />
  )
}

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
  tracking,
  trackingEvent,
  settingsTab,
  fullWidth,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const t = useTranslations("Components")
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  // const primaryTextColor = useAppSelector(
  //   (state) => state.theme?.text?.primaryColor
  // )
  // const secondaryTextColor = useAppSelector(
  //   (state) => state.theme?.text?.secondaryColor
  // )
  // const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  // const primaryColor = useAppSelector(
  //   (state) => state.theme?.general?.primaryColor
  // )
  // const secondaryColor = useAppSelector(
  //   (state) => state.theme?.general?.secondaryColor
  // )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const screens = useAppSelector((state) => state?.screen?.screens || [])
  const screensLength = screens?.length
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

  // editor load needs to be refreshed so that screenName value is re-populated but
  // it is working now because it refers screenId rather then screenName
  // this effects to performance
  // useEffect(() => {
  //   let screenNameChanged = false
  //   if (buttonAction === "next-screen") {
  //     setProp(
  //       (props) =>
  //         (props.nextScreen = {
  //           screenName: nextScreenName,
  //           screenId: nextScreenId,
  //         }),
  //       200
  //     )
  //   } else if (buttonAction === "custom-action") {
  //     screenNames?.map((screen) => {
  //       if (screen.screenId === nextScreen.screenId) {
  //         setProp(
  //           (props) =>
  //             (props.nextScreen = {
  //               screenName: screen.screenName,
  //               screenId: screen.screenId,
  //             }),
  //           200
  //         )
  //         screenNameChanged = true
  //       }
  //     })
  //     if (!screenNameChanged) {
  //       setProp((props) => (props.buttonAction = "next-screen"), 200)
  //       setProp(
  //         (props) =>
  //           (props.nextScreen = {
  //             screenId: nextScreenId,
  //             screenName: nextScreenName,
  //           })
  //       )
  //     }
  //   }
  // }, [nextScreenName])

  const maxLength = ButtonTextLimit[size]

  const handleTextChange = () => {
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

  // const throttledSetProp = useCallback(
  //   (property, value) =>
  //     throttle(() => {
  //       setProp((prop) => {
  //         prop[property] = value
  //       }, 0)
  //     }, 200), // Throttle to 50ms to 200ms
  //   [setProp]
  // )

  // const handlePropChangeThrottled = (property, value) => {
  //   throttledSetProp(property, value)
  // }

  const handleNavigateToScreen = () => {
    // console.log("entered validating")
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
    (property, value) =>
      debounce(() => {
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
      className="group/button flex w-full justify-center"
    >
      <Controller
        className="invisible group-hover/button:visible"
        nameOfComponent={t("Button")}
      />
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
          onClick={handleNavigateToScreen}
        >
          <div className="relative flex min-h-[16px] min-w-[32px] max-w-full flex-col overflow-hidden overflow-x-clip">
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
                handleTextChange()
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
  id: string
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
  settingsTab: string[]
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
  settingsTab: ["content"],
  tracking: false,
  trackingEvent: "button_clicked",
  nextScreen: {
    screenId: "",
    screenName: "",
  },
  buttonAction: "next-screen",
  id: `input-${hexoid(6)()}`,
}

IconButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: IconButtonSettings,
  },
}

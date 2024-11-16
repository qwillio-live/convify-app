"use client"
import React, {
    useEffect,
    useCallback,
    useRef,
    useReducer,
    useState,
} from "react"
import {
    Activity,
    Anchor,
    Aperture,
    ArrowRight,
    CodeSquare,
    Disc,
    DollarSign,
    GripHorizontal,
    Mountain,
    RectangleHorizontal,
} from "lucide-react"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"
import { throttle, debounce } from "lodash"

import { useEditor, useNode } from "@/lib/craftjs"
import { borderRadius, darken, rgba } from "polished"
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

import { Controller } from "../settings/controller.component"
// import { ProgressBarSettings } from "./user-progress.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector, useAppDispatch } from "@/lib/state/flows-state/hooks"
import {
    getBackgroundForPreset,
    getHoverBackgroundForPreset,
} from "../icon-button/useButtonThemePresets"
import { useTranslations } from "next-intl"
import { track } from "@vercel/analytics/react"
import { RootState } from "@/lib/state/flows-state/store"
import { navigateToScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useScreenNames, useScreensLength } from "@/lib/state/flows-state/features/screenHooks"
import { LineSelectorSettings } from "../lineSeperator/line-seperator-settings"
import { Progress } from "@/components/ui/progress-custom"
import { Minus, Circle } from "lucide-react"
import { string } from "prop-types"
import { UserInputSizes } from "../input/user-input.component"
import { UserSlider } from "@/components/ui/user-slider"
import { SliderBarSettings } from "./user-slider.settings"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

const ButtonSizeValues = {
    small: ".8rem",
    medium: "1rem",
    large: "1.2rem",
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
    mobileScreen: boolean,
    headerMode?: boolean,
    defaultValue?: number
}
const StyledCustomButton = styled(CustomButton) <StyledCustomButtonProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  font-weight: 400;
  border: 1px dashed transparent;

  &:hover {
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
  padding-top: ${(props) => props.paddingTop};
  padding-bottom: ${(props) => props.paddingBottom}px;
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  cursor: default;
  border: none;

  ${({ size, mobileScreen, headerMode }) => {
        if (headerMode) {
            return { width: "100%" }
        }

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
export const SliderBarGen = ({
    disabled,
    fontFamily,
    enableIcon,
    size,
    buttonSize,
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
    progressStyle,
    color,
    maxWidth,
    fullWidth,
    progressvalue,
    maxValue,
    forHeader,
    inputValue = 50,
    label = "Label",
    showLabel = true,
    bottomLabel = true,
    lowerLimit = 0,
    upperLimit = 100,
    stepsize = 1,
    prefix = "",
    suffix = "",
    sliderColor = "",
    defaultValue = 50,
    ...props
}) => {
    const router = useRouter()
    const pathName = usePathname()
    const [formValue, setFormValue] = useState<number>(defaultValue);
    const handleNavigateToContent = () => {
        // router.push(currentUrlWithHash);
    }
    const screensLength = useAppSelector(
        (state: RootState) => state?.screen?.screens?.length ?? 0
    )
    const selectedScreen = useAppSelector(
        (state: RootState) => state.screen?.selectedScreen ?? 0
    )
    const primaryColor = useAppSelector(
        (state) => state.theme?.general?.primaryColor
    )
    const isHeaderFooterMode = useAppSelector(
        (state: RootState) => state?.screen?.footerMode || state?.screen?.headerMode
    )
    const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)
    const selectedScreenName =
        useAppSelector(
            (state: RootState) => state?.screen?.screens[selectedScreen]?.screenName
        ) || ""
    // const mv = useAppSelector(
    //   (state) =>
    //     JSON.parse(state.screen?.screens[state.screen.selectedScreen].screenData)[
    //       props.nodeId
    //     ].props.maxValue
    // )
    // const pv = useAppSelector(
    //   (state) =>
    //     JSON.parse(state.screen?.screens[state.screen.selectedScreen].screenData)[
    //       props.nodeId
    //     ].props.progressvalue
    // )
    const bgColor = useAppSelector(
        (state) => state?.theme?.general?.backgroundColor
    )
    const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
    const primaryTextColor = useAppSelector(
        (state) => state.theme?.text?.primaryColor
    )

    const [cardPosition, setCardPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (sliderRef.current && cardRef.current) {

            const sliderRect = sliderRef.current.getBoundingClientRect();
            const cardRect = cardRef.current?.getBoundingClientRect();

            const percentage = (formValue - lowerLimit) / (upperLimit - lowerLimit);

            let newPosition = percentage * (sliderRect.width - 16);

            const cardWidth = cardRect.width;
            const minPosition = cardWidth / 2;
            const maxPosition = sliderRect.width - (cardWidth / 2);

            // Constrain position within bounds
            if (newPosition < minPosition) {
                newPosition = minPosition;
            } else if (newPosition > maxPosition) {
                newPosition = maxPosition;
            }

            setCardPosition(newPosition);

        }

    }, [formValue, size]);


    return (
        <div
            className="relative w-full"
            style={{
                background: `${typeof containerBackground === "string" &&
                    containerBackground[0] === "#"
                    ? containerBackground
                    : bgColor
                    }`,
                display: "flex",
                justifyContent: "center",
                boxSizing: "border-box",
                width: "100%",
                paddingTop: `${props.paddingTop}px`,
                paddingBottom: `${props.paddingBottom}px`,
                paddingLeft: `${props.paddingLeft}px`,
                paddingRight: `${props.paddingRight}px`,
            }}
        >
            <StyledCustomButton
                fontFamily={fontFamily?.value}
                color={
                    typeof containerBackground === "string" &&
                        containerBackground[0] === "#"
                        ? containerBackground
                        : bgColor
                }
                background={
                    typeof containerBackground === "string" &&
                        containerBackground[0] === "#"
                        ? containerBackground
                        : bgColor
                }
                backgroundHover={
                    typeof containerBackground === "string" &&
                        containerBackground[0] === "#"
                        ? containerBackground
                        : bgColor
                }
                borderHoverColor={
                    typeof containerBackground === "string" &&
                        containerBackground[0] === "#"
                        ? containerBackground
                        : bgColor
                }
                colorHover={
                    typeof containerBackground === "string" &&
                        containerBackground[0] === "#"
                        ? containerBackground
                        : bgColor
                }
                radius={radius?.value}
                flexDirection={flexDirection}
                justifyContent={justifyContent}
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
                mobileScreen={!!mobileScreen}
                {...props}
                className="progress-comp text-[1rem]"
            >

                <div className="w-full space-y-0 py-4" ref={sliderRef}>

                    {showLabel && (
                        <div className={`relative mb-1 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent text-left`}
                            style={{
                                fontFamily: `var(${primaryFont})`,
                                color: primaryTextColor,
                            }}>
                            {label}
                        </div>
                        // <>
                        //     {/** @ts-ignore */}
                        //     {/** @ts-ignore */}
                        //     <ContentEditable
                        //         html={label}
                        //         disabled={false}
                        //         tagName="div"
                        //         onChange={(e) =>
                        //             setProp(
                        //                 (props) =>
                        //                 (props.label = e.target.value.replace(
                        //                     /<\/?[^>]+(>|$)/g,
                        //                     ""
                        //                 )),
                        //                 500
                        //             )
                        //         }
                        //         className={`relative mb-1 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent text-left`}
                        //         style={{
                        //             fontFamily: `var(${primaryFont})`,
                        //             color: primaryTextColor,
                        //         }}
                        //     />
                        // </>
                    )}

                    <UserSlider
                        value={[formValue]}
                        defaultValue={[defaultValue]}
                        color={sliderColor ? sliderColor : primaryColor}
                        min={lowerLimit}
                        max={upperLimit}
                        step={stepsize}
                        onValueChange={(event) => {

                            setFormValue(event[0]);

                        }}
                    >
                    </UserSlider>

                    <div ref={cardRef} className="absolute bottom-0 transform -translate-x-1/2 rounded text-sm px-4 py-2" style={{ left: `${cardPosition}px`, background: sliderColor ? sliderColor : primaryColor }}>

                        <p>{prefix}{formValue} {suffix}</p>

                    </div>

                    {bottomLabel && (
                        <div className="flex flex-row items-center justify-between text-sm" style={{ color: "black" }}>

                            <label>{prefix}{lowerLimit} {suffix}</label>

                            <label>{prefix}{upperLimit} {suffix}</label>

                        </div>
                    )}

                </div>

            </StyledCustomButton>
        </div>
    )
}

export const SliderBar = ({
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
    maxWidth,
    fullWidth,
    progressvalue,
    maxValue,
    progressStyle,
    forHeader,
    inputValue = 50,
    label = "Label",
    showLabel = true,
    bottomLabel = true,
    lowerLimit = 0,
    upperLimit = 100,
    stepsize = 1,
    prefix = "",
    suffix = "",
    sliderColor = "",
    defaultValue = 50,
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
    const [isFocused, setIsFocused] = useState(false);
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
    const bgColor = useAppSelector(
        (state) => state?.theme?.general?.backgroundColor
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
    const selectedScreenName =
        useAppSelector(
            (state: RootState) => state?.screen?.screens[selectedScreen]?.screenName
        ) || ""
    const isHeaderFooterMode = useAppSelector(
        (state: RootState) => state?.screen?.footerMode || state?.screen?.headerMode
    )
    const [cardPosition, setCardPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

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
        const value = e.target.innerText
        if (value.length <= maxLength) {
            setProp((props) => (props.text = value))
            // handlePropChangeDebounced('text',value);
            // handlePropChangeThrottled('text',value)
        } else {
            if (ref.current) {
                e.target.innerText = text || "" // Restore the previous text
                const selection = window.getSelection()
                const range = document.createRange()
                range.selectNodeContents(ref.current)
                range.collapse(false) // Move cursor to the end
                selection?.removeAllRanges()
                selection?.addRange(range)
            }
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
        return
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

    useEffect(() => {

        if (sliderRef.current && cardRef.current) {

            const sliderRect = sliderRef.current.getBoundingClientRect();
            const cardRect = cardRef.current?.getBoundingClientRect();

            const percentage = (inputValue - lowerLimit) / (upperLimit - lowerLimit);

            let newPosition = percentage * (sliderRect.width - 16);

            const cardWidth = cardRect.width;
            const minPosition = cardWidth / 2;
            const maxPosition = sliderRect.width - (cardWidth / 2);

            // Constrain position within bounds
            if (newPosition < minPosition) {
                newPosition = minPosition;
            } else if (newPosition > maxPosition) {
                newPosition = maxPosition;
            }

            setCardPosition(newPosition);

        }

    }, [inputValue, size, upperLimit, lowerLimit]);


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
            {hover && <Controller nameOfComponent={t("Slider")} />}

            <div
                className="relative w-full"
                style={{
                    background: `${typeof containerBackground === "string" &&
                        containerBackground[0] === "#"
                        ? containerBackground
                        : bgColor
                        }`,
                    display: "flex",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    width: "100%",
                    paddingTop: `${props.paddingTop}px`,
                    paddingBottom: `${props.paddingBottom}px`,
                    paddingLeft: `${props.paddingLeft}px`,
                    paddingRight: `${props.paddingRight}px`,
                }}
            >
                <StyledCustomButton
                    fontFamily={fontFamily?.value}
                    color={
                        typeof containerBackground === "string" &&
                            containerBackground[0] === "#"
                            ? containerBackground
                            : bgColor
                    }
                    background={
                        typeof containerBackground === "string" &&
                            containerBackground[0] === "#"
                            ? containerBackground
                            : bgColor
                    }
                    backgroundHover={
                        typeof containerBackground === "string" &&
                            containerBackground[0] === "#"
                            ? containerBackground
                            : bgColor
                    }
                    borderHoverColor={
                        typeof containerBackground === "string" &&
                            containerBackground[0] === "#"
                            ? containerBackground
                            : bgColor
                    }
                    colorHover={
                        typeof containerBackground === "string" &&
                            containerBackground[0] === "#"
                            ? containerBackground
                            : bgColor
                    }
                    radius={radius?.value}
                    flexDirection={flexDirection}
                    justifyContent={justifyContent}
                    marginLeft={marginLeft}
                    width={width}
                    size={progressStyle === "minus" ? size : "auto"}
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
                    mobileScreen={!!mobileScreen}
                    headerMode={isHeaderFooterMode}
                    {...props}
                    className="progress-comp text-[1rem]"
                >

                    <div className="w-full space-y-0" ref={sliderRef} style={{ paddingTop: "16px", paddingBottom: "16px" }}>

                        {showLabel && (
                            <>
                                {/** @ts-ignore */}
                                {/** @ts-ignore */}
                                <ContentEditable
                                    html={label}
                                    disabled={false}
                                    tagName="div"
                                    onChange={(e) =>
                                        setProp(
                                            (props) =>
                                            (props.label = e.target.value.replace(
                                                /<\/?[^>]+(>|$)/g,
                                                ""
                                            )),
                                            500
                                        )
                                    }
                                    className={`relative mb-1 transition-all duration-200 ease-in-out focus-visible:ring-0 focus-visible:ring-transparent text-left`}
                                    style={{
                                        fontFamily: `var(${primaryFont})`,
                                        color: primaryTextColor,
                                    }}
                                />
                            </>
                        )}

                        <div className="w-full relative">
                            <UserSlider
                                value={[inputValue]}
                                defaultValue={[defaultValue]}
                                color={sliderColor ? sliderColor : primaryColor}
                                min={lowerLimit}
                                max={upperLimit}
                                step={stepsize}
                                onValueChange={(event) => {

                                    debouncedSetProp("inputValue", event[0])

                                }}
                            >
                            </UserSlider>

                            <div ref={cardRef} className="absolute top-[100%] transform -translate-x-1/2 rounded text-sm px-4 py-2" style={{ left: `${cardPosition}px`, background: sliderColor ? sliderColor : primaryColor }}>

                                <p>{prefix}{inputValue} {suffix}</p>

                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-between text-sm" style={{ color: "black" }}>
                            {!bottomLabel && <label className="invisible">_</label>}

                            {bottomLabel && (
                                <>
                                    <label>{prefix}{lowerLimit} {suffix}</label>

                                    <label>{prefix}{upperLimit} {suffix}</label>
                                </>
                            )}

                        </div>

                    </div>

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
    icon: string
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
    maxWidth: number | string
    progressvalue: number
    maxValue: number
    progressStyle: string
    forHeader: boolean
    inputValue: number
    label: string
    showLabel: boolean
    bottomLabel: boolean
    lowerLimit: number
    upperLimit: number
    stepsize: number
    prefix: string
    suffix: string
    sliderColor: string
    defaultValue: 50
}

export const SliderBarDefaultProps: IconButtonProps = {
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
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    icon: "arrowright",
    paddingLeft: "0",
    paddingTop: "0",
    paddingRight: "0",
    paddingBottom: "0",
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
    progressvalue: 1,
    maxValue: 5,
    maxWidth: "366",
    progressStyle: "minus",
    forHeader: false,
    inputValue: 50,
    label: "Label",
    showLabel: true,
    bottomLabel: true,
    lowerLimit: 0,
    upperLimit: 100,
    stepsize: 1,
    prefix: "",
    suffix: "",
    sliderColor: "",
    defaultValue: 50
}

SliderBar.craft = {
    props: SliderBarDefaultProps,
    related: {
        settings: SliderBarSettings,
    },
}

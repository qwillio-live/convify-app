import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Anchor,
  Aperture,
  ArrowLeft,
  ArrowRight,
  Disc,
  DollarSign,
  Mountain,
} from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import { useScreenNames } from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { Button as CustomButton } from "@/components/ui/button"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { LinkButtonSettings } from "./link-button.settings"

const IconsList = {
  aperture: (props) => <Aperture {...props} />,
  activity: (props) => <Activity {...props} />,
  dollarsign: (props) => <DollarSign {...props} />,
  anchor: (props) => <Anchor {...props} />,
  disc: (props) => <Disc {...props} />,
  mountain: (props) => <Mountain {...props} />,
  arrowright: (props) => <ArrowRight {...props} />,
  arrowleft: (props) => <ArrowLeft {...props} />,
}

const IconGenerator = ({ icon, size, className = "", ...rest }) => {
  const IconComponent = IconsList[icon]

  if (!IconComponent) {
    return null
  }

  return (
    <IconComponent className={`shrink-0 ${className}`} size={size} {...rest} />
  )
}

const IconButtonSizeValues = {
  small: "100px",
  medium: "200px",
  large: "376px",
  full: "100%",
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

const IconButtonMobileSizeValues = {
  small: "100px",
  medium: "200px",
  large: "360px",
  full: "100%",
}

const ButtonTextLimit = {
  small: 100,
  medium: 100,
  large: 100,
  full: 100,
}
export const LinkButtonGen = ({
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
  prevScreen,
  url,
  open,
  buttonAction,
  ...props
}) => {
  const pathName = usePathname()

  const target =
    (buttonAction === "redirect" && open === "new-window"
      ? "_blank"
      : "_self") || "_blank"

  const getRedirectUrl = () => {
    if (!buttonAction || !url) return `${pathName}#${prevScreen.screenName}`

    if (buttonAction === "redirect") {
      return url
    }

    return `${pathName}#${prevScreen.screenName}`
  }

  return (
    <div
      className="w-full relative"
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
      <Link target={target} href={getRedirectUrl()} className="contents">
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
          className="text-[1rem]"
          onClick={() => console.log("Button clicked", text)}
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
          {enableIcon && (
            <IconGenerator icon={icon} size={IconSizeValues[buttonSize]} />
          )}
        </StyledCustomButton>
      </Link>
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
  max-width: ${(props) =>
    props.mobileScreen
      ? IconButtonMobileSizeValues[props.size || "medium"]
      : IconButtonSizeValues[props.size || "medium"]};
  width: 100%;
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
  @media (max-width: 760px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 600px;
  }
  @media (max-width: 660px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 400px;
  }
`

export const LinkButton = ({
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
  prevScreen,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))

  const [hover, setHover] = React.useState(false)
  const t = useTranslations("Components")

  const ref = useRef<HTMLDivElement>(null)

  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)

  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  const prevScreenName =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[selectedScreen - 1 >= 0 ? selectedScreen - 1 : 0]
          ?.screenName
    ) || ""

  const prevScreenId =
    useAppSelector(
      (state: RootState) =>
        state?.screen?.screens[selectedScreen - 1 >= 0 ? selectedScreen - 1 : 0]
          ?.screenId
    ) || ""
  const screenNames = useScreenNames()

  useEffect(() => {
    let screenNameChanged = false
    if (buttonAction === "prev-screen") {
      setProp(
        (props) =>
          (props.prevScreen = {
            screenName: prevScreenName,
            screenId: prevScreenId,
          }),
        200
      )
    } else {
      screenNames?.map((screen) => {
        if (screen.screenId === prevScreen.screenId) {
          setProp(
            (props) =>
              (props.prevScreen = {
                screenName: screen.screenName,
                screenId: screen.screenId,
              }),
            200
          )
          screenNameChanged = true
        }
      })
      if (!screenNameChanged) {
        setProp((props) => (props.buttonAction = "prev-screen"), 200)
        setProp(
          (props) =>
            (props.prevScreen = {
              screenId: prevScreenId,
              screenName: prevScreenName,
            })
        )
      }
    }
  }, [prevScreenName, buttonAction])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  const maxLength = ButtonTextLimit[size]
  const handleTextChange = (e) => {
    const value = e.target.innerText

    if (value.length <= maxLength) {
      setProp((props) => (props.text = value))
    } else {
      if (ref.current) {
        e.target.innerText = text || ""
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(ref.current)
        range.collapse(false)
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
  }, [ref.current])

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
          {...props}
        >
          <div className="flex flex-col max-w-[100%] min-h-[16px] min-w-[32px] overflow-x-clip">
            <ContentEditable
              html={text}
              innerRef={ref}
              disabled={disabled}
              style={{
                maxWidth: "100%",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
              }}
              className="min-w-16 border-transparent leading-relaxed border-dotted hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
              }}
              tagName="div"
            />
          </div>
          {enableIcon && (
            <IconGenerator icon={icon} size={IconSizeValues[buttonSize]} />
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
  buttonAction: "redirect" | "custom-action" | "none"
  prevScreen: {
    screenId: string
    screenName: string
  }
  url: string
  open: string
}

export const IconButtonDefaultProps: IconButtonProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "#ffffff",
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
  icon: "arrowright",
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
  prevScreen: {
    screenId: "",
    screenName: "",
  },
  buttonAction: "redirect",
  url: "",
  open: "new-window",
}

LinkButton.craft = {
  props: IconButtonDefaultProps,
  related: {
    settings: LinkButtonSettings,
  },
}

import React, { useCallback, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { LogoBarSettings } from "./user-logo-bar.settings"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { useTranslations } from "next-intl"
import styled from "styled-components"
import hexoid from "hexoid"
import { debounce } from "lodash"

const LogoBarSizeValues = {
  small: "400px",
  medium: "800px",
  large: "1200px",
  full: "100%",
}

export const LogoBarGen = ({
  size,
  grayscale,
  containerBackground,
  align,
  height,
  gap,
  alignMobile,
  mobileRowItems,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  fullWidth,
  settingTabs,
  items,
  ...props
}) => {
  return (
    <div
      className="relative w-full"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100%",
        paddingTop: `${marginTop}px`,
        paddingBottom: `${marginBottom}px`,
        paddingLeft: `${marginLeft}px`,
        paddingRight: `${marginRight}px`,
      }}
    >
      <StyledLogoBarContainer
        mobileScreen={false}
        maxWidth={LogoBarSizeValues[size || "medium"]}
        align={align}
        height={height}
        gap={gap}
        alignMobile={alignMobile}
        mobileRowItems={mobileRowItems}
      >
        {items.map((item, index) => (
          <li
            className="flex items-center justify-center"
            key={index}
            style={{ height: `${height}px` }}
          >
            <img
              className="h-full w-auto object-contain"
              src={item.src}
              style={{
                ...(grayscale ? { filter: "grayscale(1)" } : {}),
              }}
            />
          </li>
        ))}
      </StyledLogoBarContainer>
    </div>
  )
}

export const LogoBar = ({
  size,
  grayscale,
  containerBackground,
  align,
  height,
  gap,
  alignMobile,
  mobileRowItems,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  fullWidth,
  settingTabs,
  items,
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

  const [hover, setHover] = useState(false)
  const t = useTranslations("Components")

  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

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
      {hover && <Controller nameOfComponent={t("Logo Bar")} />}
      <div
        className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          minWidth: "100%",
          maxWidth: "100%",
          paddingTop: `${marginTop}px`,
          paddingBottom: `${marginBottom}px`,
          paddingLeft: `${marginLeft}px`,
          paddingRight: `${marginRight}px`,
        }}
      >
        <StyledLogoBarContainer
          mobileScreen={mobileScreen ?? false}
          maxWidth={LogoBarSizeValues[size || "medium"]}
          align={align}
          height={height}
          gap={gap}
          alignMobile={alignMobile}
          mobileRowItems={mobileRowItems}
        >
          {items.map((item, index) => (
            <li
              className="flex items-center justify-center"
              key={index}
              style={{ height: `${height}px` }}
            >
              <img
                className="h-full w-auto object-contain"
                src={item.src}
                style={{
                  ...(grayscale ? { filter: "grayscale(1)" } : {}),
                }}
              />
            </li>
          ))}
        </StyledLogoBarContainer>
      </div>
    </div>
  )
}

type StyledLogoBarContainerProps = {
  mobileScreen: boolean
  maxWidth: string
  align: LogoBarAlignments
  height: number
  gap: number
  alignMobile: boolean
  mobileRowItems: number
}

const StyledLogoBarContainer = styled.ul<StyledLogoBarContainerProps>`
  width: 100%;
  height: auto;
  padding: 0 16px;
  max-width: ${({ maxWidth }) => maxWidth};
  display: ${({ alignMobile, mobileScreen }) =>
    alignMobile && mobileScreen ? "grid" : "flex"};
  justify-content: ${({ align }) => align};
  align-items: center;
  gap: ${({ gap }) => gap}px;
  grid-template-columns: repeat(
    ${({ mobileRowItems }) => mobileRowItems},
    minmax(0, 1fr)
  );

  @media (max-width: 560px) {
    display: ${({ alignMobile }) => (alignMobile ? "grid" : "flex")} !important;
  }
`

export enum LogoBarSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export enum LogoBarAlignments {
  start = "start",
  center = "center",
  end = "end",
  spaceBetween = "space-between",
}

export type LogoBarProps = {
  size: LogoBarSizes
  grayscale: boolean
  containerBackground: string
  align: LogoBarAlignments
  height: number
  gap: number
  alignMobile: boolean
  mobileRowItems: number
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  fullWidth: boolean
  settingTabs: string[]
  items: {
    id: string
    src: string
  }[]
}

export const LogoBarDefaultProps: LogoBarProps = {
  size: LogoBarSizes.medium,
  grayscale: false,
  containerBackground: "transparent",
  align: LogoBarAlignments.center,
  height: 60,
  gap: 30,
  alignMobile: false,
  mobileRowItems: 1,
  paddingLeft: "16",
  paddingTop: "20",
  paddingRight: "16",
  paddingBottom: "20",
  marginLeft: 0,
  marginTop: 20,
  marginRight: 0,
  marginBottom: 20,
  fullWidth: false,
  settingTabs: ["content"],
  items: [
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: "",
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: "",
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: "",
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: "",
    },
  ],
}

LogoBar.craft = {
  props: LogoBarDefaultProps,
  related: {
    settings: LogoBarSettings,
  },
}

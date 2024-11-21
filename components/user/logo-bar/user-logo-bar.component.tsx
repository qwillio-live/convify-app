"use client"
import React, { useCallback, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { LogoBarSettings } from "./user-logo-bar.settings"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { useTranslations } from "next-intl"
import styled from "styled-components"
import hexoid from "hexoid"
import { debounce } from "lodash"
import { ImagePictureTypes } from "@/components/PicturePicker"
import { UserInputSizes } from "../input/user-input.component"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
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
      }}
    >
      <StyledLogoBarContainer
        size={size}
        mobileScreen={false}
        align={align}
        height={height}
        gap={gap}
        alignMobile={alignMobile}
        mobileRowItems={mobileRowItems}
        isPreviewScreen={true}
        className="logobar-comp"
        isEditorScreen={pathname?.includes("create-flow")}
      >
        {items.map((item, index) => (
          <li
            className="flex items-center justify-center"
            key={index}
            style={{ height: `${height}px` }}
          >
            <picture
              key={(item.src as ImagePictureTypes).desktop}
              className="h-full"
            >
              <source
                media="(min-width:560px)"
                srcSet={(item.src as ImagePictureTypes).mobile}
              />
              <img
                src={(item.src as ImagePictureTypes).desktop}
                className="h-full w-auto object-contain"
                loading="lazy"
                style={{
                  ...(grayscale ? { filter: "grayscale(1)" } : {}),
                }}
              />
            </picture>
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
  const pathname = usePathname()
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
        }}
      >
        <StyledLogoBarContainer
          size={size}
          mobileScreen={mobileScreen ?? false}
          align={align}
          height={height}
          gap={gap}
          alignMobile={alignMobile}
          mobileRowItems={mobileRowItems}
          className="logobar-comp"
          isPreviewScreen={false}
          isEditorScreen={pathname?.includes("create-flow")}
        >
          {items.map((item, index) => (
            <li
              className="flex items-center justify-center"
              key={index}
              style={{ height: `${height}px` }}
            >
              <picture
                key={(item.src as ImagePictureTypes).desktop}
                className="h-full"
              >
                <source
                  media="(min-width:560px)"
                  srcSet={(item.src as ImagePictureTypes).mobile}
                />
                <img
                  src={(item.src as ImagePictureTypes).desktop}
                  className="h-full w-auto object-contain"
                  loading="lazy"
                  style={{
                    ...(grayscale ? { filter: "grayscale(1)" } : {}),
                  }}
                />
              </picture>
            </li>
          ))}
        </StyledLogoBarContainer>
      </div>
    </div>
  )
}

type StyledLogoBarContainerProps = {
  mobileScreen: boolean
  align: LogoBarAlignments
  height: number
  gap: number
  alignMobile: boolean
  mobileRowItems: number
  size: UserInputSizes
  isPreviewScreen: boolean
  isEditorScreen?: boolean
}

const StyledLogoBarContainer = styled.ul<StyledLogoBarContainerProps>`
  height: auto;
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

  margin-left: auto;
  margin-right: auto;

  ${({ size, mobileScreen, isPreviewScreen, isEditorScreen }) => {
    console.log("isEditorScreensdksdcsdc", isEditorScreen)
    if (mobileScreen) {
      return { width: "calc(100% - 22px)", maxWidth: "calc(100% - 22px)" }
    } else if (isPreviewScreen && !isEditorScreen) {
      if (size === UserInputSizes.small) {
        return { width: "376px" }
      } else if (size === UserInputSizes.medium) {
        return { width: "800px" }
      } else if (size === UserInputSizes.large) {
        return { width: "1000px" }
      } else {
        return {
          width: "calc(100% - 22px)",
        }
      }
    } else if (isPreviewScreen && isEditorScreen) {
      if (size === UserInputSizes.small) {
        return { width: "376px" }
      } else if (size === UserInputSizes.medium) {
        return { width: "600px", maxWidth: 600 }
      } else if (size === UserInputSizes.large) {
        return { width: "700px", maxWidth: 700 }
      } else {
        return {
          width: "calc(100% - 22px)",
        }
      }
    } else {
      if (size === UserInputSizes.small) {
        return { width: "600px" }
      } else if (size === UserInputSizes.medium) {
        return { width: "700px", maxWidth: 700 }
      } else if (size === UserInputSizes.large) {
        return { width: "800px", maxWidth: 800 }
      } else {
        return {
          width: "calc(100% - 22px)",
        }
      }
    }
  }};

  @media (max-width: 1000px) {
    ${({ size }) => {
      if (size === UserInputSizes.large) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }

  @media (max-width: 800px) {
    ${({ size }) => {
      if (size === UserInputSizes.medium) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }

  @media (max-width: 376px) {
    ${({ size }) => {
      if (size === UserInputSizes.small) {
        return { width: "calc(100% - 22px)" }
      }
    }}
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
    src: ImagePictureTypes
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
      src: {} as ImagePictureTypes,
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: {} as ImagePictureTypes,
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: {} as ImagePictureTypes,
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: {} as ImagePictureTypes,
    },
  ],
}

LogoBar.craft = {
  props: LogoBarDefaultProps,
  related: {
    settings: LogoBarSettings,
  },
}

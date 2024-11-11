"use client"

import React, { useCallback, useEffect, useState } from "react"
import { debounce } from "lodash"
import { Check, Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"

import { UserInputSizes } from "../input/user-input.component"
import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import {
  ChecklistIconRenderer,
  ChecklistSettings,
} from "./user-checklist.settings"

export const ChecklistGen = ({
  checklistItems,
  fontFamily,
  fontWeight,
  fontSize,
  icon,
  layout,
  size,
  marginLeft,
  width,
  height,
  marginRight,
  marginTop,
  textColor,
  containerBackground,
  iconColor,
  marginBottom,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  columnsDesktop,
  ...props
}) => {
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  return (
    <div
      className="relative w-full max-w-[calc(100%-22px)]"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // minWidth: "100%",
        paddingTop: `${marginTop}px`,
        paddingBottom: `${marginBottom}px`,
        paddingLeft: `${marginLeft}px`,
        paddingRight: `${marginRight}px`,
      }}
    >
      <Wrapper
        size={size}
        mobileScreen={false}
        className="flex w-full gap-2"
        columnsDesktop={columnsDesktop}
        // style={{
        //   flexDirection: layout,
        // }}
      >
        {checklistItems.map((item, index) => (
          <li key={index} className="flex flex-1 items-center gap-3">
            <ChecklistIconRenderer
              iconName={icon}
              style={{
                width: `${fontSize}px`,
                height: `${fontSize}px`,
                color: iconColor,
              }}
            />
            <span
              className="flex-1"
              style={{
                color: textColor !== "#ffffff" ? textColor : primaryTextColor,
                fontFamily: `var(${fontFamily?.value})`,
                fontWeight: fontWeight,
                fontSize: `${fontSize}px`,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: item.value }} />
            </span>
          </li>
        ))}
      </Wrapper>
    </div>
  )
}

type StyledWrapper = {
  size: UserInputSizes
  mobileScreen: boolean
  columnsDesktop: number
}

const Wrapper = styled.ul<StyledWrapper>`
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  column-gap: 40px;
  display: grid;

  /* @media (max-width: 1000px) {
    ${({ size }) => ({ width: "calc(100% - 22px)" })}
  } */

  grid-template-columns: repeat(
    ${({ columnsDesktop, mobileScreen }) =>
      mobileScreen ? 1 : columnsDesktop},
    minmax(0, 1fr)
  );
`

export const Checklist = ({
  checklistItems,
  fontFamily,
  fontWeight,
  fontSize,
  icon,
  iconColor,
  layout,
  size,
  marginLeft,
  width,
  height,
  marginRight,
  marginTop,
  marginBottom,
  textColor,
  borderColor,
  containerBackground,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  columnsDesktop,
  ...props
}) => {
  console.log("ChecklistProps", size)
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

  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  useEffect(() => {
    if (primaryColor) {
      setProp((props) => (props.borderColor = primaryColor), 200)
    }
  }, [primaryColor])

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
      {hover && <Controller nameOfComponent={t("Checklist")} />}

      <div
        className={cn("relative w-full", {
          "max-w-[calc(100%-22px)]": !mobileScreen,
        })}
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingTop: `${marginTop}px`,
          paddingBottom: `${marginBottom}px`,
          paddingLeft: `${marginLeft}px`,
          paddingRight: `${marginRight}px`,
        }}
      >
        <Wrapper
          size={size}
          mobileScreen={!!mobileScreen}
          className="user-checklist-comp flex w-full gap-2"
          columnsDesktop={columnsDesktop}
          // style={{
          //   flexDirection: layout,
          // }}
        >
          {checklistItems.map((item, index) => (
            <ChecklistItemSettings
              key={index}
              fontSize={fontSize}
              fontFamily={fontFamily}
              fontWeight={fontWeight}
              iconColor={iconColor}
              textColor={textColor !== "#ffffff" ? textColor : primaryTextColor}
              borderColor={borderColor}
              icon={icon}
              item={item}
              index={index}
              onValueChange={(updatedValue) =>
                setProp((prop) => {
                  prop.checklistItems[index].value = updatedValue
                }, 200)
              }
            />
          ))}
        </Wrapper>
      </div>
    </div>
  )
}

const ChecklistItemSettings = ({
  fontSize,
  fontFamily,
  fontWeight,
  iconColor,
  textColor,
  borderColor,
  icon,
  item,
  index,
  onValueChange,
}) => {
  const [itemValue, setItemValue] = useState(item.value)
  console.log("ChecklistProps inside")

  useEffect(() => {
    setItemValue(item.value)
  }, [item.value])

  return (
    <li key={index} className="flex w-full flex-1 items-center gap-3">
      <ChecklistIconRenderer
        iconName={icon}
        style={{
          width: `${fontSize}px`,
          height: `${fontSize}px`,
          color: iconColor,
        }}
      />
      <div className="flex-1">
        {/** @ts-ignore */}
        {/** @ts-ignore */}
        <ContentEditable
          className="w-full px-1"
          html={itemValue}
          onChange={(e) => {
            setItemValue(e.target.value)
            onValueChange(e.target.value)
          }}
          style={{
            color: textColor,
            fontFamily: `var(${fontFamily?.value})`,
            fontWeight: fontWeight,
            fontSize: `${fontSize}px`,
            outlineColor: borderColor,
            borderRadius: "4px",
            wordBreak: "break-word",
          }}
        />
      </div>
    </li>
  )
}

export enum ChecklistSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export enum ChecklistLayouts {
  column = "column",
  row = "row",
}

export enum ChecklistPresets {
  normal = "normal",
  bold = "bold",
}

export type ChecklistProps = {
  checklistItems: object[]
  fontFamily: StyleProperty
  fontWeight: string
  fontSize: number
  size: ChecklistSizes
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  icon: string
  iconColor: string
  textColor?: string
  borderColor: string
  containerBackground: string
  layout: string
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
  fullWidth: boolean
  settingTabs: string[]
  preset: ChecklistPresets
  columnsDesktop: number
}

export const ChecklistDefaultProps: ChecklistProps = {
  checklistItems: [],
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  fontWeight: "normal",
  fontSize: 16,
  icon: "interface-validation-check-circle-checkmark-addition-circle-success-check-validation-add-form",
  layout: ChecklistLayouts.column,
  textColor: "#ffffff",
  borderColor: "#3182ce",
  containerBackground: "transparent",
  iconColor: "green",
  width: ChecklistSizes.small,
  height: "auto",
  size: ChecklistSizes.medium,
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
  fullWidth: true,
  settingTabs: ["content"],
  preset: ChecklistPresets.normal,
  columnsDesktop: 2,
}

Checklist.craft = {
  props: ChecklistDefaultProps,
  related: {
    settings: ChecklistSettings,
  },
}

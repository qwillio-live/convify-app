import React, { useCallback, useEffect, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import {
  ChecklistIconRenderer,
  ChecklistSettings,
} from "./user-checklist.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import { debounce } from "lodash"

const ChecklistSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const ChecklistMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

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
      <ul
        className="flex w-full gap-2"
        style={{
          flexDirection: layout,
          maxWidth: ChecklistMobileSizeValues[size || "medium"],
        }}
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
                color: textColor,
                fontFamily: `var(${fontFamily?.value})`,
                fontWeight: fontWeight,
                fontSize: `${fontSize}px`,
              }}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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

  useEffect(() => {
    if (primaryTextColor) {
      setProp((props) => (props.textColor = primaryTextColor), 200)
    }
  }, [primaryTextColor])

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
        <ul
          className="flex w-full gap-2"
          style={{
            flexDirection: layout,
            maxWidth: mobileScreen
              ? ChecklistMobileSizeValues[size || "small"]
              : ChecklistSizeValues[size || "small"],
          }}
        >
          {checklistItems.map((item, index) => (
            <ChecklistItemSettings
              key={index}
              fontSize={fontSize}
              fontFamily={fontFamily}
              fontWeight={fontWeight}
              iconColor={iconColor}
              textColor={textColor}
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
        </ul>
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
  textColor: string
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
  textColor: "#000000",
  borderColor: "#3182ce",
  containerBackground: "transparent",
  iconColor: "green",
  width: ChecklistSizes.small,
  height: "auto",
  size: ChecklistSizes.small,
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
}

Checklist.craft = {
  props: ChecklistDefaultProps,
  related: {
    settings: ChecklistSettings,
  },
}

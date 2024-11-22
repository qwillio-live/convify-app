"use client"

import React, { useCallback, useEffect, useState } from "react"
import { debounce } from "lodash"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn, getComputedValueForTextEditor, serialize } from "@/lib/utils"

import { UserInputSizes } from "../input/user-input.component"
import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import {
  ChecklistIconRenderer,
  ChecklistSettings,
} from "./user-checklist.settings"
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"
import { TextEditor } from "@/components/TextEditor"

export const ChecklistGen = ({
  checklistItems,
  fontFamily,
  fontWeight,
  fontSize,
  icon,
  iconType,
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
  column,
  toolbarPreview = false,
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
        boxSizing: "border-box",
        // minWidth: "100%",
        paddingTop: `${marginTop}px`,
        paddingBottom: `${marginBottom}px`,
        paddingLeft: `${marginLeft}px`,
        paddingRight: `${marginRight}px`,
      }}
    >
      <Wrapper
        size={size}
        columns={column}
        mobileScreen={false}
        toolbarPreview={toolbarPreview}
        className="user-checklist-comp w-full"
      >
        {checklistItems.map((item, index) => (
          <li key={index} className="flex w-full flex-1 items-center gap-3">
            <ChecklistIconRenderer
              iconName={icon}
              style={{
                width: `${fontSize}px`,
                height: `${fontSize}px`,
                color: iconColor,
              }}
            />
            <div
              className="w-1 flex-1 break-words"
              style={{
                color: textColor !== "#ffffff" ? textColor : primaryTextColor,
                fontFamily: `var(${fontFamily?.value})`,
                fontWeight: fontWeight,
                fontSize: `${fontSize}px`,
              }}
            >
              {/* <div dangerouslySetInnerHTML={{ __html: item.value }} /> */}
              <TextEditor
                isReadOnly
                initValue={getComputedValueForTextEditor(item.value)}
                key={index}
              />
            </div>
          </li>
        ))}
      </Wrapper>
    </div>
  )
}

const Wrapper = styled.ul<{
  size: UserInputSizes
  mobileScreen: boolean
  columns: number
  toolbarPreview?: boolean
}>`
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(
    ${(props) => (props.mobileScreen ? 1 : props.columns)},
    minmax(0, 1fr)
  );
  column-gap: 40px;
  vertical-gap: 20px;
  align-items: center;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  /* @media (max-width: 1000px) {
    ${({ size }) => ({ width: "calc(100% - 22px)" })}
  } */

  ${({ size, mobileScreen, toolbarPreview }) => {
    if (mobileScreen || toolbarPreview) {
      return { width: "calc(100% - 22px)" }
    }

    switch (size) {
      case UserInputSizes.small:
        return { width: "min(250px, 100%)" } // Assuming small size width
      case UserInputSizes.medium:
        return { width: "min(376px, 100%)" }
      case UserInputSizes.large:
        return { width: "min(576px, 100%)" }
      default:
        return { width: "100%" }
    }
  }};
`

export const Checklist = ({
  checklistItems,
  fontFamily,
  fontWeight,
  fontSize,
  icon,
  iconType,
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
  column,
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
    setProp((props) => (props.fontFamily.value = primaryFont), 200)
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
        zIndex: "1",
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
          columns={column}
          mobileScreen={!!mobileScreen}
          className="user-checklist-comp w-full"
        >
          {checklistItems.map((item, index) => (
            <ChecklistItemSettings
              key={`${item.id}-${index}`}
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
              iconType={iconType}
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
  iconType,
  item,
  index,
  onValueChange,
}) => {
  console.log(item.value, "check here")
  const [itemValue, setItemValue] = useState(item.value)
  console.log("ChecklistProps inside")

  useEffect(() => {
    setItemValue(item.value)
  }, [item.value])

  return (
    <li key={index} className="flex w-full flex-1 items-center gap-3">
      {iconType === PictureTypes.NULL && (icon as React.ReactNode)}
      {iconType === PictureTypes.ICON && (
        <SvgRenderer iconName={icon as string} />
      )}
      {iconType === PictureTypes.EMOJI && (
        <span className="flex size-5 items-center justify-center text-[18px] leading-[20px]">
          {icon as string}
        </span>
      )}
      {iconType === PictureTypes.IMAGE && (
        <picture>
          <source
            media="(min-width:1080px)"
            srcSet={(icon as ImagePictureTypes).desktop}
          />
          <source
            media="(min-width:560px)"
            srcSet={(icon as ImagePictureTypes).mobile}
          />
          <img
            src={(icon as ImagePictureTypes).original}
            alt="icon"
            className="size-5 object-contain"
          />
        </picture>
      )}

      <div className="flex-1">
        {/** @ts-ignore */}
        {/** @ts-ignore */}
        <div
          style={{
            color: textColor,
            fontFamily: `var(${fontFamily?.value})`,
            fontWeight: fontWeight,
            fontSize: `${fontSize}px`,
            outlineColor: borderColor,
            borderRadius: "4px",
            wordBreak: "break-word",
          }}
          className="w-full px-1"
        >
          <TextEditor
            onChange={(val) => {
              const serialized = serialize(val)
              onValueChange(serialized)
            }}
            initValue={getComputedValueForTextEditor(itemValue ?? "")}
          />
        </div>
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
  iconType: PictureTypes
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
  column: number
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
  iconType: PictureTypes.ICON,
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
  column: 2,
}

Checklist.craft = {
  props: ChecklistDefaultProps,
  related: {
    settings: ChecklistSettings,
  },
}

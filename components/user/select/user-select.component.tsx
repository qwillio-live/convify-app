import React, { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { useNode } from "@/lib/craftjs"
import {
  Select as CustomSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller } from "../settings/controller.component"
import { SelectSettings } from "./user-select.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { useTranslations } from "next-intl"
import hexoid from "hexoid"
import { getSortedSelectOptions } from "./useSelectThemePresets"
import ContentEditable from "react-contenteditable"
import { debounce } from "lodash"

const SelectSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const SelectMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

export const SelectGen = ({
  selectOptions,
  disabled,
  fontFamily,
  required,
  sortAlphabetically,
  label,
  fieldName,
  placeholder,
  size,
  marginLeft,
  width,
  height,
  marginRight,
  marginTop,
  labelColor,
  containerBackground,
  marginBottom,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  border,
  borderColor,
  borderHoverColor,
  selectedOptionTextColor,
  selectedOptionBackgroundColor,
  ...props
}) => {
  const [selectedOptionId, setSelectedOptionId] = React.useState<
    string | undefined
  >()

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
      <CustomSelect
        value={selectedOptionId}
        onValueChange={(value) => setSelectedOptionId(value)}
      >
        <div
          className="w-full p-1"
          style={{
            color: labelColor,
            fontFamily: `var(${fontFamily?.value})`,
            maxWidth: SelectSizeValues[size || "medium"],
          }}
        >
          <label>{label}</label>
        </div>
        <StyledCustomSelectTrigger
          className={`!outline-none !ring-transparent [&>span]:line-clamp-1 [&>span]:text-ellipsis [&>span]:break-all ${
            !selectedOptionId ? "text-muted-foreground" : ""
          }`}
          fontFamily={fontFamily?.value}
          borderHoverColor={borderHoverColor?.value}
          borderColor={borderColor.value}
          border={border}
          width={width}
          size={size}
          height={height}
          paddingLeft={paddingLeft}
          paddingTop={paddingTop}
          paddingRight={paddingRight}
          paddingBottom={paddingBottom}
          mobileScreen={false}
          {...props}
        >
          <SelectValue placeholder={placeholder} />
        </StyledCustomSelectTrigger>
        <SelectContent>
          {getSortedSelectOptions(selectOptions, sortAlphabetically).map(
            (item, index) => (
              <SelectItem
                key={item.id}
                value={item.id}
                style={{
                  fontFamily: `var(${fontFamily?.value})`,
                  ...(selectedOptionId === item.id
                    ? {
                        backgroundColor: selectedOptionBackgroundColor.value,
                        color: selectedOptionTextColor,
                      }
                    : {}),
                }}
              >
                {item.value}
              </SelectItem>
            )
          )}
        </SelectContent>
      </CustomSelect>
    </div>
  )
}
interface StyledSelectProps {
  fontFamily?: string
  size?: string
  width?: string | number
  height?: string | number
  paddingLeft?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
}
const StyledCustomSelectTrigger = styled(SelectTrigger)<StyledSelectProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  font-weight: 400;
  font-size: 16px;
  border: 1px dashed transparent;
  transition: all 0.2s ease;

  &:hover {
    border-style: solid;
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired hover border color */
  }

  &:focus {
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired focus border color */
  }

  overflow: hidden;
  max-width: ${(props) =>
    props.mobileScreen
      ? SelectMobileSizeValues[props.size || "medium"]
      : SelectSizeValues[props.size || "medium"]};
  width: 100%;
  box-sizing: border-box;
  height: ${(props) => props.height}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => props.paddingBottom}px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
  background-color: white;
  @media (max-width: 760px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 600px;
  }
  @media (max-width: 660px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 400px;
  }
`

export const Select = ({
  required,
  sortAlphabetically,
  label: originalLabel,
  fieldName,
  placeholder,
  selectOptions,
  selectedOptionId,
  fontFamily,
  disabled,
  borderHoverColor,
  size,
  marginLeft,
  width,
  height,
  marginRight,
  marginTop,
  marginBottom,
  labelColor,
  containerBackground,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  border,
  borderColor,
  selectedOptionTextColor,
  selectedOptionBackgroundColor,
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

  const [label, setLabel] = useState(originalLabel)
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

  useEffect(() => {
    setLabel(originalLabel)
  }, [originalLabel])

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont])

  useEffect(() => {
    if (primaryColor) {
      setProp((props) => {
        props.borderHoverColor.value = primaryColor
        props.selectedOptionBackgroundColor.value = primaryColor

        return props
      }, 200)
    }
  }, [primaryColor])

  useEffect(() => {
    if (primaryTextColor) {
      setProp((props) => (props.labelColor = primaryTextColor), 200)
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
      {hover && <Controller nameOfComponent={t("Select")} />}
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
        <CustomSelect
          value={selectedOptionId}
          onValueChange={(value) =>
            setProp((props) => (props.selectedOptionId = value))
          }
        >
          <div
            className="w-full py-1"
            style={{
              fontFamily: `var(${fontFamily?.value})`,
              maxWidth: mobileScreen
                ? SelectMobileSizeValues[size || "small"]
                : SelectSizeValues[size || "small"],
            }}
          >
            <ContentEditable
              className="px-1"
              html={label}
              onChange={(e) => {
                setLabel(e.target.value)
                handlePropChangeDebounced("label", e.target.value)
              }}
              style={{
                color: labelColor,
                outlineColor: borderHoverColor.value,
                borderRadius: "4px",
              }}
            />
          </div>
          <StyledCustomSelectTrigger
            className={`!outline-none !ring-transparent [&>span]:line-clamp-1 [&>span]:text-ellipsis [&>span]:break-all ${
              !selectedOptionId ? "text-muted-foreground" : ""
            }`}
            fontFamily={fontFamily.value}
            borderColor={borderColor.value}
            borderHoverColor={borderHoverColor.value}
            border={border}
            mobileScreen={mobileScreen || false}
            width={width}
            height={height}
            paddingLeft={paddingLeft}
            paddingTop={paddingTop}
            paddingRight={paddingRight}
            paddingBottom={paddingBottom}
            size={size}
            {...props}
          >
            <SelectValue placeholder={placeholder} />
          </StyledCustomSelectTrigger>
          <SelectContent>
            {getSortedSelectOptions(selectOptions, sortAlphabetically).map(
              (item, index) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  style={{
                    fontFamily: `var(${fontFamily?.value})`,
                    ...(selectedOptionId === item.id
                      ? {
                          backgroundColor: selectedOptionBackgroundColor.value,
                          color: selectedOptionTextColor,
                        }
                      : {}),
                  }}
                >
                  {item.value}
                </SelectItem>
              )
            )}
          </SelectContent>
        </CustomSelect>
      </div>
    </div>
  )
}

export enum SelectSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export type SelectProps = {
  selectOptions: object[]
  selectedOptionId: string | undefined
  fontFamily: StyleProperty
  labelColor: string
  containerBackground: string
  disabled: boolean
  required: boolean
  sortAlphabetically: boolean
  size: SelectSizes
  label: string
  fieldName: string
  placeholder: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  border: number
  borderColor: StyleProperty
  borderHoverColor: StyleProperty
  selectedOptionTextColor: string
  selectedOptionBackgroundColor: StyleProperty
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
  fullWidth: boolean
  settingsTab: string
  tracking: boolean
  trackingEvent: string
}

export const SelectDefaultProps: SelectProps = {
  selectOptions: [
    { id: `select-option-item-${hexoid(4)()}`, value: "Option 1" },
    { id: `select-option-item-${hexoid(4)()}`, value: "Option 2" },
    { id: `select-option-item-${hexoid(4)()}`, value: "Option 3" },
  ],
  selectedOptionId: undefined,
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  labelColor: "#000000",
  containerBackground: "transparent",
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
  selectedOptionTextColor: "inherit",
  selectedOptionBackgroundColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  disabled: false,
  required: false,
  sortAlphabetically: false,
  width: SelectSizes.small,
  height: "auto",
  size: SelectSizes.small,
  label: "",
  fieldName: "",
  placeholder: "",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
  border: 2,
  fullWidth: true,
  settingsTab: "content",
  tracking: false,
  trackingEvent: "button_clicked",
}

Select.craft = {
  props: SelectDefaultProps,
  related: {
    settings: SelectSettings,
  },
}

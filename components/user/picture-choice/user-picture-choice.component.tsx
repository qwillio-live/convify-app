import React, { useCallback, useEffect, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { PictureChoiceSettings } from "./user-picture-choice.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { useTranslations } from "next-intl"
import { rgba } from "polished"
import styled from "styled-components"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import hexoid from "hexoid"
import { PictureTypes, SvgRenderer } from "@/components/PicturePicker"
import { debounce } from "lodash"
import ContentEditable from "react-contenteditable"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const PictureChoiceSizeValues = {
  small: "400px",
  medium: "800px",
  large: "1200px",
  full: "100%",
}

export const PictureChoiceGen = ({
  disabled = false,
  fontFamily,
  size,
  label,
  required,
  fieldName,
  labelColor,
  containerBackground,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  settingTabs,
  multiSelect,
  checkboxVisible,
  preset,
  defaultStyles,
  hoverStyles,
  selectedStyles,
  selections,
  choices,
  tracking,
  ...props
}) => {
  const [selectedChoices, setSelectedChoices] = useState(selections)

  useEffect(() => {
    setSelectedChoices(selections)
  }, [selections])

  return (
    <div
      className="relative w-full"
      style={{
        pointerEvents: disabled ? "none" : "auto",
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
      <div
        className="w-full p-1 text-center"
        style={{
          color: labelColor,
          fontFamily: `var(${fontFamily?.value})`,
          maxWidth: PictureChoiceSizeValues[size || "small"],
        }}
      >
        <label>{label}</label>
      </div>
      <ul
        className="flex w-full flex-wrap justify-center"
        style={{
          fontFamily: `var(${fontFamily?.value})`,
          maxWidth: PictureChoiceSizeValues[size || "medium"],
        }}
      >
        {choices?.map((choice, index) => (
          <PictureChoiceItem
            key={index}
            isFirst={index === 0}
            isLast={index === choices.length - 1}
            isSelected={selectedChoices?.includes(choice.id)}
            size={size}
            required={required}
            tracking={tracking}
            choicesLength={choices.length}
            choice={choice}
            fieldName={fieldName}
            multiSelect={multiSelect}
            checkboxVisible={checkboxVisible}
            defaultStyles={defaultStyles}
            hoverStyles={hoverStyles}
            selectedStyles={selectedStyles}
            onValueChange={null}
            onSelectChange={() => {
              if (multiSelect) {
                setSelectedChoices((prev) => {
                  if (prev.includes(choice.id)) {
                    return prev.filter(
                      (selectionId) => selectionId !== choice.id
                    )
                  } else {
                    return [...prev, choice.id]
                  }
                })
              } else {
                setSelectedChoices(
                  selectedChoices.includes(choice.id) ? [] : [choice.id]
                )
              }
            }}
          />
        ))}
      </ul>
    </div>
  )
}

export const PictureChoice = ({
  fontFamily,
  size,
  label: originalLabel,
  required,
  fieldName,
  labelColor,
  labelBorderColor,
  containerBackground,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  settingTabs,
  multiSelect,
  checkboxVisible,
  preset,
  defaultStyles,
  hoverStyles,
  selectedStyles,
  selections,
  choices,
  tracking,
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
    const updatedStyles = {
      [PictureChoicePresets.outlined]: [
        ["defaultStyles", "iconColor"],
        ["hoverStyles", "iconColor"],
        ["hoverStyles", "borderColor"],
        ["selectedStyles", "backgroundColor", 0.05],
        ["selectedStyles", "iconColor"],
        ["selectedStyles", "borderColor"],
        ["selectedStyles", "backgroundColor", 0.1],
      ],
      [PictureChoicePresets.semifilled]: [
        ["hoverStyles", "checkBoxIconColor"],
        ["hoverStyles", "checkboxBorderColor"],
        ["hoverStyles", "iconColor"],
        ["hoverStyles", "textTopBorderColor"],
        ["hoverStyles", "textBackgroundColor"],
        ["hoverStyles", "borderColor"],
        ["selectedStyles", "checkboxBorderColor"],
        ["selectedStyles", "checkBoxBackgroundColor"],
        ["selectedStyles", "iconColor"],
        ["selectedStyles", "textTopBorderColor"],
        ["selectedStyles", "textBackgroundColor"],
        ["selectedStyles", "borderColor"],
      ],
      [PictureChoicePresets.filled]: [
        ["defaultStyles", "iconColor"],
        ["hoverStyles", "borderColor"],
        ["hoverStyles", "backgroundColor"],
        ["selectedStyles", "borderColor"],
        ["selectedStyles", "backgroundColor"],
      ],
    }

    setProp(
      (props) => (props.labelBorderColor = primaryColor || "#3182ce"),
      200
    )

    setProp((props) => {
      Object.keys(updatedStyles).forEach((key) => {
        if (preset === key) {
          updatedStyles[key].forEach(([style, field, alpha]) => {
            props[style][field] = alpha
              ? rgba(primaryColor || "#3182ce", alpha)
              : primaryColor
          })
        }
      })
      return props
    }, 200)
  }, [primaryColor])

  useEffect(() => {
    setProp((props) => (props.labelColor = primaryTextColor || "#000000"), 200)
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
      {hover && <Controller nameOfComponent={t("Picture Choice")} />}
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
        <div
          className="w-full p-1 text-center"
          style={{
            fontFamily: `var(${fontFamily?.value})`,
            maxWidth: PictureChoiceSizeValues[size || "medium"],
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
              outlineColor: labelBorderColor,
              borderRadius: "4px",
            }}
          />
        </div>
        <ul
          className="flex w-full flex-wrap justify-center"
          style={{
            fontFamily: `var(${fontFamily?.value})`,
            maxWidth: PictureChoiceSizeValues[size || "medium"],
          }}
        >
          {choices.map((choice, index) => (
            <PictureChoiceItem
              key={index}
              isFirst={index === 0}
              isLast={index === choices.length - 1}
              isSelected={selections.includes(choice.id)}
              required={required}
              tracking={tracking}
              size={size}
              choicesLength={choices.length}
              choice={choice}
              fieldName={fieldName}
              multiSelect={multiSelect}
              checkboxVisible={checkboxVisible}
              defaultStyles={defaultStyles}
              hoverStyles={hoverStyles}
              selectedStyles={selectedStyles}
              onValueChange={(updatedValue) => {
                handlePropChangeDebounced(
                  "choices",
                  choices.map((choice, i) =>
                    i === index ? { ...choice, value: updatedValue } : choice
                  )
                )
              }}
              onSelectChange={() => {
                if (multiSelect) {
                  setProp((props) => {
                    if (props.selections.includes(choice.id)) {
                      props.selections = props.selections.filter(
                        (selectionId) => selectionId !== choice.id
                      )
                    } else {
                      props.selections.push(choice.id)
                    }
                    return props
                  }, 200)
                } else {
                  setProp((props) => {
                    props.selections = selections.includes(choice.id)
                      ? []
                      : [choice.id]
                    return props
                  }, 200)
                }
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const PictureChoiceItem = ({
  isFirst,
  isLast,
  isSelected,
  size,
  choicesLength,
  choice,
  fieldName,
  required,
  tracking,
  multiSelect,
  checkboxVisible,
  defaultStyles,
  hoverStyles,
  selectedStyles,
  onValueChange,
  onSelectChange,
}) => {
  const [choiceValue, setChoiceValue] = useState(choice.value)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setChoiceValue(choice.value)
  }, [choice.value])

  const getFlexBasis = (n) => {
    if (size === PictureChoiceSizes.small) {
      return 50
    }
    if (n === 1) {
      return 100
    }
    if (n === 7 || n == 11) {
      return 25
    }
    if (n === 2) {
      return 50
    }
    if ((n - 4) % 2 === 0 && n !== 6) {
      return 25
    }
    if ((n - 3) % 2 === 0) {
      return 33.33
    }
    if (n % 3 === 0) {
      return 33.33
    }
  }
  return (
    <li
      className=" flex min-w-[0] max-w-[205px] flex-[1] flex-grow-0 justify-center pb-[10px] pr-[10px]"
      style={{
        flexBasis: `${getFlexBasis(choicesLength)}%`,
      }}
    >
      <StyledPictureChoiceItem
        isSelected={isSelected}
        pictureType={choice.pictureType}
        defaultStyles={isSelected ? selectedStyles : defaultStyles}
        hoverStyles={isSelected ? selectedStyles : hoverStyles}
        onClick={isEditing ? null : onSelectChange}
      >
        <input
          className={!multiSelect ? "send-response" : undefined}
          id={choice.id}
          data-field-name={fieldName}
          data-answer={choice.value}
          data-value={isSelected}
          data-tracking={tracking}
          data-event-name={choice.trackingEvent}
          data-action={choice.buttonAction}
          data-next-screen={choice.nextScreen}
          {...(required ? { required: true } : {})}
          style={{ display: "none" }}
        />
        <div className="absolute right-1 top-1">
          {checkboxVisible &&
            (multiSelect ? (
              checkboxVisible && (
                <Checkbox
                  className="!size-5 [&>span>svg]:!size-4"
                  checked={true}
                />
              )
            ) : (
              <RadioGroup value="checked">
                <RadioGroupItem
                  className="!size-5 [&>span>svg]:!size-3.5"
                  value="checked"
                />
              </RadioGroup>
            ))}
        </div>

        {choice.pictureType !== PictureTypes.NULL && (
          <div
            className="flex w-full items-center justify-center"
            style={{
              padding:
                choice.pictureType !== PictureTypes.IMAGE ? "12.5% 0 2.5%" : "",
            }}
          >
            {choice.pictureType === PictureTypes.ICON ? (
              <SvgRenderer
                svgData={choice.picture}
                width="50px"
                height="50px"
              />
            ) : choice.pictureType === PictureTypes.EMOJI ? (
              <img src={choice.picture} className="size-[50px] object-cover" />
            ) : (
              <img
                src={choice.picture}
                className="h-auto w-full object-cover"
              />
            )}
          </div>
        )}
        <div className="flex w-full flex-1 items-center justify-center p-2 text-lg">
          {onValueChange === null ? (
            <span
              className="w-full whitespace-break-spaces"
              style={{ wordBreak: "break-word" }}
            >
              {choice.value}
            </span>
          ) : (
            <ContentEditable
              className="w-fit max-w-full whitespace-break-spaces p-1"
              style={{ wordBreak: "break-word" }}
              html={choiceValue}
              disabled={onValueChange === null}
              onChange={(e) => {
                setChoiceValue(e.target.value)
                onValueChange(e.target.value)
              }}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
            />
          )}
        </div>
      </StyledPictureChoiceItem>
    </li>
  )
}

type StyledPictureChoiceItemProps = {
  isSelected: boolean
  pictureType: PictureTypes
  defaultStyles: {
    checkBoxIconColor: string
    checkboxBorderColor: string
    checkBoxBackgroundColor: string
    iconColor: string
    textColor: string
    textTopBorderColor: string
    textBackgroundColor: string
    borderColor: string
    backgroundColor: string
  }
  hoverStyles: {
    checkBoxIconColor: string
    checkboxBorderColor: string
    checkBoxBackgroundColor: string
    iconColor: string
    textColor: string
    textTopBorderColor: string
    textBackgroundColor: string
    borderColor: string
    backgroundColor: string
  }
}

const StyledPictureChoiceItem = styled(Button)<StyledPictureChoiceItemProps>`
  width: 100%;
  height: auto;
  padding: 0;
  font-size: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 15px;

  transition: transform 0.1s ease-in-out;
  transform: translateY(${({ isSelected }) => (isSelected ? -2 : 0)}px);

  border: 2px solid ${({ defaultStyles }) => defaultStyles.borderColor};
  color: ${({ defaultStyles }) => defaultStyles.textColor};
  background-color: ${({ defaultStyles }) => defaultStyles.backgroundColor};

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ hoverStyles }) => hoverStyles.borderColor};
    color: ${({ hoverStyles }) => hoverStyles.textColor};
    background-color: ${({ hoverStyles }) => hoverStyles.backgroundColor};
  }

  //For Checkbox

  & > div > button {
    background-color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxBackgroundColor};
    border-color: ${({ defaultStyles }) =>
      defaultStyles.checkboxBorderColor} !important;
  }

  & > div > button > span > svg {
    color: ${({ defaultStyles }) => defaultStyles.checkBoxIconColor} !important;
  }

  &:hover > div > button {
    background-color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxBackgroundColor};
    border-color: ${({ hoverStyles }) =>
      hoverStyles.checkboxBorderColor} !important;
  }

  &:hover > div > button > span > svg {
    color: ${({ hoverStyles }) => hoverStyles.checkBoxIconColor} !important;
  }

  //For Radio Button

  & > div > div > button {
    background-color: ${({ defaultStyles, isSelected }) =>
      !isSelected
        ? defaultStyles.checkBoxBackgroundColor
        : defaultStyles.checkBoxIconColor};
    border-color: ${({ defaultStyles }) =>
      defaultStyles.checkboxBorderColor} !important;
  }

  & > div > div > button > span > svg {
    color: ${({ defaultStyles, isSelected }) =>
      !isSelected
        ? defaultStyles.checkBoxIconColor
        : defaultStyles.checkBoxBackgroundColor} !important;
  }

  &:hover > div > div > button {
    border-color: ${({ hoverStyles }) =>
      hoverStyles.checkboxBorderColor} !important;
  }

  &:hover > div > div > button > span > svg {
    color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxBackgroundColor} !important;
  }

  // For Icon

  & > div > svg {
    color: ${({ defaultStyles }) => defaultStyles.iconColor};
  }

  &:hover > div > svg {
    color: ${({ hoverStyles }) => hoverStyles.iconColor};
  }

  // For Text

  & > div:last-child {
    margin-top: ${({ defaultStyles, pictureType }) =>
      defaultStyles.textTopBorderColor !== "transparent" &&
      pictureType !== PictureTypes.IMAGE
        ? "12.5%"
        : ""};
    border-top: 2px solid
      ${({ defaultStyles }) => defaultStyles.textTopBorderColor};
    background-color: ${({ defaultStyles }) =>
      defaultStyles.textBackgroundColor};

    border-bottom-left-radius: 13px;
    border-bottom-right-radius: 13px;
    transform: scale(1.01);
  }

  &:hover > div:last-child {
    border-top-color: ${({ hoverStyles }) => hoverStyles.textTopBorderColor};
    background-color: ${({ hoverStyles }) => hoverStyles.textBackgroundColor};
  }
`

export enum PictureChoiceSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export enum PictureChoicePresets {
  filled = "filled",
  semifilled = "semifilled",
  outlined = "outlined",
}

export type PictureChoiceProps = {
  fontFamily: StyleProperty
  size: PictureChoiceSizes
  label: string
  required: boolean
  fieldName: string
  labelColor: string
  labelBorderColor: string
  containerBackground: string
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
  multiSelect: boolean
  checkboxVisible: boolean
  preset: PictureChoicePresets
  defaultStyles: {
    checkBoxIconColor: string
    checkboxBorderColor: string
    checkBoxBackgroundColor: string
    iconColor: string
    textColor: string
    textTopBorderColor: string
    textBackgroundColor: string
    borderColor: string
    backgroundColor: string
  }
  hoverStyles: {
    checkBoxIconColor: string
    checkboxBorderColor: string
    checkBoxBackgroundColor: string
    iconColor: string
    textColor: string
    textTopBorderColor: string
    textBackgroundColor: string
    borderColor: string
    backgroundColor: string
  }
  selectedStyles: {
    checkBoxIconColor: string
    checkboxBorderColor: string
    checkBoxBackgroundColor: string
    iconColor: string
    textColor: string
    textTopBorderColor: string
    textBackgroundColor: string
    borderColor: string
    backgroundColor: string
  }
  selections: string[]
  choices: {
    id: string
    picture: string | null
    pictureType: PictureTypes
    value: string
    buttonAction: string | null
    nextScreen: string | null
    trackingEvent: string | null
  }[]
  tracking: boolean
}

export const PictureChoiceDefaultProps: PictureChoiceProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  size: PictureChoiceSizes.medium,
  required: false,
  label: "Please select an option",
  fieldName: "",
  labelColor: "#000000",
  labelBorderColor: "#3182ce",
  containerBackground: "transparent",
  paddingLeft: "16",
  paddingTop: "20",
  paddingRight: "16",
  paddingBottom: "20",
  marginLeft: 0,
  marginTop: 20,
  marginRight: 0,
  marginBottom: 20,
  fullWidth: true,
  settingTabs: ["content"],
  multiSelect: false,
  checkboxVisible: false,
  preset: PictureChoicePresets.filled,
  defaultStyles: {
    checkBoxIconColor: "transparent",
    checkboxBorderColor: "#eaeaeb",
    checkBoxBackgroundColor: "transparent",
    iconColor: "#3182ce",
    textColor: "#000000",
    textTopBorderColor: "#transparent",
    textBackgroundColor: "transparent",
    borderColor: "#eaeaeb",
    backgroundColor: "transparent",
  },
  hoverStyles: {
    checkBoxIconColor: "transparent",
    checkboxBorderColor: "transparent",
    checkBoxBackgroundColor: "transparent",
    iconColor: "#3182ce",
    textColor: "#000000",
    textTopBorderColor: "#transparent",
    textBackgroundColor: "transparent",
    borderColor: "#3182ce",
    backgroundColor: "transparent",
  },
  selectedStyles: {
    checkBoxIconColor: "transparent",
    checkboxBorderColor: "transparent",
    checkBoxBackgroundColor: "transparent",
    iconColor: "#3182ce",
    textColor: "#000000",
    textTopBorderColor: "#transparent",
    textBackgroundColor: "transparent",
    borderColor: "#3182ce",
    backgroundColor: rgba("#3182ce", 0.1),
  },
  selections: [],
  choices: [
    {
      id: `input-${hexoid(4)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: "Option 1",
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(4)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: "Option 2",
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(4)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: "Option 3",
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
    {
      id: `input-${hexoid(4)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      value: "Option 4",
      buttonAction: null,
      nextScreen: null,
      trackingEvent: null,
    },
  ],
  tracking: false,
}

PictureChoice.craft = {
  props: PictureChoiceDefaultProps,
  related: {
    settings: PictureChoiceSettings,
  },
}
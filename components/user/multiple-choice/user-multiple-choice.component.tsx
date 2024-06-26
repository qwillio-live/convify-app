import React, { useCallback, useEffect, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { MultipleChoiceSettings } from "./user-multiple-choice.settings"
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

const MultipleChoiceSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const MultipleChoiceMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

export const MultipleChoiceGen = ({
  disabled = false,
  fontFamily,
  size,
  label,
  required,
  fieldName,
  layout,
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
  contentReversed,
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
      <ul
        className="flex w-full flex-col items-center justify-center"
        style={{
          gap: layout === MultipleChoiceLayouts.collapsed ? "0" : "8px",
          fontFamily: `var(${fontFamily?.value})`,
          maxWidth: MultipleChoiceSizeValues[size || "nedium"],
        }}
      >
        <div
          className="w-full p-1 text-center"
          style={{
            color: labelColor,
            fontFamily: `var(${fontFamily?.value})`,
            maxWidth: MultipleChoiceSizeValues[size || "small"],
          }}
        >
          <label>{label}</label>
        </div>
        {choices.map((choice, index) => (
          <MultipleChoiceItem
            key={index}
            isFirst={index === 0}
            isLast={index === choices.length - 1}
            isCollapsed={layout === MultipleChoiceLayouts.collapsed}
            isSelected={selectedChoices.includes(choice.id)}
            isPreviousSelected={
              index > 0 && selections.includes(choices[index - 1].id)
            }
            required={required}
            tracking={tracking}
            choice={choice}
            fieldName={fieldName}
            multiSelect={multiSelect}
            checkboxVisible={checkboxVisible}
            contentReversed={contentReversed}
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

export const MultipleChoice = ({
  fontFamily,
  size,
  label: originalLabel,
  required,
  fieldName,
  layout,
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
  contentReversed,
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
  const [hover, setHover] = React.useState(false)
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
      [MultipleChoicePresets.filled]: [
        ["hoverStyles", "iconColor"],
        ["hoverStyles", "textColor"],
        ["hoverStyles", "borderColor"],
        ["selectedStyles", "borderColor"],
        ["selectedStyles", "backgroundColor"],
      ],
      [MultipleChoicePresets.semifilled]: [
        ["hoverStyles", "checkBoxIconColor"],
        ["hoverStyles", "checkboxBorderColor"],
        ["hoverStyles", "iconColor"],
        ["hoverStyles", "borderColor"],
        ["selectedStyles", "checkboxBorderColor"],
        ["selectedStyles", "checkBoxBackgroundColor"],
        ["selectedStyles", "iconColor"],
        ["selectedStyles", "borderColor"],
        ["selectedStyles", "backgroundColor", 0.1],
      ],
      [MultipleChoicePresets.outlined]: [
        ["hoverStyles", "checkboxBorderColor"],
        ["hoverStyles", "iconColor"],
        ["hoverStyles", "borderColor"],
        ["selectedStyles", "checkboxBorderColor"],
        ["selectedStyles", "checkBoxBackgroundColor"],
        ["selectedStyles", "iconColor"],
        ["selectedStyles", "borderColor"],
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
            props[style][field].value = alpha
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
      {hover && <Controller nameOfComponent={t("Multiple Choice")} />}
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
            maxWidth: mobileScreen
              ? MultipleChoiceMobileSizeValues[size || "small"]
              : MultipleChoiceSizeValues[size || "small"],
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
          className="flex w-full flex-col items-center justify-center"
          style={{
            gap: layout === MultipleChoiceLayouts.collapsed ? "0" : "8px",
            fontFamily: `var(${fontFamily?.value})`,
            maxWidth: mobileScreen
              ? MultipleChoiceMobileSizeValues[size || "medium"]
              : MultipleChoiceSizeValues[size || "nedium"],
          }}
        >
          {choices.map((choice, index) => (
            <MultipleChoiceItem
              key={index}
              isFirst={index === 0}
              isLast={index === choices.length - 1}
              isCollapsed={layout === MultipleChoiceLayouts.collapsed}
              isSelected={selections.includes(choice.id)}
              isPreviousSelected={
                index > 0 && selections.includes(choices[index - 1].id)
              }
              required={required}
              tracking={tracking}
              choice={choice}
              fieldName={fieldName}
              multiSelect={multiSelect}
              checkboxVisible={checkboxVisible}
              contentReversed={contentReversed}
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

const MultipleChoiceItem = ({
  isFirst,
  isLast,
  isCollapsed,
  isSelected,
  isPreviousSelected,
  choice,
  fieldName,
  required,
  tracking,
  multiSelect,
  checkboxVisible,
  contentReversed,
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

  return (
    <li className="w-full">
      <StyledMultipleChoiceItem
        isFirst={isFirst}
        isLast={isLast}
        isCollapsed={isCollapsed}
        isSelected={isSelected}
        isPreviousSelected={isPreviousSelected}
        contentReversed={contentReversed}
        borderTopRounded={isCollapsed ? isFirst : true}
        borderBottomRounded={isCollapsed ? isLast : true}
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
        <div>
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

        {choice.pictureType !== PictureTypes.NULL &&
          (choice.pictureType === PictureTypes.ICON ? (
            <SvgRenderer svgData={choice.picture} width="24px" height="24px" />
          ) : choice.pictureType === PictureTypes.EMOJI ? (
            <span className="flex size-6 items-center justify-center text-[22px] leading-[24px]">
              {choice.picture}
            </span>
          ) : (
            <img src={choice.picture} className="size-6 object-contain" />
          ))}

        <div className="flex-1 text-start">
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
              onBlur={(e) => setIsEditing(false)}
            />
          )}
        </div>
      </StyledMultipleChoiceItem>
    </li>
  )
}

type StyledMultipleChoiceItemProps = {
  isFirst: boolean
  isLast: boolean
  isCollapsed: boolean
  isSelected: boolean
  isPreviousSelected: boolean
  contentReversed: boolean
  borderTopRounded: boolean
  borderBottomRounded: boolean
  defaultStyles: {
    checkBoxIconColor: StyleProperty
    checkboxBorderColor: StyleProperty
    checkBoxBackgroundColor: StyleProperty
    iconColor: StyleProperty
    textColor: StyleProperty
    borderColor: StyleProperty
    backgroundColor: StyleProperty
  }
  hoverStyles: {
    checkBoxIconColor: StyleProperty
    checkboxBorderColor: StyleProperty
    checkBoxBackgroundColor: StyleProperty
    iconColor: StyleProperty
    textColor: StyleProperty
    borderColor: StyleProperty
    backgroundColor: StyleProperty
  }
}

const StyledMultipleChoiceItem = styled(Button)<StyledMultipleChoiceItemProps>`
  width: 100%;
  min-height: 50px;
  height: auto;
  font-size: 16px;
  display: flex;
  flex-direction: ${({ contentReversed }) =>
    contentReversed ? "row-reverse" : "row"};
  gap: 12px;
  align-items: center;
  justify-content: start;
  border-top-left-radius: ${({ borderTopRounded }) =>
    borderTopRounded ? 8 : 0}px;
  border-top-right-radius: ${({ borderTopRounded }) =>
    borderTopRounded ? 8 : 0}px;
  border-bottom-left-radius: ${({ borderBottomRounded }) =>
    borderBottomRounded ? 8 : 0}px;
  border-bottom-right-radius: ${({ borderBottomRounded }) =>
    borderBottomRounded ? 8 : 0}px;

  transition: all 0.1s ease-in-out;

  border: 2px solid ${({ defaultStyles }) => defaultStyles.borderColor.value};

  border-top-width: ${({ isFirst, isCollapsed, isPreviousSelected }) =>
    isFirst || !isCollapsed || !isPreviousSelected ? "2px" : "0px"};

  border-bottom-width: ${({ isLast, isCollapsed, isSelected }) =>
    isLast || !isCollapsed || isSelected ? "2px" : "0px"};

  color: ${({ defaultStyles }) => defaultStyles.textColor.value};
  background-color: ${({ defaultStyles }) =>
    defaultStyles.backgroundColor.value};

  &:hover {
    transform: translateY(${({ isSelected }) => (!isSelected ? -2 : 0)}px);

    border-top-width: ${({ isFirst, isPreviousSelected }) =>
      isFirst || !isPreviousSelected ? 2 : 0}px;
    border-bottom-width: 2px;

    border-color: ${({ hoverStyles }) => hoverStyles.borderColor.value};
    color: ${({ hoverStyles }) => hoverStyles.textColor.value};
    background-color: ${({ hoverStyles }) => hoverStyles.backgroundColor.value};
  }

  & > div > button {
    background-color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxBackgroundColor.value};
    border-color: ${({ defaultStyles }) =>
      defaultStyles.checkboxBorderColor.value} !important;
  }

  & > div > button > span > svg {
    color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxIconColor.value} !important;
  }

  &:hover > div > button {
    background-color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxBackgroundColor.value};
    border-color: ${({ hoverStyles }) =>
      hoverStyles.checkboxBorderColor.value} !important;
  }

  &:hover > div > button > span > svg {
    color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxIconColor.value} !important;
  }

  & > div > div > button {
    border: 1px solid
      ${({ defaultStyles }) => defaultStyles.checkboxBorderColor.value};
  }

  & > div > div > button > span > svg {
    color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxBackgroundColor.value};
  }

  &:hover > div > button {
    border: 1px solid
      ${({ hoverStyles }) => hoverStyles.checkboxBorderColor.value};
  }

  &:hover > div > button > svg {
    color: ${({ hoverStyles }) => hoverStyles.checkBoxBackgroundColor.value};
  }

  & > svg {
    color: ${({ defaultStyles }) => defaultStyles.iconColor.value};
  }

  &:hover > svg {
    color: ${({ hoverStyles }) => hoverStyles.iconColor.value};
  }
`

export enum MultipleChoiceSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export enum MultipleChoiceLayouts {
  collapsed = "collapsed",
  list = "list",
}

export enum MultipleChoicePresets {
  filled = "filled",
  semifilled = "semifilled",
  outlined = "outlined",
}

export type MultipleChoiceProps = {
  fontFamily: StyleProperty
  size: MultipleChoiceSizes
  label: string
  required: boolean
  fieldName: string
  layout: MultipleChoiceLayouts
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
  contentReversed: boolean
  preset: MultipleChoicePresets
  defaultStyles: {
    checkBoxIconColor: StyleProperty
    checkboxBorderColor: StyleProperty
    checkBoxBackgroundColor: StyleProperty
    iconColor: StyleProperty
    textColor: StyleProperty
    borderColor: StyleProperty
    backgroundColor: StyleProperty
  }
  hoverStyles: {
    checkBoxIconColor: StyleProperty
    checkboxBorderColor: StyleProperty
    checkBoxBackgroundColor: StyleProperty
    iconColor: StyleProperty
    textColor: StyleProperty
    borderColor: StyleProperty
    backgroundColor: StyleProperty
  }
  selectedStyles: {
    checkBoxIconColor: StyleProperty
    checkboxBorderColor: StyleProperty
    checkBoxBackgroundColor: StyleProperty
    iconColor: StyleProperty
    textColor: StyleProperty
    borderColor: StyleProperty
    backgroundColor: StyleProperty
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

export const MultipleChoiceDefaultProps: MultipleChoiceProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  size: MultipleChoiceSizes.medium,
  label: "Please choose an option",
  required: false,
  fieldName: "",
  layout: MultipleChoiceLayouts.collapsed,
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
  contentReversed: false,
  preset: MultipleChoicePresets.filled,
  defaultStyles: {
    checkBoxIconColor: {
      value: "transparent",
      globalStyled: false,
      isCustomized: false,
    },
    checkboxBorderColor: {
      value: "transparent",
      globalStyled: false,
      isCustomized: false,
    },
    checkBoxBackgroundColor: {
      value: "transparent",
      globalStyled: false,
      isCustomized: false,
    },
    iconColor: {
      value: "#000000",
      globalStyled: false,
      isCustomized: false,
    },
    textColor: {
      value: "#000000",
      globalStyled: false,
      isCustomized: false,
    },
    borderColor: {
      value: "#eaeaeb",
      globalStyled: false,
      isCustomized: false,
    },
    backgroundColor: {
      value: "transparent",
      globalStyled: false,
      isCustomized: false,
    },
  },
  hoverStyles: {
    checkBoxIconColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    checkboxBorderColor: {
      value: "transparent",
      globalStyled: true,
      isCustomized: false,
    },
    checkBoxBackgroundColor: {
      value: "transparent",
      globalStyled: true,
      isCustomized: false,
    },
    iconColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    textColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    borderColor: {
      value: "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundColor: {
      value: "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
  },
  selectedStyles: {
    checkBoxIconColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    checkboxBorderColor: {
      value: "transparent",
      globalStyled: true,
      isCustomized: false,
    },
    checkBoxBackgroundColor: {
      value: "transparent",
      globalStyled: true,
      isCustomized: false,
    },
    iconColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    textColor: {
      value: "#ffffff",
      globalStyled: true,
      isCustomized: false,
    },
    borderColor: {
      value: "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    backgroundColor: {
      value: "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
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
  ],
  tracking: false,
}

MultipleChoice.craft = {
  props: MultipleChoiceDefaultProps,
  related: {
    settings: MultipleChoiceSettings,
  },
}

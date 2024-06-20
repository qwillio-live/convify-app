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
import { PictureTypes } from "@/components/PicturePicker"
import { debounce } from "lodash"
import ContentEditable from "react-contenteditable"

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
  required,
  fieldName,
  layout,
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
        {choices.map((choice, index) => (
          <MultipleChoiceItem
            key={index}
            isFirst={index === 0}
            isLast={index === choices.length - 1}
            isCollapsed={layout === MultipleChoiceLayouts.collapsed}
            isSelected={selectedChoices.includes(choice.id)}
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
  required,
  fieldName,
  layout,
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
  choices: originalChoices,
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

  const [choices, setChoices] = useState(originalChoices)
  const [hover, setHover] = React.useState(false)
  const t = useTranslations("Components")

  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
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
    setChoices(originalChoices)
  }, [originalChoices])

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

    Object.keys(updatedStyles).forEach((key) => {
      if (preset === key) {
        updatedStyles[key].forEach(([style, field, alpha]) => {
          setProp((props) => {
            props[style][field].value = alpha
              ? rgba(primaryColor || "#ffffff", alpha)
              : primaryColor
            return props
          }, 200)
        })
      }
    })
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
                setChoices(
                  choices.map((choice, i) =>
                    i === index ? { ...choice, value: updatedValue } : choice
                  )
                )
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
  const [isEditing, setIsEditing] = useState(false)
  return (
    <li className="w-full">
      <StyledMultipleChoiceItem
        isSelected={isSelected}
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
        {checkboxVisible &&
          (multiSelect ? (
            checkboxVisible && (
              <Checkbox
                className="!size-5 [&>span>svg]:!size-4"
                checked={true}
              />
            )
          ) : (
            <div>
              <Button className="flex !size-5 items-center justify-center rounded-full !bg-transparent p-0">
                {<div className="size-3.5 rounded-full" />}
              </Button>
            </div>
          ))}

        {choice.pictureType !== PictureTypes.NULL &&
          (choice.pictureType === PictureTypes.ICON ? (
            <span dangerouslySetInnerHTML={{ __html: choice.picture }} />
          ) : (
            <img src={choice.picture} className="size-6 object-cover" />
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
              className="max-w-full w-fit whitespace-break-spaces p-1"
              style={{ wordBreak: "break-word" }}
              html={choice.value}
              disabled={onValueChange === null}
              onChange={(e) => onValueChange(e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
            />
          )}
        </div>
      </StyledMultipleChoiceItem>
    </li>
  )
}

type StyledMultipleChoiceItemProps = {
  isSelected: boolean
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

  transition: all 0.2s ease-in-out;

  transform: translateY(${({ isSelected }) => (isSelected ? -2 : 0)}px);

  border: 2px solid ${({ defaultStyles }) => defaultStyles.borderColor.value};
  color: ${({ defaultStyles }) => defaultStyles.textColor.value};
  background-color: ${({ defaultStyles }) =>
    defaultStyles.backgroundColor.value};

  &:hover {
    transform: translateY(-2px);

    border-color: ${({ hoverStyles }) => hoverStyles.borderColor.value};
    color: ${({ hoverStyles }) => hoverStyles.textColor.value};
    background-color: ${({ hoverStyles }) => hoverStyles.backgroundColor.value};
  }

  & > button {
    background-color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxBackgroundColor.value};
    border-color: ${({ defaultStyles }) =>
      defaultStyles.checkboxBorderColor.value} !important;
  }

  & > button > span > svg {
    color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxIconColor.value} !important;
  }

  &:hover > button {
    background-color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxBackgroundColor.value};
    border-color: ${({ hoverStyles }) =>
      hoverStyles.checkboxBorderColor.value} !important;
  }

  &:hover > button > span > svg {
    color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxIconColor.value} !important;
  }

  & > div > button {
    border: 1px solid
      ${({ defaultStyles }) => defaultStyles.checkboxBorderColor.value};
  }

  & > div > button > div {
    background-color: ${({ defaultStyles }) =>
      defaultStyles.checkBoxBackgroundColor.value};
  }

  &:hover > div > button {
    border: 1px solid
      ${({ hoverStyles }) => hoverStyles.checkboxBorderColor.value};
  }

  &:hover > div > button > div {
    background-color: ${({ hoverStyles }) =>
      hoverStyles.checkBoxBackgroundColor.value};
  }

  & > span > svg {
    color: ${({ defaultStyles }) => defaultStyles.iconColor.value};
  }

  &:hover > span > svg {
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
  required: boolean
  fieldName: string
  layout: MultipleChoiceLayouts
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
  required: false,
  fieldName: "",
  layout: MultipleChoiceLayouts.collapsed,
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

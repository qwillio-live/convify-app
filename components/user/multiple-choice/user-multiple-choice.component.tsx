"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { MultipleChoiceSettings } from "./user-multiple-choice.settings"
import { StyleProperty } from "../types/style.types"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { useTranslations } from "next-intl"
import { rgba } from "polished"
import styled from "styled-components"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import hexoid from "hexoid"
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"
import { debounce } from "lodash"
import ContentEditable from "react-contenteditable"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import {
  getAllFilledAnswers,
  setPreviewScreenData,
  setSelectedData,
  setSelectedScreen,
  setUpdateFilledCount,
  validateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { UserInputSizes } from "../input/user-input.component"

const MultipleChoiceSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const Wrapper = styled.div<{
  size: UserInputSizes
  mobileScreen?: boolean
}>`
  margin-left: auto;
  margin-right: auto;

  ${({ size, mobileScreen }) => {
    if (size === UserInputSizes.small) {
      return { width: "250px" }
    } else if (size === UserInputSizes.medium) {
      if (mobileScreen) {
        return { width: "calc(100% - 22px)" }
      } else {
        return { width: "376px" }
      }
    } else if (size === UserInputSizes.large) {
      if (mobileScreen) {
        return { width: "calc(100% - 22px)" }
      } else {
        return { width: "576px" }
      }
    } else {
      return {
        width: "calc(100% - 22px)",
      }
    }
  }};

  @media (max-width: 600px) {
    ${({ size }) => {
      if (size === UserInputSizes.large) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }

  @media (max-width: 390px) {
    ${({ size }) => {
      if (size === UserInputSizes.medium) {
        return { width: "calc(100% - 22px)" }
      }
    }}
  }
`

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
  const [selectedChoices, setSelectedChoices] = useState<string[]>(selections)

  const [isCountUpdated, setIsCountUpdated] = useState(false)
  const screenData = useAppSelector((state) => {
    const selectedScreenData =
      state.screen?.screens[state.screen.selectedScreen]?.screenData
    if (typeof selectedScreenData === "string") {
      return JSON.parse(
        state.screen?.screens[state.screen.selectedScreen].screenData
      )[props.nodeId]?.props?.selections
    }
    return []
  })
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const isRequired = useAppSelector((state) => {
    const selectedScreenData =
      state.screen?.screens[state.screen.selectedScreen]?.screenData
    if (typeof selectedScreenData === "string") {
      return JSON.parse(
        state.screen?.screens[state.screen.selectedScreen].screenData
      )[props.nodeId]?.props?.required
    }
    return false
  })
  const dispatch = useAppDispatch()
  // useEffect(() => {
  //   setSelectedChoices(screenData)
  //   if (screenData?.length > 0) {
  //     setIsCountUpdated(true)
  //   }
  // }, [])
  const alarm = useAppSelector(
    (state) =>
      state.screen?.screens[state.screen.selectedScreen]?.alarm || false
  )
  const counttt = useAppSelector(
    (state) =>
      state.screen?.screens[state.screen.selectedScreen]?.errorCount || 0
  )
  const itemRef = useRef<HTMLUListElement | null>(null)
  const shakeItem = () => {
    const currentItem = itemRef.current // Store the current reference for null check
    if (currentItem) {
      currentItem.classList.add("shake")
      // Remove the class after animation ends
      const removeShake = () => {
        currentItem.classList.remove("shake")
        currentItem.removeEventListener("animationend", removeShake)
      }
      currentItem.addEventListener("animationend", removeShake)
    }
  }
  useEffect(() => {
    if (alarm && isRequired && screenData?.length === 0) {
      shakeItem() // Call shake function when alarm is updated
    }
  }, [counttt, alarm, isRequired]) // Depend on alarm state
  return (
    <div
      className="m-choice relative w-full"
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
      <Wrapper size={size} className="mcq-input-comp">
        <ul
          ref={itemRef}
          className="flex w-full flex-col items-center justify-center"
          style={{
            gap: layout === MultipleChoiceLayouts.collapsed ? "0" : "8px",
            fontFamily: `var(${fontFamily?.value})`,
          }}
        >
          <div
            className="w-full p-1 text-center"
            style={{
              color: `${
                labelColor !== "#ffffff" ? labelColor : primaryTextColor
              }`,
              fontFamily: `var(${fontFamily?.value})`,
              maxWidth: MultipleChoiceSizeValues[size || "small"],
            }}
          >
            <label>{label}</label>
          </div>
          {choices.map((choice, index) => (
            <MultipleChoiceItem
              buttonAction={choice.buttonAction}
              isRequired={isRequired}
              forGen={true}
              key={index}
              isFirst={index === 0}
              isLast={index === choices.length - 1}
              isCollapsed={layout === MultipleChoiceLayouts.collapsed}
              isSelected={selectedChoices?.includes(choice.id) || false}
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
              selections={selectedChoices}
              onSelectChange={() => {
                if (multiSelect) {
                  setSelectedChoices((prev) => {
                    if (prev?.includes(choice.id)) {
                      // Remove choice from selection
                      const updatedChoices = prev.filter(
                        (selectionId) => selectionId !== choice.id
                      )
                      if (isRequired) {
                        if (updatedChoices.length > 0 && !isCountUpdated) {
                          dispatch(setUpdateFilledCount(1)) // Dispatch with 1 if there's a selection
                          setIsCountUpdated(true) // Set count updated flag
                        } else if (
                          updatedChoices.length === 0 &&
                          isCountUpdated
                        ) {
                          dispatch(setUpdateFilledCount(-1)) // Dispatch with -1 if no selection
                          setIsCountUpdated(false) // Reset count updated flag
                        }
                      }

                      // Dispatch action for removing choice
                      dispatch(
                        setPreviewScreenData({
                          nodeId: props.nodeId,
                          newSelections: updatedChoices,
                          entity: "selections",
                          isArray: true,
                        })
                      )

                      return updatedChoices
                    } else {
                      // Add choice to selection
                      const updatedChoices = prev
                        ? [...prev, choice.id]
                        : [choice.id]
                      if (isRequired) {
                        if (updatedChoices.length > 0 && !isCountUpdated) {
                          dispatch(setUpdateFilledCount(1)) // Dispatch with 1 if there's a selection
                          setIsCountUpdated(true) // Set count updated flag
                        } else if (
                          updatedChoices.length === 0 &&
                          isCountUpdated
                        ) {
                          dispatch(setUpdateFilledCount(-1)) // Dispatch with -1 if no selection
                          setIsCountUpdated(false) // Reset count updated flag
                        }
                      }
                      // Dispatch action for adding choice
                      dispatch(
                        setPreviewScreenData({
                          nodeId: props.nodeId,
                          newSelections: updatedChoices,
                          entity: "selections",
                          isArray: true,
                        })
                      )
                      return updatedChoices
                    }
                  })
                } else {
                  console.log("entered else")
                  const newSelection = selectedChoices?.includes(choice.id)
                    ? []
                    : [choice.id]

                  dispatch(
                    setSelectedData(
                      selectedChoices?.includes(choice.id) ? [] : [choice.id]
                    )
                  )
                  dispatch(
                    setPreviewScreenData({
                      nodeId: props.nodeId,
                      newSelections: selectedChoices?.includes(choice.id)
                        ? []
                        : [choice.id],
                      entity: "selections",
                      isArray: true,
                    })
                  )
                  if (isRequired) {
                    if (newSelection.length > 0 && !isCountUpdated) {
                      dispatch(setUpdateFilledCount(1)) // Dispatch with 1 if there's a selection
                      setIsCountUpdated(true) // Set count updated flag
                    } else if (newSelection.length === 0 && isCountUpdated) {
                      dispatch(setUpdateFilledCount(-1)) // Dispatch with -1 if no selection
                      setIsCountUpdated(false) // Reset count updated flag
                    }
                  }
                  setSelectedChoices(
                    selectedChoices?.includes(choice.id) ? [] : [choice.id]
                  )
                }
              }}
            />
          ))}
        </ul>
      </Wrapper>
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
      <Wrapper
        size={size}
        mobileScreen={mobileScreen}
        className="mcq-input-comp"
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
            }}
          >
            {/** @ts-ignore */}
            <ContentEditable
              className="px-1"
              html={label}
              onChange={(e) => {
                setLabel(e.target.value)
                handlePropChangeDebounced("label", e.target.value)
              }}
              // onSelectChange={() => {
              //   if (multiSelect) {
              //     setProp((props) => {
              //       if (props.selections.includes(choice.id)) {
              //         props.selections = props.selections.filter(
              //           (selectionId) => selectionId !== choice.id
              //         )
              //       } else {
              //         props.selections.push(choice.id)
              //       }
              //       return props
              //     }, 200)
              //   } else {
              //     setProp((props) => {
              //       props.selections = selections.includes(choice.id)
              //         ? []
              //         : [choice.id]
              //       return props
              //     }, 200)
              //   }
              // }}
            />
          </div>
          <ul
            className="flex w-full flex-col items-center justify-center"
            style={{
              gap: layout === MultipleChoiceLayouts.collapsed ? "0" : "8px",
              fontFamily: `var(${fontFamily?.value})`,
            }}
          >
            {choices.map((choice, index) => (
              <MultipleChoiceItem
                buttonAction={choice.buttonAction}
                forGen={false}
                isRequired={false}
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
                selections={selections}
                onValueChange={(updatedValue) => {
                  setProp((props) => {
                    props.choices[index].value = updatedValue
                    return props
                  }, 200)
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
      </Wrapper>
    </div>
  )
}

const MultipleChoiceItem = ({
  isFirst,
  isRequired,
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
  forGen,
  selections,
  buttonAction,
}) => {
  const [choiceValue, setChoiceValue] = useState(choice.value)
  const [isEditing, setIsEditing] = useState(false)
  const alarm = useAppSelector(
    (state) =>
      state.screen?.screens[state.screen.selectedScreen]?.alarm || false
  )
  useEffect(() => {
    setChoiceValue(choice.value)
  }, [choice.value])
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const sc = useAppSelector((state) => state?.screen?.screens) || []
  const currentScreenName =
    useAppSelector((state) => state?.screen?.currentScreenName) || ""
  const selectedScreen = useAppSelector(
    (state) =>
      state?.screen?.screens.findIndex(
        (screen) => screen.screenName === currentScreenName
      ) || 0
  )
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams || undefined)
    if (term) {
      params.set("screen", term)
    }
    console.log("new path", `${pathname}?${params.toString()}`)
    router.push(`${pathname}?${params.toString()}`)
  }
  const newScreensMapper = {
    "next-screen":
      selectedScreen + 1 < sc.length
        ? sc[selectedScreen + 1]?.screenName
        : sc[selectedScreen]?.screenName,
    "back-screen":
      selectedScreen - 1 >= 0
        ? sc[selectedScreen - 1]?.screenName
        : sc[selectedScreen]?.screenName,
    none: "none",
  }
  const newsc = choice.nextScreen
  const updatedScreenName = newScreensMapper[buttonAction] || newsc
  const index = sc.findIndex(
    (screen) => screen.screenName === updatedScreenName
  )
  const handleNavigateToContent = () => {
    if (index !== -1) {
      if (
        buttonAction === "next-screen" ||
        (buttonAction === "custom-action" && newsc !== "none")
      ) {
        console.log(
          "navigating mc if.....",
          buttonAction,
          updatedScreenName,
          newsc
        )
        dispatch(
          validateScreen({
            current: currentScreenName,
            next: updatedScreenName,
          })
        )
        handleSearch(updatedScreenName)
        dispatch(getAllFilledAnswers(true))
        dispatch(setSelectedScreen(index))
      } else if (newsc !== "none") {
        console.log(
          "navigating mc else.....",
          buttonAction,
          updatedScreenName,
          newsc
        )
        dispatch(
          validateScreen({
            current: currentScreenName,
            next: newsc,
          })
        )
        handleSearch(newsc)
        dispatch(getAllFilledAnswers(true))
        const index = sc.findIndex((screen) => screen.screenName === newsc) || 0
        dispatch(setSelectedScreen(index))
      }
    }
  }
  return (
    <li
      className="w-full"
      onClick={() => {
        if (forGen) {
          handleNavigateToContent()
        }
      }}
    >
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
                  className={`!size-5 [&>span>svg]:!size-4 ${
                    alarm &&
                    isRequired &&
                    selections.length === 0 &&
                    " !border-2 !border-red-600"
                  }`}
                  checked={true}
                />
              )
            ) : (
              <RadioGroup value="checked">
                <RadioGroupItem
                  className={`!size-5 [&>span>svg]:!size-3.5 ${
                    alarm &&
                    isRequired &&
                    selections.length === 0 &&
                    " !border-2 !border-red-600"
                  }`}
                  value="checked"
                />
              </RadioGroup>
            ))}
        </div>

        {choice.pictureType !== PictureTypes.NULL &&
          (choice.pictureType === PictureTypes.ICON ? (
            <SvgRenderer iconName={choice.picture} width="24px" height="24px" />
          ) : choice.pictureType === PictureTypes.EMOJI ? (
            <span className="flex size-6 items-center justify-center text-[22px] leading-[24px]">
              {choice.picture}
            </span>
          ) : (
            <picture key={(choice.picture as ImagePictureTypes).desktop}>
              <source
                media="(min-width:560px)"
                srcSet={(choice.picture as ImagePictureTypes).mobile}
              />
              <img
                src={(choice.picture as ImagePictureTypes).desktop}
                className="size-6 object-contain"
                loading="lazy"
              />
            </picture>
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
            <>
              {/** @ts-ignore */}
              {/** @ts-ignore */}
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
            </>
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
  labelColor?: string
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
    picture: ImagePictureTypes | string | null
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
  labelColor: "#ffffff",
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

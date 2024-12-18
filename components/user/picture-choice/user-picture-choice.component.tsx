"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import hexoid from "hexoid"
import { debounce } from "lodash"
import { Pi } from "lucide-react"
import { useTranslations } from "next-intl"
import { rgba } from "polished"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import {
  getAllFilledAnswers,
  setPreviewScreenData,
  setSelectedData,
  setSelectedScreen,
  setUpdateFilledCount,
  validateScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ImagePictureTypes,
  PictureTypes,
  SvgRenderer,
} from "@/components/PicturePicker"

import { UserInputSizes } from "../input/user-input.component"
import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import { PictureChoiceSettings } from "./user-picture-choice.settings"
import { useMediaQuery } from "@/hooks/use-media-query"

const Wrapper = styled.ul<{ mobileScreen?: boolean; size: UserInputSizes }>`
  margin-left: auto;
  margin-right: auto;

  ${({ size, mobileScreen }) => {
    if (mobileScreen) {
      return { width: "calc(100% - 20px)" }
    } else {
      if (size === UserInputSizes.small) {
        return { width: "376px", maxWidth: "400px" }
      } else if (size === UserInputSizes.medium) {
        return { width: "calc(100% - 22px)", maxWidth: "800px" }
      } else if (size === UserInputSizes.large) {
        return { width: "calc(100% - 22px)", maxWidth: "1000px" }
      } else {
        return { width: "calc(100% - 20px)" }
      }
    }
  }};

  @media (max-width: 376px) {
    width: calc(100% - 20px);
  }
`

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
  const [selectedChoices, setSelectedChoices] = useState<string[]>(selections)
  const [isCountUpdated, setIsCountUpdated] = useState(false)
  useEffect(() => {
    setSelectedChoices(selections)
  }, [selections])

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

  console.log("selected data in opic", screenData, choices)
  const dispatch = useAppDispatch()
  useEffect(() => {
    setSelectedChoices(screenData)
    if (screenData?.length > 0) {
      setIsCountUpdated(true)
    }
  }, [])

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
    console.log("shaking again pc", alarm, isRequired, screenData?.length)
    if (alarm && isRequired && screenData?.length === 0) {
      shakeItem() // Call shake function when alarm is updated
    }
  }, [counttt, alarm, isRequired]) // Depend on alarm state
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
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
      <Wrapper size={size} className="user-picture-choice-component">
        <div
          className="w-full p-1 text-center"
          style={{
            color: labelColor,
            fontFamily: `var(${fontFamily?.value})`,
          }}
        >
          <label>{label}</label>
        </div>
        <ul
          // className="flex w-full flex-wrap justify-center"
          ref={itemRef}
          className={`flex w-full flex-wrap justify-center gap-[10px]`}
          style={{
            fontFamily: `var(${fontFamily?.value})`,
            // maxWidth:
          }}
        >
          {choices?.map((choice, index) => (
            <PictureChoiceItem
              preset={preset}
              buttonAction={choice.buttonAction}
              key={index}
              isFirst={index === 0}
              isLast={index === choices.length - 1}
              isSelected={selectedChoices?.includes(choice.id) || false}
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
              forGen={true}
              selections={selectedChoices}
              isRequired={isRequired}
              onSelectChange={() => {
                if (multiSelect) {
                  setSelectedChoices((prev) => {
                    if (prev.includes(choice.id)) {
                      // Remove choice from selection
                      const updatedChoices = prev.filter(
                        (selectionId) => selectionId !== choice.id
                      )
                      if (isRequired) {
                        console.log(
                          "updatedChoices.length > 0 && !isCountUpdated",
                          updatedChoices.length,
                          isCountUpdated
                        )
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
                      const updatedChoices = [...prev, choice.id]
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
      [PictureChoicePresets.prefilled]: [
        ["defaultStyles", "backgroundColor"],
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
        mobileScreen={!!mobileScreen}
        className="user-picture-choice-component"
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
            }}
          >
            {/** @ts-ignore */}
            {/** @ts-ignore */}
            <ContentEditable
              className="px-1"
              html={label}
              onChange={(e) => {
                setLabel(e.target.value)
                handlePropChangeDebounced("label", e.target.value)
              }}
              // onSelectChange={() => {
              // if (multiSelect) {
              //   setProp((props) => {
              //     if (props.selections.includes(choice.id)) {
              //       props.selections = props.selections.filter(
              //         (selectionId) => selectionId !== choice.id
              //       )
              //     } else {
              //       props.selections.push(choice.id)
              //     }
              //     return props
              //   }, 200)
              // } else {
              //   setProp((props) => {
              //     props.selections = selections.includes(choice.id)
              //       ? []
              //       : [choice.id]
              //     return props
              //   }, 200)
              // }
              // }}
            />
          </div>
          <ul
            className={cn(
              "flex w-full flex-wrap justify-center  gap-[10px]",
              {}
            )}
            style={{
              fontFamily: `var(${fontFamily?.value})`,
            }}
          >
            {choices.map((choice, index) => (
              <PictureChoiceItem
                preset={preset}
                buttonAction={choice.buttonAction}
                isRequired={false}
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
                forGen={false}
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
  forGen,
  isRequired,
  buttonAction,
  selections,
  preset,
}) => {
  const [choiceValue, setChoiceValue] = useState(choice.value)
  const [isEditing, setIsEditing] = useState(false)

  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const isMobileScreen = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    setChoiceValue(choice.value)
  }, [choice.value])

  const getFlexBasis = (n) => {
    // for only desktop
    if (size === PictureChoiceSizes.small) {
      return 50
    }
    if (n === 1) {
      return 100
    }
    if ((mobileScreen && !forGen) || isMobileScreen) {
      // if (n % 3 === 0) {
      //   return 33.33
      // } else {
      return 50
      // }
    }

    if (n === 7 || n == 11) {
      return 25
    }
    if (n === 2) {
      return 50
    }

    // if ((n - 3) % 2 === 0) {
    //   return 33.33
    // }

    if (n % 3 == 1 || n % 4 == 0) {
      return 25
    }

    if (n % 3 == 0 || n % 3 == 2) {
      return 33.33
    }

    // if (size === PictureChoiceSizes.small) {
    //   return 50
    // }
    // if (n === 1) {
    //   return 100
    // }
    // if (n === 7 || n == 11) {
    //   return 25
    // }
    // if (n === 2) {
    //   return 50
    // }
    // if (n % 3 === 0 && !mobileScreen) {
    //   return 25
    // }
    // // in case check for responsive flex basis
    // if (n % 2 == 0) {
    //   return 50
    // }
    // if ((n - 4) % 2 === 0 && n !== 6) {
    //   if (!mobileScreen && size == PictureChoiceSizes.medium) {
    //     return 33.33
    //   }
    //   return 25
    // }
    // if ((n - 3) % 2 === 0) {
    //   return 33.33
    // }
    // if (n % 3 === 0) {
    //   return 33.33
    // }
  }

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
  const alarm = useAppSelector(
    (state) =>
      state.screen?.screens[state.screen.selectedScreen]?.alarm || false
  )
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams || undefined)
    if (term) {
      params.set("screen", term)
    }
    console.log("new path", `${pathname}?${params.toString()}`)
    router.push(`${pathname}?${params.toString()}`)
    // if(screenValidated){
    //   console.log("SCREEN NOT VALIDATED BUT YES",screenValidated)
    //   router.push(`${pathName}#${nextScreen?.screenName}`);
    //   dispatch(setCurrentScreenName(nextScreen?.screenName));
    // }else{
    //   console.log("SCREEN NOT VALIDATED", screenValidated)
    // }
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
          "navigating pc if.....",
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
          "navigating pc else.....",
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
        dispatch(getAllFilledAnswers(true))
        handleSearch(newsc)
        const index = sc.findIndex((screen) => screen.screenName === newsc) || 0
        dispatch(setSelectedScreen(index))
      }
    }
  }
  return (
    <li
      className={cn(`picture-item grow-1 flex max-w-[193px] justify-center`)}
      style={{
        flexBasis: `calc(${getFlexBasis(choicesLength)}% - 10px)`,
      }}
      onClick={() => {
        if (forGen) {
          handleNavigateToContent()
        }
      }}
    >
      <StyledPictureChoiceItem
        isSelected={isSelected}
        pictureType={choice.pictureType}
        defaultStyles={isSelected ? selectedStyles : defaultStyles}
        hoverStyles={isSelected ? selectedStyles : hoverStyles}
        onClick={isEditing ? null : onSelectChange}
        preset={preset}
        // className={`${
        //   alarm && isRequired && selections?.length === 0 && "shake"
        // }`}
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
                choice.pictureType !== PictureTypes.IMAGE ? "17.5% 0 2.5%" : "",
            }}
          >
            {choice.pictureType === PictureTypes.ICON ? (
              <SvgRenderer
                iconName={choice.picture}
                width="50px"
                height="50px"
              />
            ) : choice.pictureType === PictureTypes.EMOJI ? (
              <span className="flex size-[50px] items-center justify-center text-[48px] leading-[50px]">
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
                  className="h-auto max-h-[100px] w-[100vw] overflow-hidden rounded-t-[13px] object-cover"
                  loading="lazy"
                />
              </picture>
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
                onBlur={() => setIsEditing(false)}
              />
            </>
          )}
        </div>
      </StyledPictureChoiceItem>
    </li>
  )
}

type StyledPictureChoiceItemProps = {
  isSelected: boolean
  pictureType: PictureTypes
  preset: string
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
  transform: translateY(
    ${({ isSelected, preset }) =>
      isSelected ? (preset === PictureChoicePresets.prefilled ? -4 : -2) : 0}px
  );
  box-shadow: ${({ isSelected, preset }) =>
    isSelected
      ? preset === PictureChoicePresets.prefilled
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "none"
      : "none"};

  border: ${({ defaultStyles, preset }) =>
    preset !== PictureChoicePresets.prefilled
      ? `2px solid ${defaultStyles.borderColor}`
      : ""};
  color: ${({ defaultStyles }) => defaultStyles.textColor};
  background-color: ${({ defaultStyles }) => defaultStyles.backgroundColor};
  &:hover {
    transform: ${({ preset }) =>
      preset === PictureChoicePresets.prefilled
        ? "translateY(-4px)"
        : "translateY(-2px)"};
    border-color: ${({ hoverStyles, preset }) =>
      preset === PictureChoicePresets.prefilled && hoverStyles.borderColor};
    color: ${({ hoverStyles }) => hoverStyles.textColor};
    background-color: ${({ hoverStyles }) => hoverStyles.backgroundColor};
    box-shadow: ${({ preset }) =>
      preset === PictureChoicePresets.prefilled
        ? "0 2px 4px rgba(0, 0, 0, 0.1)" // Bottom shadow with smaller left/right shadows
        : "none"};
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

    width: calc(100%);
  }

  &:hover > div:last-child {
    width: calc(100%);

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
  prefilled = "prefilled",
}

export type PictureChoiceProps = {
  fontFamily: StyleProperty
  size: PictureChoiceSizes
  label: string
  required: boolean
  fieldName: string
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
    picture: ImagePictureTypes | string | null | object
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
  preset: PictureChoicePresets.prefilled,
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

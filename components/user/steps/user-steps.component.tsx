import React, { useCallback, useEffect, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { StepsSettings } from "./user-steps.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
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
import { Check } from "lucide-react"
import icons from "@/constant/streamline.json"

const StepsSizeValues = {
  small: "400px",
  medium: "800px",
  large: "1200px",
  full: "100%",
}

export const StepsGen = ({
  fontFamily,
  size,
  selectedColor,
  disabledColor,
  containerBackground,
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
  style,
  currentStep,
  steps,
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
        className="flex w-full flex-wrap justify-center gap-y-2"
        style={{
          fontFamily: `var(${fontFamily})`,
          maxWidth: StepsSizeValues[size || "medium"],
        }}
      >
        {steps.map((step, index) => (
          <StepItem
            disabled={true}
            key={index}
            isFirstStep={index === 0}
            isLastStep={index === steps.length - 1}
            isPastStep={index < currentStep}
            isPresentStep={index === currentStep}
            isFutureStep={index > currentStep}
            selectedColor={selectedColor}
            disabledColor={disabledColor}
            style={style}
            step={step}
            index={index}
          />
        ))}
      </ul>
    </div>
  )
}

export const Steps = ({
  fontFamily,
  size,
  selectedColor,
  disabledColor,
  containerBackground,
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
  style,
  currentStep,
  steps,
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

  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )

  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
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
    setProp((props) => (props.selectedColor = primaryColor || "#3182ce"), 200)
  }, [primaryColor])

  useEffect(() => {
    setProp((props) => (props.fontFamily = primaryFont || "inherit"), 200)
  }, [primaryFont])

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
      {hover && <Controller nameOfComponent={t("Steps")} />}
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
          className="flex w-full flex-wrap justify-center gap-y-2"
          style={{
            fontFamily: `var(${fontFamily})`,
            maxWidth: StepsSizeValues[size || "medium"],
          }}
        >
          {steps.map((step, index) => (
            <StepItem
              key={index}
              isFirstStep={index === 0}
              isLastStep={index === steps.length - 1}
              isPastStep={index < currentStep}
              isPresentStep={index === currentStep}
              isFutureStep={index > currentStep}
              selectedColor={selectedColor}
              disabledColor={disabledColor}
              style={style}
              step={step}
              index={index}
              onTextChange={(updatedText) =>
                setProp((prop) => {
                  prop.steps[index].text = updatedText
                }, 200)
              }
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const StepItem = ({
  disabled = false,
  isFirstStep,
  isLastStep,
  isPastStep,
  isPresentStep,
  isFutureStep,
  selectedColor,
  disabledColor,
  style,
  step,
  index,
  onTextChange = () => {},
}: {
  disabled?: boolean
  isFirstStep: boolean
  isLastStep: boolean
  isPastStep: boolean
  isPresentStep: boolean
  isFutureStep: boolean
  selectedColor: string
  disabledColor: string
  style: StepsStyles
  step: {
    id: string
    picture: object | string | null
    pictureType: PictureTypes
    text: string
  }
  index: number
  onTextChange?: (updatedText: string) => void
}) => {
  const [textValue, setTextValue] = useState(step.text)

  useEffect(() => {
    setTextValue(step.text)
  }, [step.text])

  return (
    <StyledStepsItem
      isPastStep={isPastStep}
      isPresentStep={isPresentStep}
      isFutureStep={isFutureStep}
      selectedColor={selectedColor}
      disabledColor={disabledColor}
    >
      <div className="icon-wrapper">
        <div className="flex flex-1 items-center">
          {!isFirstStep && <hr className="w-full" />}
        </div>
        {step.pictureType === PictureTypes.NULL ? (
          <>
            {style === StepsStyles.number ? (
              <div className="step-text-icon flex size-7 items-center justify-center text-lg">
                {index + 1}
              </div>
            ) : (
              <>
                {isPastStep && (
                  <div className="step-past-icon flex size-7 items-center justify-center rounded-full">
                    <SvgRenderer
                      iconName="check-solid"
                      width="18"
                      height="18"
                    />
                  </div>
                )}
                {isPresentStep && (
                  <RadioGroup
                    className="step-present-icon [&>button>span>svg]:size-5 [&>button]:size-7"
                    value="check"
                  >
                    <RadioGroupItem value="check" />
                  </RadioGroup>
                )}
                {isFutureStep && (
                  <RadioGroup
                    className="step-future-icon -translate-x-[1px] [&>button>span>svg]:size-5 [&>button]:h-7 [&>button]:w-5 [&>button]:border-none"
                    value="check"
                  >
                    <RadioGroupItem value="check" />
                  </RadioGroup>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {step.pictureType === PictureTypes.ICON ? (
              <div className="step-picture-icon">
                <SvgRenderer
                  iconName={step.picture as string}
                  // viewBox="-0.3 0 14.5 14"
                  width="28px"
                  height="28px"
                />
              </div>
            ) : step.pictureType === PictureTypes.EMOJI ? (
              <div className="step-picture-emoji flex size-7 items-center justify-center">
                <span className="translate-y-[1px] text-[26px]">
                  {step.picture as string}
                </span>
              </div>
            ) : (
              <picture key={(step.picture as ImagePictureTypes).desktop}>
                <source
                  media="(min-width:560px)"
                  srcSet={(step.picture as ImagePictureTypes).mobile}
                />
                <img
                  src={(step.picture as ImagePictureTypes).desktop}
                  className="step-picture-image size-7 object-contain"
                  loading="lazy"
                />
              </picture>
            )}
          </>
        )}

        <div className="flex flex-1 items-center">
          {!isLastStep && <hr className="w-full" />}
        </div>
      </div>
      <div className="w-full max-w-[200px]">
        {/** @ts-ignore */}
        <ContentEditable
          className="text-enter w-full text-center text-lg"
          disabled={disabled}
          html={textValue}
          onChange={(e) => {
            setTextValue(e.target.value)
            onTextChange(e.target.value)
          }}
        />
      </div>
    </StyledStepsItem>
  )
}

type StyledStepItemProps = {
  isPastStep: boolean
  isPresentStep: boolean
  isFutureStep: boolean
  selectedColor: string
  disabledColor: string
}

const StyledStepsItem = styled.div<StyledStepItemProps>`
  min-width: 100px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > .icon-wrapper {
    width: 100%;
    display: flex;
  }

  & > .icon-wrapper > div:first-child,
  & > .icon-wrapper > div:last-child {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > .icon-wrapper > div:first-child > hr {
    border-color: ${({
      isPastStep,
      isPresentStep,
      selectedColor,
      disabledColor,
    }) => (isPastStep || isPresentStep ? selectedColor : disabledColor)};
  }

  & > .icon-wrapper > div:last-child > hr {
    border-color: ${({ isPastStep, selectedColor, disabledColor }) =>
      isPastStep ? selectedColor : disabledColor};
  }

  & > .icon-wrapper > .step-text-icon {
    font-weight: 600;
    color: ${({ isFutureStep, selectedColor, disabledColor }) =>
      isFutureStep ? disabledColor : selectedColor};
  }

  & > .icon-wrapper > .step-past-icon {
    color: #ffffff;
    background-color: ${({ selectedColor }) => selectedColor};
  }

  & > .icon-wrapper > .step-present-icon > button {
    color: ${({ selectedColor }) => selectedColor};
    border-color: ${({ selectedColor }) => selectedColor};
  }

  & > .icon-wrapper > .step-future-icon > button {
    color: ${({ disabledColor }) => disabledColor};
  }

  & > .icon-wrapper > .step-picture-icon {
    color: ${({ isFutureStep, selectedColor, disabledColor }) =>
      isFutureStep ? disabledColor : selectedColor};
  }

  & > .icon-wrapper > .step-picture-emoji,
  & > .icon-wrapper > .step-picture-image {
    filter: ${({ isFutureStep }) =>
      isFutureStep ? "grayscale(100%)" : "none"};
  }

  & > div:last-child {
    padding: 5px 10px;
    flex: 1;
    color: ${({ isFutureStep, selectedColor, disabledColor }) =>
      isFutureStep ? disabledColor : selectedColor};
    font-weight: ${({ isPresentStep }) => (isPresentStep ? "bold" : "normal")};
  }

  & > div:last-child > div {
    outline-color: ${({ selectedColor }) => selectedColor};
  }
`

export enum StepsSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export enum StepsStyles {
  icon = "icon",
  number = "number",
}

export type StepsProps = {
  fontFamily: string
  size: StepsSizes
  selectedColor: string
  disabledColor: string
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
  style: StepsStyles
  currentStep: number
  steps: {
    id: string
    picture: ImagePictureTypes | string | null
    pictureType: PictureTypes
    text: string
  }[]
}

export const StepsDefaultProps: StepsProps = {
  fontFamily: "inherit",
  size: StepsSizes.medium,
  selectedColor: "#3182ce",
  disabledColor: "#eaeaeb",
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
  style: StepsStyles.icon,
  steps: [
    {
      id: `step-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      text: `Step 1`,
    },
    {
      id: `step-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      text: `Step 2`,
    },
    {
      id: `step-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      text: `Step 3`,
    },
  ],
  currentStep: 1,
}

Steps.craft = {
  props: StepsDefaultProps,
  related: {
    settings: StepsSettings,
  },
}

import React, { useEffect } from "react"
import styled from "styled-components"

import { useNode } from "@/lib/craftjs"
import { cn } from "@/lib/utils"

import { Controller } from "../settings/controller.component"
import { MultipleChoiceSettings } from "./user-multiple-choice-settings"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"

const MultipleChoiceItem = styled.div<{
  fontSize: string | number
  selected: boolean
  background: string
  radius: string | number
  border: string | number
  borderColor: string
  hoverBorderColor: string
  textColor: string
  hoverTextColor: string
  paddingTop: string | number
  paddingBottom: string | number
  paddingLeft: string | number
  paddingRight: string | number
  gap: string | number
  hoverBackground: string
}>`
  min-width: 100%;
  flex-basis: 100%;
  font-size: ${({ fontSize }) => `${fontSize}px`};
  background-color: ${({ background, selected, hoverBackground }) =>
    selected ? hoverBackground : background};
  border-radius: ${({ radius }) => `${radius}px`};
  border: ${({ border, borderColor, selected, hoverBorderColor }) =>
    `${border}px solid ${selected ? hoverBorderColor : borderColor}`};
  color: ${({ textColor, selected, hoverTextColor }) =>
    selected ? hoverTextColor : textColor};
  padding-top: ${({ paddingTop }) => `${paddingTop}px`};
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom}px`};
  padding-left: ${({ paddingLeft }) => `${paddingLeft}px`};
  padding-right: ${({ paddingRight }) => `${paddingRight}px`};
  gap: ${({ gap }) => `${gap}px`};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ hoverBackground }) => hoverBackground};
    border-color: ${({ hoverBorderColor }) => hoverBorderColor};
    color: ${({ hoverTextColor }) => hoverTextColor};
  }
`

export const MultipleChoiceGen = ({
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  width,
  multipleChoices,
  multipleChoiceStyles,
  singleChoice,
  lastSelectedChoice,
  ...props
}) => {
  const [singleChoiceState, setSingleChoiceState] = React.useState(singleChoice);
  const [lastSelectedChoiceState, setLastSelectedChoiceState] = React.useState(lastSelectedChoice);
  const [multipleChoicesState, setMultipleChoicesState] = React.useState(multipleChoices);

  const handleSelected = (index) => {
    if (singleChoiceState && lastSelectedChoiceState !== null) {
      setMultipleChoicesState((prev) => {
        return prev.map((item, i) => {
          if (i === lastSelectedChoiceState) {
            return {
              ...item,
              optionSelected: !item.optionSelected,
            };
          }
          return item;
        });
      });

      setMultipleChoicesState((prev) => {
        return prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              optionSelected: !item.optionSelected,
            };
          }
          return item;
        });
      });
      setLastSelectedChoiceState(index);

    } else if (singleChoiceState && lastSelectedChoiceState === null) {
      setLastSelectedChoiceState(index);
      setMultipleChoicesState((prev) => {
        return prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              optionSelected: !item.optionSelected,
            };
          }
          return item;
        });
      });
    } else {
      setMultipleChoicesState((prev) => {
        return prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              optionSelected: !item.optionSelected,
            };
          }
          return item;
        });
      });
    }
  }; // <-- This brace is added to close handleSelected function

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: background,
        borderRadius: `${radius}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        width: `${width}px`,
      }}
    >
      <div className="flex flex-col gap-2">
        {multipleChoicesState.map((option, index) => (
          <MultipleChoiceItem
            key={index}
            onClick={() => handleSelected(index)}
            {...multipleChoiceStyles}
            selected={option.optionSelected}
          >
            <input type="radio" className="hidden" />
            {option.optionLogo}
            <label className="hover:cursor-pointer">{option.optionLabel}</label>
          </MultipleChoiceItem>
        ))}
      </div>
    </div>
  );
};

const MultipleChoiceItemInner = ({
  optionLogo,
  optionLabel,
  selected,
  multipleChoiceStyles,
  index,
}) => {
  const {
    actions: { setProp },
    props: { singleChoice, lastSelectedChoice, multipleChoices },
  } = useNode((node) => ({
    props: node.data.props,
  }))
  const handleSelected = () => {
    if (singleChoice && lastSelectedChoice !== null) {
      setProp((props) => {
        //remove previous lastSelectedChoice
        props.multipleChoices[lastSelectedChoice].optionSelected = false
        //set new lastSelectedChoice
        props.lastSelectedChoice = index
        //set new optionSelected
        props.multipleChoices[index].optionSelected =
          !props.multipleChoices[index].optionSelected
      })
    } else if (singleChoice && lastSelectedChoice === null) {
      setProp((props) => {
        //set new lastSelectedChoice
        props.lastSelectedChoice = index
        //set new optionSelected
        props.multipleChoices[index].optionSelected =
          !props.multipleChoices[index].optionSelected
      })
    } else {
      setProp((props) => {
        props.multipleChoices[index].optionSelected =
          !props.multipleChoices[index].optionSelected
      })
    }
  }
  return (
    <MultipleChoiceItem
      onClick={() => handleSelected()}
      {...multipleChoiceStyles}
      selected={selected}
    >
      <input type="radio" className="hidden" />
      {optionLogo}
      <label className="hover:cursor-pointer">{optionLabel}</label>
    </MultipleChoiceItem>
  )
}

export const MultipleChoice = ({
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  background,
  radius,
  width,
  multipleChoices,
  multipleChoiceStyles,
  singleChoice,
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

  const screens = useAppSelector((state:RootState) => state?.screen?.screens);
  const screensLength = useAppSelector((state:RootState) => state?.screen?.screens?.length ?? 0);
  const selectedScreen = useAppSelector((state:RootState) => state.screen?.selectedScreen ?? 0)

  const nextScreenName = useAppSelector((state:RootState) => state?.screen?.screens[((selectedScreen+1 < screensLength) ? selectedScreen+1 : 0)]?.screenName) || "";

  useEffect(() => {
    if(singleChoice){
      multipleChoices.map((item, index) => {
        if(item.buttonAction === "next-screen"){
          setProp((props) => (props.multipleChoices[index].nextScreen = nextScreenName))
        }
      })
    }
},[nextScreenName,multipleChoices])

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: background,
        borderRadius: `${radius}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        width: `${width}px`,
      }}
      className={cn(selected && `border border-blue-400 border-dashed`)}
    >
      {isHovered && <Controller nameOfComponent={"Multiple Choices"} />}
      <div className="flex flex-col gap-2">
        {multipleChoices.map((option, index) => (
          <MultipleChoiceItemInner
            key={index}
            index={index}
            multipleChoiceStyles={multipleChoiceStyles}
            optionLogo={option.optionLogo}
            selected={option.optionSelected}
            optionLabel={option.optionLabel}
          />
        ))}
      </div>
    </div>
  )
}

export type MultipleChoiceProps = {
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  background: string
  radius: string | number
  width: number
  viewWithIcon: boolean
  singleChoice: boolean
  lastSelectedChoice: string | null
  choicesMade: string[]
  multipleChoiceStyles: {
    fontSize: string | number
    background: string
    hoverBackground: string
    radius: string | number
    border: string | number
    borderColor: string
    hoverBorderColor: string
    textColor: string
    fontWeight: string
    hoverTextColor: string
    paddingTop: string | number
    paddingBottom: string | number
    paddingLeft: string | number
    paddingRight: string | number
    gap: string | number
  }
  multipleChoices: {
    id: string | number
    optionLogo: string | null
    optionLabel: string
    optionValue: string
    optionSelected: boolean
    buttonAction: "next-screen" | "custom-action" | "none",
    nextScreen: string
  }[]
}

export const MultipleChoiceDefaultProps: MultipleChoiceProps = {
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  background: "#ffffff",
  radius: 0,
  width: 360,
  lastSelectedChoice: null,
  singleChoice: true,
  viewWithIcon: true,
  choicesMade: [],
  multipleChoiceStyles: {
    fontSize: 18,
    background: "#ffffff",
    hoverBackground: "#4050ff",
    radius: 8,
    fontWeight: "700",
    border: 2,
    borderColor: "#eaeaeb",
    hoverBorderColor: "#4050ff",
    textColor: "#000000",
    hoverTextColor: "#ffffff",
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
  },
  multipleChoices: [
    {
      id: "1",
      optionLogo: null,
      optionLabel: "Option 1",
      optionValue: "option1",
      optionSelected: false,
      buttonAction: "next-screen",
      nextScreen: ""
    },
    {
      id: "2",
      optionLogo: null,
      optionLabel: "Option 2",
      optionValue: "option2",
      optionSelected: false,
      buttonAction: "next-screen",
      nextScreen: ""
    },
    {
      id: "3",
      optionLogo: null,
      optionLabel: "Option 3",
      optionValue: "option3",
      optionSelected: false,
      buttonAction: "next-screen",
      nextScreen: ""
    },
    {
      id: "4",
      optionLogo: null,
      optionLabel: "Option 4",
      optionValue: "option4",
      optionSelected: false,
      buttonAction: "next-screen",
      nextScreen: ""
    },
  ],
}

MultipleChoice.craft = {
  props: MultipleChoiceDefaultProps,
  related: {
    settings: MultipleChoiceSettings,
  },
}

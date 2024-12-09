'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useNode } from '@/lib/craftjs'
import { Controller } from '../settings/controller.component'
import { FAQSettings } from './user-faq.settings'
import { useAppSelector } from '@/lib/state/flows-state/hooks'
import { useTranslations } from 'next-intl'
import styled from 'styled-components'
import { ChevronDown, ChevronUp, CloudCog, Plus } from 'lucide-react'
import ContentEditable from "react-contenteditable"
import { debounce } from 'lodash'
import { UserInputSizes } from '../input/user-input.component'
import { borderWidth } from 'polished'
import { IconType } from './useFaqThemePresets'
import { TextEditor } from '@/components/TextEditor'
import { getComputedValueForTextEditor,serialize , deserialize, getTextContentOfEditor} from '@/lib/utils'

export enum FAQSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

const FAQSizeValues = {
  small: "400px",
  medium: "800px",
  large: "1200px",
  full: "100%",
}

export enum FAQItemIcons {
  chevron = "chevron",
  cross = "cross"
}

export const FAQGen = ({
  titleFontFamily,
  contentFontFamily,
  size,
  questionFontSize,
  answerFontSize,
  questionLineHeight,
  answerLineHeight,
  textAlign,
  verticalGap,
  titleColor,
  contentColor,
  containerBackground,
  marginLeft,
  backgroundColor,
  blockColor,
  marginTop,
  marginRight,
  fullWidth,
  marginBottom,
  borderRadius,
  borderWidth,
  iconType,
  items,
  paddingValueBlocked = 20,
  paddingValueNonBlocked = 16,
  ...props
}) => {
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )

  const len = items.length

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
      <StyledFAQContainer
        className="faq-component"
        containerBackground={containerBackground}
        marginLeft={marginLeft}
        marginTop={marginTop}
        verticalGap={verticalGap}
        marginRight={marginRight}
        marginBottom={marginBottom}
        isPreviewScreen={true}
        size={size}
        mobileScreen={false}
        maxWidth={FAQSizeValues[size || "medium"]}
      >
        {items.map((item, index) => (
          <FAQItem
            backgroundColor={blockColor}
            key={index}
            iconType={iconType}
            titleFontFamily={titleFontFamily}
            contentFontFamily={contentFontFamily}
            textAlign={textAlign}
            borderRadius={borderRadius}
            borderWidth={borderWidth}
            titleColor={titleColor || primaryTextColor}
            answerFontSize={answerFontSize}
            answerLineHeight={answerLineHeight}
            questionFontSize={questionFontSize}
            questionLineHeight={questionLineHeight}
            contentColor={contentColor || secondaryTextColor}
            paddingValueBlocked={paddingValueBlocked}
            paddingValueNonBlocked={paddingValueNonBlocked}
            item={item}
            hideBorder={index === (len - 1)}
            disabled={true}
          />
        ))}
      </StyledFAQContainer>
    </div>

  )
}

export const FAQ = ({
  titleFontFamily,
  contentFontFamily,
  size,
  textAlign,
  verticalGap,
  titleColor,
  contentColor,
  blockColor,
  containerBackground,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom, borderRadius,
  iconType,
  fullWidth = true,
  items,
  borderWidth,
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
  const t = useTranslations('Components')

  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const secondaryFont = useAppSelector(
    (state) => state.theme?.text?.secondaryFont
  )
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  useEffect(() => {
    setProp((props) => (props.titleFontFamily = primaryFont), 200)
  }, [primaryFont])

  useEffect(() => {
    setProp((props) => (props.contentFontFamily = secondaryFont), 200)
  }, [secondaryFont])

  useEffect(() => {
    setProp((props) => (props.titleColor = primaryTextColor), 200)
  }, [primaryTextColor])

  useEffect(() => {
    setProp((props) => (props.contentColor = secondaryTextColor), 200)
  }, [secondaryTextColor])


  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }),
    [setProp]
  )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const length = items.length
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      className="w-full"
      style={{
        width: "100%",
        minWidth: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      {hover && <Controller nameOfComponent={t('FAQ')} />}
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
        <StyledFAQContainer
          className="faq-component w-full"
          size={size}
          isPreviewScreen={false}
          containerBackground={containerBackground}
          marginLeft={marginLeft}
          marginTop={marginTop}
          marginRight={marginRight}
          marginBottom={marginBottom}
          verticalGap={verticalGap}
          mobileScreen={!!mobileScreen}
          maxWidth={FAQSizeValues[size || "medium"]}
        >
          {items.map((item, index) => (
            <FAQItem
              key={index}
              borderRadius={borderRadius}
              borderWidth={borderWidth}
              iconType={iconType}
              titleFontFamily={titleFontFamily || primaryFont}
              contentFontFamily={contentFontFamily || secondaryFont}
              textAlign={textAlign}
              titleColor={titleColor || primaryTextColor}
              contentColor={contentColor || secondaryTextColor}
              backgroundColor={blockColor}
              item={item}
              hideBorder={index === (length - 1)}
              onQuestionChange={(updatedQuestion) => {
                setProp((prop) => {
                  prop.items[index].question = updatedQuestion
                }, 200)
              }}
              onAnswerChange={(updatedAnswer) => {
                setProp((prop) => {
                  prop.items[index].answer = updatedAnswer
                }, 200)
              }}
            />
          ))}
        </StyledFAQContainer>
      </div>
    </div>
  )
}

const FAQItem = ({
  titleFontFamily,
  contentFontFamily,
  backgroundColor,
  textAlign,
  titleColor,
  contentColor,
  item,
  borderRadius,
  iconType,
  borderWidth,
  disabled = false,
  hideBorder = false,
  questionFontSize = 20,
  answerFontSize = 14,
  questionLineHeight = 28,
  answerLineHeight = 21,
  paddingValueBlocked = 20,
  paddingValueNonBlocked = 16,
  onQuestionChange = (updatedQuestion: string) => { },
  onAnswerChange = (updatedAnswer: string) => { },
}) => {
  const [isOpen, setIsOpen] = useState(item.defaultOpen ?? false)
  const [questionValue, setQuestionValue] = useState(item.question)
  const [answerValue, setAnswerValue] = useState(item.answer)
  const [answerHeight, setAnswerHeight] = useState(0)
  const answerRef = useRef<null | HTMLDivElement>(null)
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const paddingValues = borderWidth === 0 ? `${paddingValueBlocked}px` : `${paddingValueNonBlocked}px 0`

  useEffect(() => {
    if (answerRef.current) {
      setAnswerHeight(answerRef.current.scrollHeight)
    }
  }, [answerValue, contentFontFamily, mobileScreen])

  useEffect(() => {
    setQuestionValue(item.question)
  }, [item.question])

  useEffect(() => {
    setAnswerValue(item.answer)
  }, [item.answer])

  const DropdownIcon = iconType === IconType.plus ? <Plus size={24} /> : <ChevronDown size={24} />
  return (
    <StyledFAQItem
      titleFontFamily={titleFontFamily}
      contentFontFamily={contentFontFamily}
      textAlign={textAlign}
      titleColor={titleColor}
      contentColor={contentColor}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      hideBorder={hideBorder}
      paddingValues={paddingValues}
      className='faq-item'
    >
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)} style={{ fontSize: questionFontSize, lineHeight: `${questionLineHeight}px` }}>
        <div style={{ width: "90%" }}>
          {/** @ts-ignore */}
          {/** @ts-ignore */}
          <ContentEditable
            className="question-text"
            html={questionValue}
            disabled={disabled}
            onChange={(e) => {
              setQuestionValue(e.target.value)
              onQuestionChange(e.target.value)
            }}
          />
        </div>
        <StyledIcon
          isOpen={isOpen}
          fontColor={titleColor}
          closedIconRotation={0}
          openIconRotation={iconType === IconType.plus ? 45 : 180}
        >
          {DropdownIcon}
        </StyledIcon>
      </div>
      <div
        className={`faq-answer ${isOpen ? 'open' : ''}`}
        style={{
          maxHeight: isOpen ? `${answerHeight}px` : '0px',
          fontSize: answerFontSize, lineHeight: `${answerLineHeight}px`,
        }}
      >
        <div style={{ width: "90%" }}>
          <div ref={answerRef}>
            {/** @ts-ignore */}
            {/** @ts-ignore */}
            <TextEditor
            isReadOnly={disabled}
            initValue={getComputedValueForTextEditor(answerValue)}
            onChange={(val) => {
              setAnswerValue(val)
              onAnswerChange((val))
            }}
          />
          </div>
        </div>
      </div>
    </StyledFAQItem>
  )
}

type StyledListContainerProps = {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  containerBackground: string
  size: UserInputSizes
  isPreviewScreen: boolean
  mobileScreen: boolean
  maxWidth: string
  verticalGap: number
}

const StyledFAQContainer = styled.div<StyledListContainerProps>`
  width: 100%;
margin: ${({ marginTop, marginRight, marginBottom, marginLeft }) =>
    `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`};
  background-color: ${({ containerBackground }) => containerBackground};
  display: flex;
  flex-direction: column;
  gap:${({ verticalGap }) => `${verticalGap}px`};

  margin-left: auto;
  margin-right: auto;
  & > .faq-item:last-child {
  margin-bottom: 0;
  }

  ${({ size, mobileScreen, isPreviewScreen }) => {
    if (isPreviewScreen) {
      if (size === UserInputSizes.small) {
        if (mobileScreen) {
          return { width: "360px" }
        } else {
          return { width: "376px" }
        }
      } else if (size === UserInputSizes.medium) {
        return { width: "calc(100% - 22px)", maxWidth: 800 }
      } else if (size === UserInputSizes.large) {
        return { width: "calc(100% - 22px)", maxWidth: 1000 }
      } else {
        return {
          width: "calc(100% - 22px)",
        }
      }
    } else {
      if (size === UserInputSizes.small) {
        if (mobileScreen) {
          return { width: "360px" }
        } else {
          return { width: "376px" }
        }
      } else if (size === UserInputSizes.medium) {
        return { width: "calc(100% - 22px)", maxWidth: 800 }
      } else if (size === UserInputSizes.large) {
        return { width: "calc(100% - 22px)", maxWidth: 1000 }
      } else {
        return {
          width: "calc(100% - 22px)",
        }
      }
    }
  }};

@media (max-width: 1000px) {
  ${({ size }) => {
    if (size === UserInputSizes.large) {
      return { width: "calc(100% - 22px)" }
    }
  }}
}

@media (max-width: 800px) {
  ${({ size }) => {
    if (size === UserInputSizes.medium) {
      return { width: "calc(100% - 22px)" }
    }
  }}
}

@media (max-width: 376px) {
  ${({ size }) => {
    if (size === UserInputSizes.small) {
      return { width: "calc(100% - 22px)" }
    }
  }}
}
`

type StyledFAQItemProps = {
  titleFontFamily: string
  contentFontFamily: string
  textAlign: string
  titleColor: string
  contentColor: string
  backgroundColor: string,
  borderRadius: number
  borderWidth: number
  hideBorder?: boolean
  paddingValues: string
}

const StyledFAQItem = styled.div<StyledFAQItemProps>`
  width: 100%;
  border-bottom: ${({ borderWidth, hideBorder }) => hideBorder ? '0' : borderWidth}px solid #E6E2DD;
  border-radius:${({ borderRadius }) => borderRadius}px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding: ${({ paddingValues }) => paddingValues};
  

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    
    .question-text {
      font-family: var(${({ titleFontFamily }) => titleFontFamily});
      color: ${({ titleColor }) => titleColor};
      font-weight: 500;
      text-align: ${({ textAlign }) => textAlign};
    }
  }
  
  .faq-answer {
    overflow: hidden;
    margin-top: 0.5rem;
    transition: max-height 0.3s ease-out;
    .answer-text {
      font-family: var(${({ contentFontFamily }) => contentFontFamily});
      color: ${({ contentColor }) => contentColor};
      text-align: ${({ textAlign }) => textAlign};
      word-wrap: break-word;
      overflow-wrap: break-word;
      font-weight: 400;
    }
  }
`

const StyledIcon = styled.div<{ isOpen: boolean; closedIconRotation: number; openIconRotation: number, fontColor: string }>`
  transition: transform 0.3s ease;
  color: ${({ fontColor }) => fontColor};
  transform: rotate(${({ isOpen, closedIconRotation, openIconRotation }) =>
    isOpen ? `${openIconRotation}deg` : `${closedIconRotation}deg`
  });
`

export const FAQDefaultProps = {
  titleFontFamily: 'inherit',
  contentFontFamily: 'inherit',
  size: 'medium',
  textAlign: 'left',
  verticalGap: 10,
  titleColor: '#000000',
  contentColor: '#333333',
  containerBackground: 'transparent',
  marginLeft: 0,
  marginTop: 20,
  marginRight: 0,
  fullWdth: true,
  marginBottom: 20,
  items: [
    {
      question: 'What is React?',
      answer: 'React is a JavaScript library for building user interfaces.',
    },
    {
      question: 'Why use React?',
      answer: 'React allows you to build reusable UI components and manage state efficiently.',
    },
  ],
}

FAQ.craft = {
  props: FAQDefaultProps,
  related: {
    settings: FAQSettings,
  },
}
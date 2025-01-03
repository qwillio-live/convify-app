"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { ListSettings } from "./user-list.settings"
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
import { UserInputSizes } from "../input/user-input.component"
import { usePathname } from "next/navigation"
import { getComputedValueForTextEditor, serialize } from "@/lib/utils"
import { TextEditor } from "@/components/TextEditor"

const getDefaultContent = (content) => {
  return serialize([
    {
      type: "paragraph",
      children: [{ text: content }],
    },
  ])
}

const ListSizeValues = {
  small: "400px",
  medium: "800px",
  large: "1200px",
  full: "100%",
}

export const ListGen = ({
  titleFontFamily,
  descriptionFontFamily,
  size,
  textAlign,
  verticalGap,
  iconColor,
  titleColor,
  descriptionColor,
  containerBackground,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  columnsMobile,
  columnsDesktop,
  flexDirection,
  fullWidth,
  settingTabs,
  preset,
  items,
  textColor,
  secTextColor,
  toolbarPreview = false,
  ...props
}) => {
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const pathname = usePathname()
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
      <StyledListContainer
        isPreviewScreen={pathname?.includes("create-flow") ? false : true}
        className="user-list-comp"
        size={size}
        verticalGap={verticalGap}
        columnsDesktop={columnsDesktop}
        columnsMobile={columnsMobile}
        mobileScreen={false}
        maxWidth={ListSizeValues[size || "medium"]}
        toolbarPreview={toolbarPreview}
      >
        {items.map((item, index) => (
          <ListItem
            key={`${item.id}-${index}`}
            disabled={true}
            titleFontFamily={titleFontFamily}
            descriptionFontFamily={descriptionFontFamily}
            iconColor={iconColor}
            textAlign={textAlign}
            titleColor={textColor !== "#ffffff" ? textColor : primaryTextColor}
            descriptionColor={
              secTextColor !== "#ffffff" ? secTextColor : secondaryTextColor
            }
            flexDirection={flexDirection}
            item={item}
          />
        ))}
      </StyledListContainer>
    </div>
  )
}

export const List = ({
  titleFontFamily,
  descriptionFontFamily,
  size,
  textAlign,
  verticalGap,
  iconColor,
  titleColor,
  descriptionColor,
  containerBackground,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  columnsMobile,
  columnsDesktop,
  flexDirection,
  fullWidth,
  settingTabs,
  preset,
  items,
  textColor,
  secTextColor,
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
    setProp((props) => (props.titleFontFamily = primaryFont), 200)
  }, [primaryFont])

  useEffect(() => {
    setProp((props) => (props.descriptionFontFamily = secondaryFont), 200)
  }, [secondaryFont])

  useEffect(() => {
    setProp((props) => (props.iconColor = primaryColor || "#3182ce"), 200)
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
      {hover && <Controller nameOfComponent={t("List")} />}
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
        <StyledListContainer
          isPreviewScreen={false}
          className="user-list-comp"
          size={size}
          verticalGap={verticalGap}
          columnsDesktop={columnsDesktop}
          columnsMobile={columnsMobile}
          mobileScreen={mobileScreen ?? false}
          maxWidth={ListSizeValues[size || "medium"]}
        >
          {items.map((item, index) => (
            <ListItem
              key={`${item.id}-${index}`}
              titleFontFamily={titleFontFamily}
              descriptionFontFamily={descriptionFontFamily}
              iconColor={iconColor}
              textAlign={textAlign}
              titleColor={
                textColor !== "#ffffff" ? textColor : primaryTextColor
              }
              descriptionColor={
                secTextColor !== "#ffffff" ? secTextColor : secondaryTextColor
              }
              flexDirection={flexDirection}
              item={item}
              onTitleChange={(updatedTitle) => {
                setProp((prop) => {
                  prop.items[index].title = updatedTitle
                }, 200)
              }}
              onDescriptionChange={(updatedDescription) => {
                setProp((prop) => {
                  prop.items[index].description = updatedDescription
                }, 200)
              }}
            />
          ))}
        </StyledListContainer>
      </div>
    </div>
  )
}

const ListItem = ({
  disabled = false,
  titleFontFamily,
  descriptionFontFamily,
  iconColor,
  textAlign,
  titleColor,
  descriptionColor,
  flexDirection,
  item,
  onTitleChange = () => {},
  onDescriptionChange = () => {},
}: {
  disabled?: boolean
  titleFontFamily: string
  descriptionFontFamily: string
  iconColor: string
  textAlign: string
  titleColor: string
  descriptionColor: string
  flexDirection: string

  item: {
    id: string
    picture: ImagePictureTypes | string | null
    pictureType: PictureTypes
    title: string
    description: string
  }
  onTitleChange?: (updatedTitle: string) => void
  onDescriptionChange?: (updatedDescription: string) => void
}) => {
  const [titleValue, setTitleValue] = useState(item.title)
  const [descriptionValue, setDescriptionValue] = useState(item.description)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setTitleValue(item.title)
  }, [item.title])

  useEffect(() => {
    setDescriptionValue(item.description)
  }, [item.description])

  return (
    <StyledListItem
      titleFontFamily={titleFontFamily}
      descriptionFontFamily={descriptionFontFamily}
      iconColor={iconColor}
      textAlign={textAlign}
      titleColor={titleColor}
      descriptionColor={descriptionColor}
      flexDirection={flexDirection}
    >
      <div>
        {item.pictureType !== PictureTypes.NULL &&
          (item.pictureType === PictureTypes.ICON ? (
            <SvgRenderer
              iconName={item.picture as string}
              // viewBox="-0.3 0 14.5 14"
              width="40px"
              height="40px"
            />
          ) : item.pictureType === PictureTypes.EMOJI ? (
            <span className="flex size-10 items-center justify-center text-[38px] leading-[40px]">
              {item.picture as string}
            </span>
          ) : (
            <picture key={(item.picture as ImagePictureTypes).desktop}>
              <source
                media="(min-width:560px)"
                srcSet={(item.picture as ImagePictureTypes).mobile}
              />
              <img
                src={(item.picture as ImagePictureTypes).desktop}
                className="size-10 object-contain"
                loading="lazy"
              />
            </picture>
          ))}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div
          className="w-fit max-w-full whitespace-break-spaces px-1 font-bold"
          style={{ wordBreak: "break-word" }}
        >
          <TextEditor
            isReadOnly={disabled}
            initValue={getComputedValueForTextEditor(titleValue)}
            onChange={(val) => {
              const serialized = serialize(val)
              setTitleValue(serialized)
              onTitleChange(serialized)
            }}
          />
        </div>
        <div
          className="w-fit max-w-full gap-x-0 whitespace-break-spaces px-1 text-sm"
          style={{ wordBreak: "break-word" }}
        >
          <TextEditor
            isReadOnly={disabled}
            initValue={getComputedValueForTextEditor(descriptionValue)}
            onChange={(val) => {
              const serialized = serialize(val)
              setDescriptionValue(serialized)
              onDescriptionChange(serialized)
            }}
          />
        </div>
      </div>
    </StyledListItem>
  )
}

type StyledListContainerProps = {
  verticalGap: number
  columnsDesktop: number
  columnsMobile: number
  mobileScreen: boolean
  maxWidth: string
  size: UserInputSizes
  isPreviewScreen: boolean
  toolbarPreview?: boolean
}

const StyledListContainer = styled.ul<StyledListContainerProps>`
  display: grid;
  column-gap: 40px;
  row-gap: ${({ verticalGap }) => `${verticalGap}px`};
  grid-template-columns: repeat(
    ${({ columnsDesktop, columnsMobile, mobileScreen }) =>
      mobileScreen ? columnsMobile : columnsDesktop},
    minmax(0, 1fr)
  );

  @media (max-width: 560px) {
    grid-template-columns: repeat(
      ${({ columnsMobile }) => columnsMobile},
      minmax(0, 1fr)
    );
  }

  margin-left: auto;
  margin-right: auto;

  ${({ size, mobileScreen, isPreviewScreen, toolbarPreview }) => {
    if (toolbarPreview)
      return {
        width: "calc(100% - 22px)",
      }

    if (isPreviewScreen) {
      if (size === UserInputSizes.small) {
        if (mobileScreen) {
          return { width: "360px" }
        } else {
          return { width: "auto", maxWidth: 376 }
        }
      } else if (size === UserInputSizes.medium) {
        return mobileScreen
          ? { width: "360px" }
          : { width: "auto", maxWidth: 600 }
      } else if (size === UserInputSizes.large) {
        return mobileScreen
          ? { width: "360px" }
          : { width: "auto", maxWidth: 700 }
      } else {
        return mobileScreen
          ? { width: "360px" }
          : { width: "auto", maxWidth: "calc(100% - 22px)" }
      }
    } else {
      if (size === UserInputSizes.small) {
        if (mobileScreen) {
          return { width: "360px" }
        } else {
          return { width: "auto", maxWidth: 376 }
        }
      } else if (size === UserInputSizes.medium) {
        return mobileScreen
          ? { width: "360px" }
          : { width: "auto", maxWidth: 600 }
      } else if (size === UserInputSizes.large) {
        return mobileScreen
          ? { width: "360px" }
          : { width: "auto", maxWidth: 700 }
      } else {
        return mobileScreen
          ? { width: "360px" }
          : { width: "auto", maxWidth: "calc(100% - 22px)" }
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

type StyledListItemProps = {
  titleFontFamily: string
  descriptionFontFamily: string
  iconColor: string
  textAlign: string
  titleColor: string
  descriptionColor: string
  flexDirection: string
}

const StyledListItem = styled.li<StyledListItemProps>`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-direction: ${({ flexDirection }) => flexDirection};

  & > div > svg {
    color: ${({ iconColor }) => iconColor};
  }

  & > div:last-child {
    align-items: ${({ textAlign }) => textAlign};
  }

  & > div > div:first-child {
    text-align: ${({ textAlign }) => textAlign};
    font-family: var(${({ titleFontFamily }) => titleFontFamily});
    color: ${({ titleColor }) => titleColor};
    outline-color: ${({ iconColor }) => iconColor};
  }

  & > div > div:last-child {
    text-align: ${({ textAlign }) => textAlign};
    font-family: var(${({ descriptionFontFamily }) => descriptionFontFamily});
    color: ${({ descriptionColor }) => descriptionColor};
    outline-color: ${({ iconColor }) => iconColor};
  }
`

export enum ListSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export enum ListPresets {
  vertical = "vertical",
  horizontal = "horizontal",
}

export type ListProps = {
  textColor?: string
  secTextColor?: string
  titleFontFamily: string
  descriptionFontFamily: string
  textAlign: string
  verticalGap: number
  size: ListSizes
  iconColor: string
  titleColor: string
  descriptionColor: string
  containerBackground: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  flexDirection: string
  columnsMobile: number
  columnsDesktop: number
  fullWidth: boolean
  settingTabs: string[]
  preset: ListPresets
  items: {
    id: string
    picture: ImagePictureTypes | string | null
    pictureType: PictureTypes
    title: string
    description: string
  }[]
}

export const ListDefaultProps: ListProps = {
  textColor: "#ffffff",
  secTextColor: "#ffffff",
  titleFontFamily: "inherit",
  descriptionFontFamily: "inherit",
  textAlign: "start",
  verticalGap: 20,
  size: ListSizes.medium,
  iconColor: "#3182ce",
  titleColor: "#000000",
  descriptionColor: "#5a5a5a",
  containerBackground: "transparent",
  paddingLeft: "16",
  paddingTop: "20",
  paddingRight: "16",
  paddingBottom: "20",
  marginLeft: 0,
  marginTop: 20,
  marginRight: 0,
  marginBottom: 20,
  columnsMobile: 1,
  columnsDesktop: 4,
  fullWidth: true,
  flexDirection: "row",
  settingTabs: ["content"],
  preset: ListPresets.horizontal,
  items: [
    {
      id: `list-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: getDefaultContent("Item Text 1"),
      description: getDefaultContent("ItSubtm Text 1"),
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: getDefaultContent("Item Text 2"),
      description: getDefaultContent("Item Subtext 2"),
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: getDefaultContent("Item Text 3"),
      description: getDefaultContent("Item Subtext 3"),
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: getDefaultContent("Item Text 4"),
      description: getDefaultContent("Item Subtext 4"),
    },
  ],
}

List.craft = {
  props: ListDefaultProps,
  related: {
    settings: ListSettings,
  },
}

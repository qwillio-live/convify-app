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
import { PictureTypes, SvgRenderer } from "@/components/PicturePicker"
import { debounce } from "lodash"
import ContentEditable from "react-contenteditable"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
      <StyledListContainer
        columnsDesktop={columnsDesktop}
        columnsMobile={columnsMobile}
        mobileScreen={false}
        width={textAlign === "center" ? "100%" : "fit-content"}
        maxWidth={ListSizeValues[size || "medium"]}
      >
        {items.map((item, index) => (
          <ListItem
            key={index}
            disabled={true}
            titleFontFamily={titleFontFamily}
            descriptionFontFamily={descriptionFontFamily}
            iconColor={iconColor}
            textAlign={textAlign}
            titleColor={titleColor}
            descriptionColor={descriptionColor}
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
    setProp((props) => (props.titleColor = primaryTextColor || "#000000"), 200)
  }, [primaryTextColor])

  useEffect(() => {
    setProp(
      (props) => (props.descriptionColor = secondaryTextColor || "#5a5a5a"),
      200
    )
  }, [secondaryTextColor])

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
          columnsDesktop={columnsDesktop}
          columnsMobile={columnsMobile}
          mobileScreen={mobileScreen ?? false}
          width={textAlign === "center" ? "100%" : "fit-content"}
          maxWidth={ListSizeValues[size || "medium"]}
        >
          {items.map((item, index) => (
            <ListItem
              key={index}
              titleFontFamily={titleFontFamily}
              descriptionFontFamily={descriptionFontFamily}
              iconColor={iconColor}
              textAlign={textAlign}
              titleColor={titleColor}
              descriptionColor={descriptionColor}
              flexDirection={flexDirection}
              item={item}
              onTitleChange={(updatedTitle) => {
                handlePropChangeDebounced(
                  "items",
                  items.map((item, i) =>
                    i === index ? { ...item, title: updatedTitle } : item
                  )
                )
              }}
              onDescriptionChange={(updatedDescription) => {
                handlePropChangeDebounced(
                  "items",
                  items.map((item, i) =>
                    i === index
                      ? { ...item, description: updatedDescription }
                      : item
                  )
                )
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
    picture: string | null
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
              svgData={item.picture as string}
              // viewBox="-0.3 0 14.5 14"
              width="40px"
              height="40px"
            />
          ) : item.pictureType === PictureTypes.EMOJI ? (
            <img
              src={item.picture as string}
              className="size-10 object-contain"
            />
          ) : (
            <img
              src={item.picture as string}
              className="size-10 object-contain"
            />
          ))}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <ContentEditable
          className="w-fit max-w-full whitespace-break-spaces px-1 font-bold"
          style={{ wordBreak: "break-word" }}
          disabled={disabled}
          html={titleValue}
          onChange={(e) => {
            setTitleValue(e.target.value)
            onTitleChange(e.target.value)
          }}
        />

        <ContentEditable
          className="w-fit max-w-full whitespace-break-spaces px-1 text-sm"
          style={{ wordBreak: "break-word" }}
          disabled={disabled}
          html={descriptionValue}
          onChange={(e) => {
            setDescriptionValue(e.target.value)
            onDescriptionChange(e.target.value)
          }}
        />
      </div>
    </StyledListItem>
  )
}

type StyledListContainerProps = {
  width: string
  columnsDesktop: number
  columnsMobile: number
  mobileScreen: boolean
  maxWidth: string
}

const StyledListContainer = styled.ul<StyledListContainerProps>`
  width: ${({ width }) => width};
  max-width: ${({ maxWidth }) => maxWidth};
  display: grid;
  gap: 40px;
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
  titleFontFamily: string
  descriptionFontFamily: string
  textAlign: string
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
    picture: string | null
    pictureType: PictureTypes
    title: string
    description: string
  }[]
}

export const ListDefaultProps: ListProps = {
  titleFontFamily: "inherit",
  descriptionFontFamily: "inherit",
  textAlign: "start",
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
      title: "Item Text 1",
      description: "ItSubtm Text 1",
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: "Item Text 2",
      description: "Item Subtext 2",
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: "Item Text 3",
      description: "Item Subtext 3",
    },
    {
      id: `input-${hexoid(6)()}`,
      picture: `<path fill=\"none\" stroke=\"currentColor\" strokeLinecap=\"round\" strokeLinejoin=\"round\" d=\"M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M7 4v6M4 7h6\"/>`,
      pictureType: PictureTypes.ICON,
      title: "Item Text 4",
      description: "Item Subtext 4",
    },
  ],
}

List.craft = {
  props: ListDefaultProps,
  related: {
    settings: ListSettings,
  },
}

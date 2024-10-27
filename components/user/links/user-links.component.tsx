'use client'
import { cn } from "@/lib/utils";
import { UserInputSizes } from "../input/user-input.component"
import styled from "styled-components"
import { LinksSettings } from "./user-links.settings";
import hexoid from "hexoid";
import { useNode } from "@craftjs/core";
import { useAppSelector } from "@/lib/state/flows-state/hooks";
import { useEffect, useState } from "react";
import { Controller } from "../settings/controller.component";
import ContentEditable from "react-contenteditable";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIVACY_URL, TERMS_URL } from "@/constant";
import { useTranslations } from "next-intl";

export enum LinksSizes {
    small = "small",
    medium = "medium",
    large = "large",
    full = "full",
}

const LinksSizesValues = {
    small: "400px",
    medium: "800px",
    large: "1200px",
    full: "100%",
}

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

export const LinksGen = ({
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
    links,
    tracking,
    textColor,
    showDots,
    fontSize,
    fontWeight,
    ...props
}) => {
    const pathname = usePathname()

    return (
        <div
            className="relative w-full m-choice"
            style={{
                width: "100%",
                background: `${containerBackground}`,
                display: "flex",
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
                <div className={cn("flex flex-wrap items-center justify-center")} aria-label="Horizontal navigation" style={{
                    fontFamily: `var(${fontFamily?.value})`,
                }}>
                    {links.map((link, index) => {
                        const { buttonAction, nextScreen, windowTarget, href, tracking, trackingEvent } = link;
                        return (
                            <span key={index} className="flex items-center">
                                {buttonAction === 'none'
                                    ? (
                                        <StyledLinkItem textColor={textColor} fontFamily={fontFamily?.value} fontSize={fontSize} fontWeight={fontWeight}>
                                            {link.value}
                                        </StyledLinkItem>
                                    ) : (
                                        <Link
                                            href={`${buttonAction === "redirect"
                                                ? href?.includes("https://") ||
                                                    href?.includes("http://")
                                                    ? href
                                                    : "https://" + href
                                                : pathname + "?screen=" + nextScreen?.screenName
                                                }`}
                                            target={`${windowTarget && buttonAction === "redirect" ? "_blank" : ""
                                                }`}
                                            className="contents"
                                            data-tracking={tracking}
                                            data-event-name={trackingEvent}
                                        >
                                            <StyledLinkItem textColor={textColor} fontFamily={fontFamily?.value} fontSize={fontSize} fontWeight={fontWeight}>
                                                {link.value}
                                            </StyledLinkItem>
                                        </Link>
                                    )
                                }

                                {showDots && index < links.length - 1 && (
                                    <span className="mx-2 text-muted-foreground" aria-hidden="true">
                                        &bull;
                                    </span>
                                )}
                            </span>
                        )
                    })}
                </div>
            </Wrapper>
        </div>
    )
}

export const Links = ({
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
    textColor,
    hoverStyles,
    selectedStyles,
    selections,
    links,
    tracking,
    fontSize,
    fontWeight,
    showDots,
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

    const t = useTranslations("Components")
    const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
    const [hover, setHover] = useState(false)
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
            {hover && <Controller nameOfComponent={t("Links")} />}
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
                <StylesLinksContainer className="w-full flex flex-wrap items-center justify-center"
                    isPreviewScreen={false}
                    containerBackground={containerBackground}
                    marginLeft={marginLeft}
                    marginTop={marginTop}
                    marginRight={marginRight}
                    marginBottom={marginBottom}
                    mobileScreen={!!mobileScreen}
                    maxWidth={LinksSizesValues[size || "medium"]}
                    size={size}
                    fontFamily={fontFamily?.value}
                >
                    {links.map((link, index) => {
                        const { buttonAction, nextScreen, windowTarget, href } = link;
                        return (
                            <span key={index} className="flex items-center">
                                <LinksItem key={index}
                                    link={link}
                                    className=""
                                    onValueChange={(newValue) => {
                                        setProp((props) => {
                                            props.links[index].value = newValue
                                        })
                                    }}
                                    textColor={textColor}
                                    fontFamily={fontFamily?.value}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
                                />
                                {showDots && index < links.length - 1 && (
                                    <span className="mx-2 text-muted-foreground" aria-hidden="true">
                                        &bull;
                                    </span>
                                )}
                            </span>
                        )
                    })}
                </StylesLinksContainer>
            </div>
        </div>
    )
}

const LinksItem = ({
    link,
    fontFamily,
    onValueChange,
    className,
    textColor,
    fontSize,
    fontWeight
}) => {
    const [linkValue, setLinkValue] = useState(link.value)

    useEffect(() => {
        setLinkValue(link.value)
    }, [link])

    return (
        <>
            <StyledLinkItem fontFamily={fontFamily?.value} className={className} textColor={textColor} fontSize={fontSize} fontWeight={fontWeight} >
                <ContentEditable
                    html={linkValue}
                    disabled={onValueChange === null}
                    onChange={(e) => {
                        setLinkValue(e.target.value)
                        onValueChange(e.target.value)
                    }}
                />
            </StyledLinkItem>
        </>
    )
}


type StyledLinkItemProps = {
    fontFamily: string
    textColor: string
    fontSize: string
    fontWeight: string
}


type StylesLinksContainerProps = {
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
    containerBackground: string
    size: UserInputSizes
    isPreviewScreen: boolean
    mobileScreen: boolean
    maxWidth: string
    fontFamily: string
}

const StylesLinksContainer = styled.div<StylesLinksContainerProps>`
    width: 100%;
  margin: ${({ marginTop, marginRight, marginBottom, marginLeft }) =>
        `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`};
    background-color: ${({ containerBackground }) => containerBackground};
     fontFamily: var(${({ fontFamily }) => fontFamily});
  
    ${({ size, mobileScreen, isPreviewScreen }) => {
        if (isPreviewScreen) {
            if (size === UserInputSizes.small) {
                return { width: "376px" }
            } else if (size === UserInputSizes.medium) {
                return { width: "800px" }
            } else if (size === UserInputSizes.large) {
                return { width: "1000px" }
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

const StyledLinkItem = styled.div<StyledLinkItemProps>`
    color: ${({ textColor }) => textColor};
    cursor: pointer;
    font-weight: ${({ fontWeight }) => fontWeight};
    font-size: ${({ fontSize }) => fontSize}px;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
        color: var(--color-primary-foreground);
        text-decoration: underline;
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--color-primary);
    }
`

const LinksDefaultProps = {
    fontFamily: {
        value: "inherit",
        globalStyled: true,
        isCustomized: false,
    },
    showDots: true,
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
    width: LinksSizes.medium,
    settingTabs: ["content"],
    links: [
        {
            id: `input-${hexoid(6)()}`,
            value: "Terms",
            buttonAction: "redirect",
            trackingEvent: null,
            href: TERMS_URL,
            windowTarget: true,
            tracking: false,
            nextScreen: {
                screenId: "",
                screenName: "",
            },
        },
        {
            id: `input-${hexoid(6)()}`,
            value: "Privacy",
            buttonAction: "redirect",
            trackingEvent: null,
            href: PRIVACY_URL,
            windowTarget: true,
            nextScreen: {
                screenId: "",
                screenName: "",
            },
        }
    ]
}

Links.craft = {
    props: LinksDefaultProps,
    related: {
        settings: LinksSettings,
    },
}

'use client'
import styled from "styled-components"
import { YoutubeVideoSettings } from "./user-youtube-video.settings"
import { YoutubeVideoSizes } from "./useYoutubeVideoThemePresets"
import { useNode } from "@craftjs/core"
import { useState } from "react"
import { Controller } from '../settings/controller.component'
import { useTranslations } from "next-intl"

export const YoutubeVideoGen = ({
    size,
    containerBackground,
    marginLeft,
    marginTop,
    marginRight,
    fullWidth,
    maxWidth,
    marginBottom,
    link,
    showControls,
}) => {
    return (<div
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
        <StyledYoutubeContainer
            size={size}
            containerBackground={containerBackground}
            isPreviewScreen={false}
            mobileScreen={false}
            marginBottom={marginBottom}
            marginLeft={marginLeft}
            marginRight={marginRight}
            maxWidth={maxWidth}
            marginTop={marginTop}
        >
            <YoutubeVideoFrame
                link={link}
                showControls={showControls}
            />
        </StyledYoutubeContainer>
    </div>)
}

type StyledYoutubeVideoContainerPropTypes = {
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
    containerBackground: string
    size: YoutubeVideoSizes
    isPreviewScreen: boolean
    mobileScreen: boolean
    maxWidth: string
}

const StyledYoutubeContainer = styled.div<StyledYoutubeVideoContainerPropTypes>`

width: 100%;
margin: ${({ marginTop, marginRight, marginBottom, marginLeft }) =>
        `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`};
  background-color: ${({ containerBackground }) => containerBackground};
  display: flex;

  ${({ size, mobileScreen, isPreviewScreen }) => {
        if (isPreviewScreen) {
            if (size === YoutubeVideoSizes.small) {
                if (mobileScreen) {
                    return { width: "360px" }
                } else {
                    return { width: "376px" }
                }
            } else if (size === YoutubeVideoSizes.medium) {
                return { width: "calc(100% - 22px)", maxWidth: 800 }
            } else if (size === YoutubeVideoSizes.large) {
                return { width: "calc(100% - 22px)", maxWidth: 1000 }
            } else {
                return {
                    width: "calc(100% - 22px)",
                }
            }
        } else {
            if (size === YoutubeVideoSizes.small) {
                if (mobileScreen) {
                    return { width: "360px" }
                } else {
                    return { width: "376px" }
                }
            } else if (size === YoutubeVideoSizes.medium) {
                return { width: "calc(100% - 22px)", maxWidth: 800 }
            } else if (size === YoutubeVideoSizes.large) {
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
        if (size === YoutubeVideoSizes.large) {
            return { width: "calc(100% - 22px)" }
        }
    }}
}

@media (max-width: 800px) {
  ${({ size }) => {
        if (size === YoutubeVideoSizes.medium) {
            return { width: "calc(100% - 22px)" }
        }
    }}
}

@media (max-width: 376px) {
  ${({ size }) => {
        if (size === YoutubeVideoSizes.small) {
            return { width: "calc(100% - 22px)" }
        }
    }}
}

`

export const YoutubeVideo = ({
    size,
    containerBackground,
    marginLeft,
    marginTop,
    marginRight,
    fullWidth,
    maxWidth,
    marginBottom,
    link,
    showControls,
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

            {hover && <Controller nameOfComponent={"Youtube"} />}
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
                <StyledYoutubeContainer
                    size={size}
                    containerBackground={containerBackground}
                    isPreviewScreen={false}
                    mobileScreen={false}
                    marginBottom={marginBottom}
                    marginLeft={marginLeft}
                    marginRight={marginRight}
                    maxWidth={maxWidth}
                    marginTop={marginTop}
                >
                    <YoutubeVideoFrame
                        link={link}
                        showControls={showControls}
                    />
                </StyledYoutubeContainer>
            </div>
        </div>
    )
}

export const YoutubeVideoFrame = ({ link, showControls }) => {
    if(!link){
        return <div className='h-20 w-20'></div>
    }
    const url = new URL(link)
    if(!showControls){
        url.searchParams.set("controls", "0")
    }
    return (
        <iframe
            width="100%"
            style={{
                aspectRatio: "16 / 9"
            }}
            src={url.toString()}
        />
    )
}

export const YoutubeVideoDefaultProps = {
    videoLink: "https://www.youtube.com/embed/_qwLHlVjRyw",
    size: "small",
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    containerBackground: "transparent",
    fullWidth: true,
}

YoutubeVideo.craft = {
    props: YoutubeVideoDefaultProps,
    related: {
        settings: YoutubeVideoSettings,
    },
}
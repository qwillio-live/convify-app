'use client'
import Stories from 'react-insta-stories';
import { ImageStoryAspectRatios, ImageStorySizes } from './useImageStoryThemePresets';
import hexoid from 'hexoid';
import { ImageStorySettnigs } from './image-story.settings';
import { Controller } from '../settings/controller.component';
import { useTranslations } from 'next-intl';
import { CSSProperties, useMemo, useState } from 'react';
import { useNode } from '@craftjs/core';
import Image from 'next/image';
import styled from 'styled-components';

const ImageStorySizeValues = {
    small: "400px",
    medium: "800px",
    large: "1200px",
    full: "100%",
}

export const ImageStoryGen = ({
    size,
    containerBackground,
    align,
    gap,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    marginLeft,
    marginTop,
    marginRight,
    marginBottom,
    settingTabs,
    fullWidth = true,
    items,
    aspectRatio,
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
            }}
        >
            <StyledImageStoryContainer
                className="image-story-component"
                containerBackground={containerBackground}
                marginLeft={marginLeft}
                marginTop={marginTop}
                marginRight={marginRight}
                marginBottom={marginBottom}
                isPreviewScreen={true}
                size={size}
                mobileScreen={false}
                maxWidth={ImageStorySizes[size || "medium"]}
            >
                <ImageStoryItems images={items} aspectRatio={aspectRatio} />
            </StyledImageStoryContainer>
        </div>
    )
}

export const ImageStory = ({
    size,
    containerBackground,
    align,
    gap,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    marginLeft,
    marginTop,
    marginRight,
    marginBottom,
    settingTabs,
    items,
    fullWidth = true,
    aspectRatio = ImageStoryAspectRatios.fiveByFour
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
            className="relative w-full"
            style={{
                width: "100%",
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
            }}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        >
            {hover && <Controller nameOfComponent={t("Image story")} className='w-full min-w-full' />}
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
                <StyledImageStoryContainer
                    className="image-story-component w-full"
                    containerBackground={containerBackground}
                    marginLeft={marginLeft}
                    marginTop={marginTop}
                    marginRight={marginRight}
                    marginBottom={marginBottom}
                    isPreviewScreen={false}
                    size={size}
                    mobileScreen={false}
                    maxWidth={ImageStorySizes[size || "medium"]}
                >
                    <ImageStoryItems images={items} aspectRatio={aspectRatio} />
                </StyledImageStoryContainer>
            </div>
        </div>
    )
}

export const ImageStoryItems = ({ images, aspectRatio }) => {
    const stories = images.map((image) => ({ url: image.src }))
    if (images.length === 0) {
        return <></>
    }
    return (
        <div style={{
            width: "100%",
            maxWidth: '100%',
            aspectRatio: `auto ${aspectRatio}`,
            objectFit: 'cover',
            display: 'flex',
            borderRadius: '16px',
            justifyContent: 'center',
        }}>
            <Stories
                stories={((images ?? []).map((image, index) => (
                    {
                        content: () => (
                            <div style={{ borderRadius: "16px" }}>
                                <img alt={"story"} src={image.src} key={index} style={{ borderRadius: '16px !important', objectFit: 'cover', aspectRatio: `${aspectRatio}` }} />
                            </div>
                        )
                    }
                ))) ?? [{
                    content: () => <></>
                }]}
                loop
                height={"100%"}
                width={"100%"}
                storyStyles={{
                    width: '100%',
                    height: '100%',
                    margin: '0 auto',
                    backgroundColor: '#000',
                    borderRadius: '16px'
                }}
                progressWrapperStyles={{
                    height: '4px',
                    backgroundColor: '#9CA3AF99',
                    borderRadius: '100px',
                    overflow: 'hidden',
                }}
                progressStyles={{
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                }}
                storyContainerStyles={{
                    borderRadius: '16px',
                    background: 'transparent',
                    width: 'inherit'
                }}
                storyInnerContainerStyles={{
                    borderRadius: '16px',
                    background: 'transparent',
                }}
            />
        </div>
    )
}

type StyledImageStoryContainerPropTypes = {
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
    containerBackground: string
    size: ImageStorySizes
    isPreviewScreen: boolean
    mobileScreen: boolean
    maxWidth: string
}

const StyledImageStoryContainer = styled.div<StyledImageStoryContainerPropTypes>`
    width: 100%;
    margin: ${({ marginTop, marginRight, marginBottom, marginLeft }) =>
        `${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px`};
    background-color: ${({ containerBackground }) => containerBackground};
  
    margin-left: auto;
    margin-right: auto;
  
  ${({ size, mobileScreen, isPreviewScreen }) => {
        if (isPreviewScreen) {
            if (size === ImageStorySizes.small) {
                return { width: "376px" }
            } else if (size === ImageStorySizes.medium) {
                return { width: "800px" }
            } else if (size === ImageStorySizes.large) {
                return { width: "1000px" }
            } else {
                return {
                    width: "calc(100% - 22px)",
                }
            }
        } else {
            if (size === ImageStorySizes.small) {
                if (mobileScreen) {
                    return { width: "360px" }
                } else {
                    return { width: "376px" }
                }
            } else if (size === ImageStorySizes.medium) {
                return { width: "calc(100% - 22px)", maxWidth: 800 }
            } else if (size === ImageStorySizes.large) {
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
        if (size === ImageStorySizes.large) {
            return { width: "calc(100% - 22px)" }
        }
    }}
  }

  @media (max-width: 800px) {
    ${({ size }) => {
        if (size === ImageStorySizes.medium) {
            return { width: "calc(100% - 22px)" }
        }
    }}
  }

  @media (max-width: 376px) {
    ${({ size }) => {
        if (size === ImageStorySizes.small) {
            return { width: "calc(100% - 22px)" }
        }
    }}
  }
  `

export const ImageStoryDefaultProps = {
    size: ImageStorySizes.medium,
    containerBackground: "transparent",
    align: "center",
    gap: 30,
    fullWidth: true,
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    settingTabs: ["content"],
    items: [{
        id: `image-story-item-${hexoid(6)()}`,
        src: "https://siteimages.b-cdn.net/flow/default-image.30d08cea.webp"
    },
    {
        id: `image-story-item-${hexoid(6)()}`,
        src: "https://images.pexels.com/photos/251454/pexels-photo-251454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },],
}

ImageStory.craft = {
    props: ImageStoryDefaultProps,
    related: {
        settings: ImageStorySettnigs,
    },
}

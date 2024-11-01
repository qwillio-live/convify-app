'use client'
import Stories from 'react-insta-stories';
import { ImageStorySizes } from './useImageStoryThemePresets';
import hexoid from 'hexoid';
import { ImageStorySettnigs } from './image-story.settings';
import { Controller } from '../settings/controller.component';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useNode } from '@craftjs/core';
import Image from 'next/image';

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
}) => {
    console.log(items, "bhuvanesg")
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
            <ImageStoryItems images={items} aspectRatio={''} />
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
            {hover && <Controller nameOfComponent={"Image story"} />}
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
                <ImageStoryItems images={items} aspectRatio={''} />
            </div>
        </div>
    )
}

export const ImageStoryItems = ({ images, aspectRatio }) => {
    const stories = images.map((image) => ({ url: image.src }))
    return (
        <div style={{
            width: "600px",
            maxWidth: '600px',
            aspectRatio: 'auto 16 / 9',
            objectFit: 'cover',
        }}>
            <Stories
                stories={images.map((image, index) => (
                    {content: () => <img alt={"story"} src={image.src} key={index} style={{borderRadius:'16px'}}/>}
                ))}
                loop
                width="100%"
                height="100%"
                storyStyles={{
                    width: '100%',
                    height: '100%',
                    margin: '0 auto',
                    backgroundColor: '#000',
                    borderRadius: '16px !important'
                }}
                progressWrapperStyles={{
                    height: '4px',
                    backgroundColor: '#9CA3AF99',
                    borderRadius: '100px',
                }}
                progressStyles={{
                    backgroundColor: '#FFFFFF',
                }}
                storyContainerStyles={{
                    borderRadius: '16px !important',
                    background: 'transparent',
                }}
            />
        </div>
    )
}
export const ImageStoryDefaultProps = {
    size: ImageStorySizes.medium,
    containerBackground: "transparent",
    align: "center",
    gap: 30,
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
        id: `logo-bar-item-${hexoid(6)()}`,
        src: "https://siteimages.b-cdn.net/flow/default-image.30d08cea.webp"
    },
    {
        id: `logo-bar-item-${hexoid(6)()}`,
        src: "https://images.pexels.com/photos/251454/pexels-photo-251454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },],
}

ImageStory.craft = {
    props: ImageStory,
    related: {
        settings: ImageStorySettnigs,
    },
}

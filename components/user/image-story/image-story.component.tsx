'use client'
import Stories from 'react-insta-stories';
import { ImageStorySizes } from './useImageStoryThemePresets';
import hexoid from 'hexoid';
import { ImageStorySettnigs } from './image-story.settings';

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
            <ImageStoryItems images={items} aspectRatio={''} />
        </div>
    )
}

export const ImageStoryItems = ({ images, aspectRatio }) => {
    const stories = images.map((image) => ({ url: image.src }))
    return (
        <div>

        <Stories
            stories={stories}
            loop
            width="100%"
            height="100%"
            storyStyles={{
                width: '100%',
                // height: '50vmin',
                // margin: '0 auto',
                // aspectRatio: '9 / 16',
                margin: '0 auto',
                
                backgroundColor: '#000',
            }}
            storyContainerStyles={{
                maxWidth: '1000px',
                width:"400px",
                aspectRatio: '9 / 16',
                objectFit: 'cover',
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

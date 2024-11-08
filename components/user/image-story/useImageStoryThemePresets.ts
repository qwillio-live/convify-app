import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"

export enum ImageStorySizes {
    small = "small",
    medium = "medium",
    large = "large",
    full = "full",
}

export enum ImageStoryAspectRatios {
    sixteenByNine = "16 / 9",
    fiveByFour = "5 / 4",
}

export enum ImageStoryAspectRatiosLabels {
    sixteenByNine = "16:9",
    fiveByFour = "5:4",
}


export const useImageStoryThemePresets = () => {
    const theme = useAppSelector((state) => state.theme)
    const t = useTranslations("Components")
    const defaultItems = [
        {
            id: `image-story-item-${hexoid(6)()}`,
            src: "https://siteimages.b-cdn.net/flow/default-image.30d08cea.webp"
        },
        {
            id: `image-story-item-${hexoid(6)()}`,
            src: "https://siteimages.b-cdn.net/flow/default-image2.webp"
        },
    ]
    const defaultPreset = {
        size: ImageStorySizes.medium,
        containerBackground: "transparent",
        align: "center",
        paddingLeft: "16",
        paddingTop: "20",
        paddingRight: "16",
        paddingBottom: "20",
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        settingTabs: ["content"],
        items: defaultItems,
        defaultIndex: 0,
        aspectRatio: ImageStoryAspectRatios.fiveByFour,
    }

    return {
        defaultItems,
        defaultPreset
    }
}


export enum YoutubeVideoSizes {
    small = "small",
    medium = "medium",
    large = "large",
    full = "full",
  }

export const useYoutubeVideoThemePresets = () => {
    const defaultPresets = {
        link: "https://www.youtube.com/embed/_qwLHlVjRyw",
        size: YoutubeVideoSizes.small,
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        showControls: true,
        containerBackground: "transparent",
    }
    return {
        defaultPresets
    }
}


export enum YoutubeVideoSizes {
    small = "small",
    medium = "medium",
    large = "large",
    full = "full",
  }
export const  YoutubeVideoSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
  }
export const useYoutubeVideoThemePresets = () => {
    const defaultPresets = {
        link: "https://www.youtube.com/embed/_qwLHlVjRyw",
        size: YoutubeVideoSizes.medium,
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
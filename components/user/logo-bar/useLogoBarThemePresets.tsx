import {
  LogoBarAlignments,
  LogoBarProps,
  LogoBarSizes,
} from "./user-logo-bar.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import defaultLogo1 from "@/assets/images/logo-bar-default-logo-1.svg"
import defaultLogo2 from "@/assets/images/logo-bar-default-logo-2.svg"
import defaultLogo3 from "@/assets/images/logo-bar-default-logo-3.svg"
import defaultLogo4 from "@/assets/images/logo-bar-default-logo-4.svg"
import defaultLogoImage from "@/assets/images/logo-bar-default-logo.svg"
import { ImagePictureTypes } from "@/components/PicturePicker"


const useLogoBarThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const defaultLogo = { desktop: defaultLogoImage.src } as ImagePictureTypes

  const defaultItems = [
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: { desktop: defaultLogo1.src } as ImagePictureTypes,
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: { desktop: defaultLogo2.src } as ImagePictureTypes,
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: { desktop: defaultLogo3.src } as ImagePictureTypes,
    },
    {
      id: `logo-bar-item-${hexoid(6)()}`,
      src: { desktop: defaultLogo4.src } as ImagePictureTypes,
    },
  ]

  const defaultPreset: LogoBarProps = {
    size: LogoBarSizes.medium,
    grayscale: false,
    containerBackground: "transparent",
    align: LogoBarAlignments.center,
    height: 60,
    gap: 30,
    alignMobile: false,
    mobileRowItems: 1,
    paddingLeft: "16",
    paddingTop: "20",
    paddingRight: "16",
    paddingBottom: "20",
    marginLeft: 0,
    marginTop: 20,
    marginRight: 0,
    marginBottom: 20,
    fullWidth: true,
    settingTabs: ["content"],
    items: defaultItems,
  }

  return {
    defaultPreset,
    defaultLogo,
    defaultItems,
  }
}

export default useLogoBarThemePresets

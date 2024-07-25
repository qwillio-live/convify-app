import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
import hexoid from "hexoid"

import { useAppSelector } from "@/lib/state/flows-state/hooks"

import { UserInputMailProps, UserInputSizes } from "./user-input-mail.component"

const useInputMailThemePresets = () => {
  const t = useTranslations("Components")

  const theme = useAppSelector((state) => state.theme)
  const backgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )
  const darkenedPrimaryColor = darken(
    0.1,
    theme?.general?.primaryColor || "#3182ce"
  )

  const outlinedPresetMail: UserInputMailProps = {
    inputValue: "",
    fontSize: 16,
    textColor: "#000",
    width: 366,
    fontWeight: "normal",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    placeholder: t("EmailPlaceholder"),
    backgroundColor: "transparent",
    backgroundImage: theme?.general?.backgroundImage,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderColor: {
      value: "#eaeaeb",
      globalStyled: false,
      isCustomized: false,
    },
    activeBorderColor: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    primaryFont: {
      value: theme?.text?.primaryFont || "--font-heading",
      globalStyled: true,
      isCustomized: false,
    },
    secondaryFont: {
      value: theme?.text?.secondaryFont || "--font-inter",
      globalStyled: true,
      isCustomized: false,
    },
    borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 8,
    topLeftRadius: 8,
    topRightRadius: 8,
    bottomLeftRadius: 8,
    bottomRightRadius: 8,
    isActive: false,
    inputRequired: false,
    fullWidth: true,
    size: UserInputSizes.medium,
    label: t("EmailLabel"),
    fieldName: t("EmailFieldName"),
    floatingLabel: false,
    enableIcon: true,
    icon: "mail-send-envelope",
    preset: "outlined",
    error: false,
    errorText: "Please specify an answer",
    errorIcon: "x",
    errorStyles: {
      borderColor: "#cc0000",
      textColor: "#cc0000",
      backgroundColor: rgba("#cc0000", 0.1),
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 8,
      bottomRightRadius: 8,
    },
    settingsTab: "content",
    id: `input-${hexoid(6)()}`

  }

  const underlinedPresetMail: UserInputMailProps = {
    inputValue: "",
    fontSize: 16,
    textColor: "#000",
    width: 366,
    fontWeight: "normal",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    placeholder: t("EmailPlaceholder"),
    backgroundColor: "transparent",
    borderColor: {
      value: "#eaeaeb",
      globalStyled: false,
      isCustomized: false,
    },
    activeBorderColor: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    primaryFont: {
      value: theme?.text?.primaryFont || "--font-heading",
      globalStyled: true,
      isCustomized: false,
    },
    secondaryFont: {
      value: theme?.text?.secondaryFont || "--font-inter",
      globalStyled: true,
      isCustomized: false,
    },
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    topLeftRadius: 0,
    topRightRadius: 0,
    bottomLeftRadius: 0,
    bottomRightRadius: 0,
    isActive: false,
    inputRequired: false,
    fullWidth: true,
    size: UserInputSizes.medium,
    label: t("EmailLabel"),
    fieldName: t("EmailFieldName"),
    floatingLabel: false,
    enableIcon: true,
    icon: "mail-send-envelope",
    preset: "underlined",
    error: false,
    errorText: "Please specify an answer",
    errorIcon: "x",
    errorStyles: {
      borderColor: "transparent",
      textColor: "#cc0000",
      backgroundColor: "transparent",
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 0,
      bottomRightRadius: 0,
    },
    settingsTab: "content",
    id: `input-${hexoid(6)()}`

  }

  const formPresetMail: UserInputMailProps = {
    inputValue: "",
    fontSize: 16,
    textColor: "#000",
    width: 366,
    fontWeight: "normal",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    placeholder: t("EmailPlaceholder"),
    backgroundColor: "transparent",
    backgroundImage: theme?.general?.backgroundImage,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderColor: {
      value: "#eaeaeb",
      globalStyled: false,
      isCustomized: false,
    },
    activeBorderColor: {
      value: theme?.general?.primaryColor || "#3182ce",
      globalStyled: true,
      isCustomized: false,
    },
    primaryFont: {
      value: theme?.text?.primaryFont || "--font-heading",
      globalStyled: true,
      isCustomized: false,
    },
    secondaryFont: {
      value: theme?.text?.secondaryFont || "--font-inter",
      globalStyled: true,
      isCustomized: false,
    },
    borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 8,
    topLeftRadius: 8,
    topRightRadius: 8,
    bottomLeftRadius: 8,
    bottomRightRadius: 8,
    isActive: false,
    inputRequired: false,
    fullWidth: true,
    size: UserInputSizes.medium,
    label: t("EmailLabel"),
    fieldName: t("EmailFieldName"),
    floatingLabel: false,
    enableIcon: true,
    icon: "mail-send-envelope",
    preset: "outlined",
    error: false,
    errorText: "Please specify an answer",
    errorIcon: "x",
    errorStyles: {
      borderColor: "#cc0000",
      textColor: "#cc0000",
      backgroundColor: rgba("#cc0000", 0.1),
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 8,
      bottomRightRadius: 8,
    },
    settingsTab: "content",
    id: `input-${hexoid(6)()}`
  }


  return { outlinedPresetMail, underlinedPresetMail, formPresetMail }
}

export default useInputMailThemePresets
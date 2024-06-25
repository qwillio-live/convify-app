import { StepsProps, StepsSizes, StepsStyles } from "./user-steps.component"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import { PictureTypes } from "@/components/PicturePicker"

const useStepsThemePresets = () => {
  const theme = useAppSelector((state) => state.theme)
  const t = useTranslations("Components")

  const defaultSteps = [
    {
      id: `step-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      text: `${t("Step")} 1`,
    },
    {
      id: `step-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      text: `${t("Step")} 2`,
    },
    {
      id: `step-${hexoid(6)()}`,
      picture: null,
      pictureType: PictureTypes.NULL,
      text: `${t("Step")} 3`,
    },
  ]

  const defaultPreset: StepsProps = {
    fontFamily: theme?.text?.primaryFont || "inherit",
    size: StepsSizes.medium,
    selectedColor: theme?.general?.primaryColor || "#3182ce",
    disabledColor: "#bababb",
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
    settingTabs: ["content"],
    style: StepsStyles.icon,
    steps: defaultSteps,
    currentStep: 1,
  }
  return {
    defaultPreset,
    defaultSteps,
  }
}

export default useStepsThemePresets

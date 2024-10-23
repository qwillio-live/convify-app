import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { Node, WithoutPrivateActions } from "@craftjs/core"
import { CRAFT_ELEMENTS } from "./craft-elements"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "../icon-button/useButtonThemePresets"

export const updateElementProps = (
  node: Node,
  actions: WithoutPrivateActions<null>,
  style: GlobalThemeState
) => {
  const elementName = node.data.displayName
  switch (elementName) {
    case CRAFT_ELEMENTS.ICONBUTTON:
      updateIconButtonProps(node, actions, style)
      break
    default:
      break
  }
}

const updateIconButtonProps = (
  node: Node,
  actions: WithoutPrivateActions<null>,
  style: GlobalThemeState
) => {
  const nodeProps = node.data.props
  if (
    style.text?.primaryFont &&
    nodeProps.fontFamily &&
    nodeProps.fontFamily.globalStyled &&
    !nodeProps.fontFamily.isCustomized
  ) {
    actions.setProp(
      node.id,
      (props) => (props.fontFamily.value = style.text?.primaryFont)
    )
  }

  if (style.general?.primaryColor) {
    const primaryColor = style.general?.primaryColor
    const backgroundPrimaryColor = getBackgroundForPreset(
      primaryColor,
      nodeProps.preset
    )
    const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(
      primaryColor,
      nodeProps.preset
    )
    if (
      nodeProps.background &&
      nodeProps.background.globalStyled &&
      !nodeProps.background.isCustomized
    ) {
      actions.setProp(
        node.id,
        (props) => (props.background.value = backgroundPrimaryColor)
      )
    }
    if (
      nodeProps.color &&
      nodeProps.color.globalStyled &&
      !nodeProps.color.isCustomized
    ) {
      actions.setProp(
        node.id,
        (props) => (props.background.value = primaryColor)
      )
    }
    if (
      nodeProps.borderColor &&
      nodeProps.borderColor.globalStyled &&
      !nodeProps.borderColor.isCustomized
    ) {
      actions.setProp(
        node.id,
        (props) => (props.borderColor.value = primaryColor)
      )
    }
    if (
      nodeProps.backgroundHover &&
      nodeProps.backgroundHover.globalStyled &&
      !nodeProps.backgroundHover.isCustomized
    ) {
      actions.setProp(
        node.id,
        (props) => (props.backgroundHover.value = hoverBackgroundPrimaryColor)
      )
    }
    if (
      nodeProps.borderHoverColor &&
      nodeProps.borderHoverColor.globalStyled &&
      !nodeProps.borderHoverColor.isCustomized
    ) {
      actions.setProp(
        node.id,
        (props) => (props.borderHoverColor.value = primaryColor)
      )
    }
    if (
      nodeProps.colorHover &&
      nodeProps.colorHover.globalStyled &&
      !nodeProps.colorHover.isCustomized
    ) {
      actions.setProp(
        node.id,
        (props) => (props.colorHover.value = primaryColor)
      )
    }
  }
}

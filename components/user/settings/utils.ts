import { GlobalThemeState } from "@/lib/state/flows-state/features/theme/globalThemeSlice"
import { Node, WithoutPrivateActions } from "@craftjs/core"
import { CRAFT_ELEMENTS } from "./craft-elements"
import {
  getBackgroundForPreset as getIconButtonBackgroundForPreset,
  getHoverBackgroundForPreset as getIconButtonHoverBackgroundForPreset,
} from "../icon-button/useButtonThemePresets"
import {
  getBackgroundForPreset as getHeadlineTextBackgroundForPreset,
  getHoverBackgroundForPreset as getHeadlineTextHoverBackgroundForPreset,
} from "../headline-text/useHeadlineThemePresets"
import {
  getBackgroundForPreset as getUserTextBackgroundForPreset,
  getHoverBackgroundForPreset as getUserTextHoverBackgroundForPreset,
} from "../text/useTextThemePresets"

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
    case CRAFT_ELEMENTS.HEADLINETEXT:
      updateHeadlineTextProps(node, actions, style)
      break
    case CRAFT_ELEMENTS.USERTEXT:
      updateUserTextProps(node, actions, style)
      break
    case CRAFT_ELEMENTS.USERINPUT:
      updateUserInputProps(node, actions, style)
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
    const backgroundPrimaryColor = getIconButtonBackgroundForPreset(
      primaryColor,
      nodeProps.preset
    )
    const hoverBackgroundPrimaryColor = getIconButtonHoverBackgroundForPreset(
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
      actions.setProp(node.id, (props) => (props.color.value = primaryColor))
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

const updateUserInputProps = (
  node: Node,
  actions: WithoutPrivateActions<null>,
  style: GlobalThemeState
) => {
  const nodeProps = node.data.props
  if (
    style.text?.primaryFont &&
    nodeProps.primaryFont &&
    nodeProps.primaryFont.globalStyled &&
    !nodeProps.primaryFont.isCustomized
  ) {
    actions.setProp(
      node.id,
      (props) => (props.primaryFont.value = style.text?.primaryFont)
    )
  }

  if (
    style.text?.secondaryFont &&
    nodeProps.secondaryFont &&
    nodeProps.secondaryFont.globalStyled &&
    !nodeProps.secondaryFont.isCustomized
  ) {
    actions.setProp(
      node.id,
      (props) => (props.secondaryFont.value = style.text?.secondaryFont)
    )
  }
}

const updateHeadlineTextProps = (
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
    const primaryTextColor = style.text?.primaryColor
    const backgroundPrimaryColor = getHeadlineTextBackgroundForPreset(
      primaryColor,
      nodeProps.preset
    )
    const hoverBackgroundPrimaryColor = getHeadlineTextHoverBackgroundForPreset(
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
        (props) => (props.color.value = primaryTextColor)
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

const updateUserTextProps = (
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
    const secondaryTextColor = style.text?.secondaryColor
    const backgroundPrimaryColor = getUserTextBackgroundForPreset(
      primaryColor,
      nodeProps.preset
    )
    const hoverBackgroundPrimaryColor = getUserTextHoverBackgroundForPreset(
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
        (props) => (props.color.value = secondaryTextColor)
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

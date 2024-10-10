import React, { useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useEditor, useNode } from "@craftjs/core"
import { ArrowUp, GripHorizontal, Move, Trash2 } from "lucide-react"
import ReactDOM from "react-dom"
import styled from "styled-components"

import {
  addAvatarComponentId,
  addField,
  setSelectedComponent,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Controller } from "./controller.component"

interface StyledNodeDivProps {
  borderColor: string
  selectedComponent: string | undefined
  fullWidth: boolean
  selected: boolean
  isActive: boolean
  id: string
  name: string
}

const StyledNodeDiv = styled.div<StyledNodeDivProps>`
  position: relative;
  border-width: ${(props) => {
    if (
      props.id === "ROOT" ||
      ((props.name === "Card" ||
        props.name === "Card Content" ||
        props.name === "ProgressBar") &&
        !props.isActive)
    ) {
      return "0"
    } else if (
      (props.name === "Card" || props.name === "Card Content") &&
      props.isActive
    ) {
      return "0px"
    } else {
      return "1px"
    }
  }};

  padding: ${(props) => (props.name === "ProgressBar" ? "1px" : "0px")};
  border-style: ${(props) =>
    props.selected || props.selectedComponent === props.id
      ? "dotted"
      : "solid"};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  border-color: ${(props) => {
    if (props.selected || props.selectedComponent === props.id) {
      return "#60A5FA"
    }
    if (props.isActive && props.id !== "ROOT") {
      return "#60A5FA"
    }
    return props.borderColor
      ? props.name !== "ProgressBar"
        ? props.borderColor
        : "transparent"
      : "transparent"
  }};
  z-index: 10;
  &:hover {
    border-color: transparent;
    border-style: dotted;
  }
`

export default StyledNodeDiv

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { id } = useNode()
  const selectedComponent = useAppSelector(
    (state) => state.screen?.selectedComponent
  )
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)
  const selectedScreen =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0
  const currentScreenId = useAppSelector(
    (state) => state?.screen?.screens[selectedScreen]?.screenId
  )
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }))

  const {
    isHover,
    actions: { setProp },
    isSelected,
    dom,
    borderColor,
    moveable,
    connectors: { drag },
    fullWidth,
    parent,
    amIBeingDragged,
    deletable,
    props,
    name,
    fieldType,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
    fieldType: node.data.props.fieldType || "design",
    borderColor:
      node.data.props.containerBackground ||
      node.data.props.backgroundColor ||
      node.data.props.background ||
      undefined,
    amIBeingDragged: node.events.dragged,
    name: node.data.custom.displayName || node.data.displayName,
    fullWidth: node.data.props.fullWidth,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }))
  const avatarComponentId = useAppSelector(
    (state) => state?.screen?.avatarComponentId
  )
  const previousAvatarComponentId = useAppSelector(
    (state) => state?.screen?.previousAvatarComponentId
  )
  const avatarComponentIds = useAppSelector(
    (state) => state?.screen?.avatarComponentIds
  )
  useEffect(() => {
    if (dom && id !== "ROOT") {
      if (isHover && !isSelected) {
        // If hover and not selected, add hover class
        dom.classList.add("component-hover")
      } else {
        // If not hover or selected, remove hover class
        dom.classList.remove("component-hover")
      }
    }
  }, [dom, isHover, isSelected, id])
  useEffect(() => {
    if (isSelected) {
      dispatch(setSelectedComponent(id))
    }
  }, [isSelected])

  useEffect(() => {
    if (selectedComponent && selectedComponent !== "ROOT") {
      const child = document.getElementById(selectedComponent)
      child?.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
        block: "center",
        inline: "center",
      })
    }
  }, [mobileScreen])

  useEffect(() => {
    if (name === "AvatarComponent" && !avatarComponentIds?.includes(id)) {
      dispatch(addAvatarComponentId(id))
    }
  }, [name, id, avatarComponentIds, dispatch])

  useEffect(() => {
    if (fieldType === "data") {
      dispatch(
        addField({
          fieldId: id,
          fieldName: name,
          fieldValue: null,
          fieldRequired: false,
          toggleError: false,
        })
      )
      setProp((props) => {
        props.parentScreenId = currentScreenId
      })
    }
  }, [])

  if (name === "AvatarComponent" && id !== avatarComponentId) {
    return null
  }
  console.log("name", name)
  return (
    <StyledNodeDiv
      selected={isSelected}
      borderColor={borderColor}
      fullWidth={fullWidth}
      id={id}
      selectedComponent={selectedComponent}
      name={name}
      isActive={isActive}
      className="parent-component"
    >
      {render}
    </StyledNodeDiv>
  )
}

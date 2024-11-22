import React, { useCallback, useEffect, useMemo, useRef } from "react"
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
  new?: boolean
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
    return !props.borderColor || props.name === "ProgressBar"
      ? "transparent"
      : props.borderColor
  }};
  z-index: 10;
  &:hover {
    border-color: transparent;
    border-style: dotted;
  }
`

const NewStyledNodeDiv = ({
  borderColor,
  selectedComponent,
  fullWidth,
  selected,
  isActive,
  id,
  name,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & StyledNodeDivProps) => {
  console.log("selected", selected)
  const borderWidth = useMemo(() => {
    if (
      id === "ROOT" ||
      ((name === "Card" || name === "Card Content" || name === "ProgressBar") &&
        !isActive)
    ) {
      return "border-none"
    } else if ((name === "Card" || name === "Card Content") && isActive) {
      return "border-none"
    } else {
      return "border"
    }
  }, [id, name, isActive])

  const borderStyle =
    selected || selectedComponent === id ? "border-dotted" : "border-solid"

  const borderColorValue = useMemo(() => {
    if (selected || selectedComponent === id) {
      return "border-[#60A5FA]"
    }
    if (isActive && id !== "ROOT") {
      return "border-[#60A5FA]"
    }
    return !borderColor ||
      borderColor === "transparent" ||
      name === "ProgressBar"
      ? "border-transparent"
      : `border-[${borderColor}]`
  }, [selected, selectedComponent, id, isActive, borderColor, name])

  // return id !== "footer-node" ? (
  return props.new ? (
    <div
      className={cn(
        "relative  hover:border-dotted hover:border-transparent",
        fullWidth ? "w-full" : "w-auto",
        name === "ProgressBar" ? "p-px" : "p-0",
        borderWidth,
        borderStyle,
        borderColorValue,
        className
      )}
      {...props}
    />
  ) : (
    <div
      className={cn(
        "!b-0 hover:b-0 relative h-1 bg-white",
        fullWidth ? "w-full" : "w-auto"
      )}
      {...props}
    />
  )
  // ) : (
  //   <div></div>
}

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
    console.log("isdifs", id)
    if (dom && id !== "ROOT" && id !== "footer-node") {
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
        block: "nearest",
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
      // console.log("run here")
      // setProp((props) => {
      //   props.parentScreenId = currentScreenId
      // })
    }
  }, [])

  if (name === "AvatarComponent" && id !== avatarComponentId) {
    return null
  }

  console.log("name", name, "selectedComponent"), selectedComponent
  return (
    <NewStyledNodeDiv
      selected={isSelected}
      borderColor={borderColor}
      fullWidth={fullWidth}
      id={id}
      selectedComponent={selectedComponent}
      name={name}
      isActive={isActive}
      className="parent-component"
      new={name === "Footer" ? false : true}
    >
      {render}
    </NewStyledNodeDiv>
  )
}

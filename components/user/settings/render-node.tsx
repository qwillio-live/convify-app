import { useNode, useEditor } from "@craftjs/core"
import React, { useEffect, useRef, useCallback } from "react"
import ReactDOM from "react-dom"
import { Move, ArrowUp, Trash2, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Controller } from "./controller.component"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { addField, setSelectedComponent } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useRouter } from "next/navigation"


interface StyledNodeDivProps {
  borderColor: string;
  selectedComponent: string | undefined;
  fullWidth: boolean;
  selected: boolean;
  isActive: boolean;
  id: string;
  name: string;
}

const StyledNodeDiv = styled.div<StyledNodeDivProps>`
  position: relative;
  border-width: ${(props) => {
    if(props.id === 'ROOT' || ((props.name === 'Card' || props.name === 'Card Content') && !props.isActive)) {
      return '0';
    }else if((props.name === 'Card' || props.name === 'Card Content') && props.isActive){
      return '0px';
    }else{
      return '1px';
    }
  }};
  border-style: ${(props) => (props.selected || props.selectedComponent === props.id ? 'dotted' : 'solid')};
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  border-color: ${(props) => {
    if(props.selected || props.selectedComponent === props.id) {
      return '#60A5FA';
    }
    if (props.isActive && props.id !== 'ROOT') {
      return '#60A5FA';
    }
    return props.borderColor ? props.borderColor : 'transparent';
  }};
  z-index: 10;
  &:hover {
    border-style: dotted;
    border-color: #60A5FA;
  }
`;

export default StyledNodeDiv;



export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { id } = useNode()
  const selectedComponent = useAppSelector((state) => state.screen?.selectedComponent);
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen);
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }))

  const {
    isHover,
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
    fieldType: node.data.props.fieldType || 'design',
    borderColor: node.data.props.containerBackground || node.data.props.backgroundColor || node.data.props.background || undefined,
    amIBeingDragged: node.events.dragged,
    name: node.data.custom.displayName || node.data.displayName,
    fullWidth: node.data.props.fullWidth,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));
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
  }, [dom, isHover, isSelected,id]);
  useEffect(() => {
    if(isSelected) {
      dispatch(setSelectedComponent(id));
    }
  }
  , [isSelected])

  useEffect(() => {
    if(selectedComponent && selectedComponent !== "ROOT"){
      const child = document.getElementById(selectedComponent);
      child?.scrollIntoView({behavior: "instant" as ScrollBehavior, block: "center", inline: "center"});
    }
  }, [mobileScreen])

  useEffect(() => {
    if(fieldType === 'data'){
      dispatch(addField({
        fieldId: id,
        fieldName: name,
        fieldValue: null,
        fieldRequired: false,
        toggleError: false,
      }));
    }
  },[])

  return (

    <StyledNodeDiv
      selected={isSelected}
      borderColor={borderColor}
      fullWidth={fullWidth}
      id={id}
      selectedComponent={selectedComponent}
      name={name}
      isActive={isActive}
    >
        {render}
    </StyledNodeDiv>
  )
}

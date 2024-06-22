import { useNode, useEditor } from "@craftjs/core"
import React, { useEffect, useRef, useCallback } from "react"
import ReactDOM from "react-dom"
import { Move, ArrowUp, Trash2, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Controller } from "./controller.component"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { setSelectedComponent } from "@/lib/state/flows-state/features/placeholderScreensSlice"
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
  /* border-width: ${(props) => (props.id === 'ROOT' ? '0' : '1px')}; */
  border-width: ${(props) => {
    if(props.id === 'ROOT' || ((props.name === 'Card Content') && !props.isActive)) {
      return '0';
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
  } = useNode((node) => ({
    isHover: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
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
  const router = useRouter();
  // console.log(`Name of component is: ${name} and props are is ${JSON.stringify(props)}`)
  const selectedComponent = useAppSelector((state) => state.screen?.selectedComponent);
  return (
    // <div
    //   className={cn('relative border z-10 border-transparent border-dotted',
    //     (isActive) && (id !== 'ROOT') && (containerBackground) && `border-[${containerBackground}]`,
    //     (isActive) && (id !== 'ROOT') && (!containerBackground && elementBackground) && `border-[${elementBackground}]`,
    //     (id !== 'ROOT') && 'hover:border-blue-400',
    //     fullWidth && 'w-full'
    //   )}
    // >
    <StyledNodeDiv
      selected={isSelected}
      borderColor={borderColor}
      fullWidth={fullWidth}
      id={id}
      selectedComponent={selectedComponent}
      name={name}
      isActive={isActive}
      onClick={(e) => {
        // e.preventDefault()
        // if(id !== "ROOT")
        // router.push(`#${id}`)
      }}
      // className={cn('relative z-10', fullWidth && 'w-full')}
    >
      {/* <div className='flex flex-col justify-center items-center w-full'> */}
        {render}
      {/* </div> */}
      {/* {(isActive || isHover) && (
        <div className='special absolute bottom-[100%] left-0 flex flex-row items-center gap-4 bg-blue-500 p-2 text-xs text-white'>
          <span>{name}</span>
          <span className='hover:cursor-move'><GripHorizontal /></span>
        </div>
      )} */}
    </StyledNodeDiv>
  )
}

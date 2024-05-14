import { useNode, useEditor } from '@craftjs/core';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Move, ArrowUp, Trash2, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Controller } from './controller.component';

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    isSelected,
    dom,
    moveable,
    connectors: { drag },
    fullWidth,
    parent,
    deletable,
    props,
    name,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    isSelected: node.events.selected,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    fullWidth: node.data.props.fullWidth,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));
  useEffect(() => {
    if (dom && id !== 'ROOT') {
      if (isHover && !isSelected) {
        // If hover and not selected, add hover class
        dom.classList.add('component-hover');
      } else {
        // If not hover or selected, remove hover class
        dom.classList.remove('component-hover');
      }
    }
  }, [dom, isHover, isSelected]);

  return (
    <div
      className={cn('relative border z-10 border-transparent border-dotted',
        (isHover || isActive) && (id !== 'ROOT') && 'border-blue-400',
        fullWidth && 'w-full'
      )}
    >
      <div className='flex flex-col justify-center items-center w-full'>
        {render}
      </div>
      {/* {(isActive || isHover) && (
        <div className='special absolute bottom-[100%] left-0 flex flex-row items-center gap-4 bg-blue-500 p-2 text-xs text-white'>
          <span>{name}</span>
          <span className='hover:cursor-move'><GripHorizontal /></span>
        </div>
      )} */}

    </div>
  );
};


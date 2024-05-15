import React from "react";
import styled from 'styled-components';
import { Controller } from "../settings/controller.component";
import { cn } from "@/lib/utils";
import {useNode} from "@/lib/craftjs"
import { ListItemSettings } from "./list-settings.component";
import { Element } from "@/lib/craftjs";
import { isValidUrl } from "@/lib/utils/text";


const ListInner = styled.div<{
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  column: number
  background: string
  width: number
  fullWidth: boolean
  height: number
  flex: string
  flexDirection: string
  justifyContent: string
  alignItems: string
  gap: number
  radius: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}>`
  margin-top: ${({marginTop}) => `${marginTop}px`};
  margin-bottom: ${({marginBottom}) => `${marginBottom}px`};
  margin-left: ${({marginLeft}) => `${marginLeft}px`};
  margin-right: ${({marginRight}) => `${marginRight}px`};
  background-color: ${({background}) => background};
  padding-top: ${({paddingTop}) => `${paddingTop}px`};
  padding-bottom: ${({paddingBottom}) => `${paddingBottom}px`};
  padding-left: ${({paddingLeft}) => `${paddingLeft}px`};
  padding-right: ${({paddingRight}) => `${paddingRight}px`};
  min-width: ${({width, fullWidth}) => fullWidth ? "100%" : `${width}px`};
  min-height: auto;
  display: grid;
  grid-gap: 20px !important;
  grid-template-columns: ${({column}) => `repeat(${column}, minmax(0, 1fr));`};
  flex-direction: ${({flexDirection}) => flexDirection};
  justify-content: ${({justifyContent}) => justifyContent};
  align-items: ${({alignItems}) => alignItems};
  gap: ${({gap}) => `${gap}px`};
  border-radius: ${({radius}) => `${radius}px`};
  overflow: visible;
  position: relative;
`;


export const ListItem = ({
  listItemStyles,
  item,
}) => {
  return (
    <div
      style={{ width: `${listItemStyles.width}px` }}
      className="relative max-w-[300px] overflow-hidden"
    >
        <div className="text-lg flex items-center gap-x-4">
          {isValidUrl(item.icon) ?    
            <img
              is={"img"}
              id={`list-item-image-${item.id}`}
              className="w-6 h-6"
              src={item.icon}
              alt={item.text}
            /> : item.icon
          }
          <div className="d-flex mb-1 mt-1">
            <label><b>{item.text}</b></label>
            <p>{item.subText}</p>
          </div>
        </div>  
      </div>
  );
};

ListItem.craft = {
  related: {
    settings: ListItemSettings,
  },
}

export const List = ({
listStyles,
listItemStyles,
listItems,
  ...props
}) => {
  const {
    actions: { },
    connectors: { connect, drag },
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  return (
    <ListInner
      ref={(ref: any) => connect(drag(ref))}
      className={cn("border border-transparent", (isHovered && "border border-blue-400 border-dotted"))}
      {...listStyles}
      {...props}
    >
      {isHovered && <Controller nameOfComponent={"List"} />}
        {listItems.map((item, index) => (
          <Element
            is={ListItem}
            id={`list-item-image-${item.id}`}
            listItemStyles={listItemStyles}
            key={`list-item-image-${item.id}`}
            item={item}
          />
        ))}
    </ListInner>
  )
}

export type ListProps = {
listStyles:{
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
  column: number
  background: string
  display: string
  width: number
  fullWidth: boolean
  height: number
  flexDirection: "row" | "column"
  justifyContent: "space-between" | "center" | "flex-start" | "flex-end"
  alignItems: "center" | "flex-start" | "flex-end"
  gap: number
  radius: number
},
listItemStyles:{
  width: number
},
  listItems: {
    id: string | number
    text: string | null
    subText: string | null
    icon: any
  }[]
}

export const ListDefaultProps: ListProps = {
listStyles:{
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  paddingTop: 20,
  paddingBottom: 20,
  paddingLeft: 0,
  column: 2,
  paddingRight: 0,
  background: "#ffffff",
  width: 800,
  fullWidth: false,
  height: 300,
  display: "grid",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 70,
  radius: 0,
},
listItemStyles:{
  width: 300,
},
  listItems: [
    {
      id: "1",
      text: "User Friendly",
      subText: "Saves time and frustation",
      icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.566 1.017a.486.486 0 0 1 .868 0l1.009 2.034a.483.483 0 0 0 .363.262l2.264.327a.481.481 0 0 1 .389.323.47.47 0 0 1-.121.487L14.7 6.044a.473.473 0 0 0-.138.419l.388 2.247a.474.474 0 0 1-.194.465.487.487 0 0 1-.509.035l-2.021-1.054a.482.482 0 0 0-.452 0L9.758 9.21a.487.487 0 0 1-.509-.035.474.474 0 0 1-.194-.465l.388-2.247a.473.473 0 0 0-.138-.419L7.662 4.45a.47.47 0 0 1-.121-.487.481.481 0 0 1 .389-.323l2.264-.327a.483.483 0 0 0 .363-.262ZM6.322 10.1l-.863-.45a.49.49 0 0 0-.453 0L2.991 10.7a.491.491 0 0 1-.51-.034.474.474 0 0 1-.193-.466l.387-2.246a.471.471 0 0 0-.137-.419L.894 5.944a.472.472 0 0 1-.12-.487.481.481 0 0 1 .389-.323l2.263-.327a.483.483 0 0 0 .364-.262L4.8 2.511a.484.484 0 0 1 .434-.267M17.678 10.1l.863-.451a.49.49 0 0 1 .453 0l2.015 1.051a.491.491 0 0 0 .51-.034.474.474 0 0 0 .193-.466l-.387-2.246a.471.471 0 0 1 .137-.419l1.644-1.595a.472.472 0 0 0 .12-.487.481.481 0 0 0-.389-.323l-2.263-.327a.483.483 0 0 1-.364-.262l-1.01-2.03a.484.484 0 0 0-.434-.267M17.027 23.243a6.678 6.678 0 0 0-10.052 0" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":'1.5px'}}/><circle cx="12" cy="15.336" r="4.125" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":"1.5px"}}/></svg>,
    },
    {
      id: "2",
      text: "Seamless and elegant",
      subText: "It's fun to work with",
      icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.621 17.879c1.589-1.9.1-4.338 1.513-5.981a2.759 2.759 0 1 1 4.179 3.6 6.5 6.5 0 0 1-5.692 2.381Z" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":"1.5px"}}/><path d="m16.6 12.291 6.231-8.253A2.038 2.038 0 1 0 19.377 1.9l-4.53 9.116M7.557 17.07c-5.3-1.343-3.222-4.116-5.557-4.116-3.036 0-.088 6.968 4.892 9.555a7.459 7.459 0 0 0 8.389-1.435l.081-.082" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":'1.5px'}}/></svg>,
    },
    {
      id: "3",
      text:"Secure and private",
      subText: "Your data is protected",
      icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.25 3.923v7.614A11.907 11.907 0 0 0 9.882 22.65l1.041.4a3 3 0 0 0 2.154 0l1.041-.4a11.907 11.907 0 0 0 7.632-11.113V3.923a1.487 1.487 0 0 0-.868-1.362A21.7 21.7 0 0 0 12 .75a21.7 21.7 0 0 0-8.882 1.811 1.487 1.487 0 0 0-.868 1.362Z" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":'1.5px'}}/><path d="M17.2 11.25a5.25 5.25 0 1 1-5.2-6" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":'1.5px'}}/><path d="m17.25 6.562-4.786 4.786a.657.657 0 0 1-.928 0l-1.5-1.505" style={{"fill":'none',"stroke":'currentColor',"stroke-linecap":'round',"stroke-linejoin":'round',"stroke-width":'1.5px'}}/></svg>,
    },
    {
      id: "4",
      text: "Anayltics and tracking",
      subText: "Understand your user's behavior",
      icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256"><path fill="none" d="M0 0h256v256H0z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M224 208H32V48"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m208 64-80 80-32-32-64 64"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M208 104V64h-40"/></svg>,
    },
  ]
}

List.craft = {
  props: ListDefaultProps,
  related: {
    settings: ListItemSettings,
  },
}


"use client"
import styled from "styled-components"

import { Element, useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Controller } from "../settings/controller.component"

const UserContainerGenInner = styled.div<{ position: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  padding: 40px;
  border-radius: none;
  box-shadow: none;
  flex: 1;
  background-color: "#000000";
  position: ${(props) => props.position};
  overflow-y: hidden;
  overflow-x: hidden;
  gap: 0px;
  border: 0px solid inherit;
  max-width: 100%;
`

export const UserContainerGen = ({
  padding,
  width,
  height,
  background,
  color,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  shadow,
  flexDirection,
  fillSpace,
  alignItems,
  justifyContent,
  containerType,
  flexWrap,
  children,
  overflowY,
  overflowX,
  gap,
  border,
  borderColor,
  ...props
}) => {
  return (
    <UserContainerGenInner
      position={containerType === "header" ? "fixed" : "relative"}
      // {...props}
      // style={{
      //   width: `${width}px`,
      //   height: `${height}px`,
      //   backgroundColor: `${background}`,
      //   color: `${color}`,
      //   marginLeft: `${marginLeft}px`,
      //   marginTop: `${marginTop}px`,
      //   marginRight: `${marginRight}px`,
      //   marginBottom: `${marginBottom}px`,
      //   paddingLeft: `${paddingLeft}px`,
      //   paddingTop: `${paddingTop}px`,
      //   paddingRight: `${paddingRight}px`,
      //   paddingBottom: `${paddingBottom}px`,
      //   borderRadius: `${radius}px`,
      //   flexDirection,
      //   alignItems: `${alignItems}`,
      //   justifyContent: `${justifyContent}`,
      //   flexWrap,
      //   padding: `${padding}px`,
      //   boxShadow:
      //     shadow === 0
      //       ? "none"
      //       : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
      //   flex: fillSpace == "1" ? 1 : "unset",
      //   display: "flex",
      //   overflowY,
      //   overflowX,
      //   gap: `${gap}px`,
      //   border: `${border}px solid ${borderColor}`,
      //   maxWidth: "100%",
      // }}
    >
      {/* {isHovered && <Controller nameOfComponent={"CONTAINER"} />} */}
      {children}
    </UserContainerGenInner>
  )
}

export const UserContainer = ({
  padding,
  width,
  height,
  background,
  color,
  marginLeft,
  marginTop,
  marginRight,
  containerType,
  marginBottom,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  shadow,
  flexDirection,
  fillSpace,
  alignItems,
  justifyContent,
  flexWrap,
  children,
  overflowY,
  overflowX,
  gap,
  border,
  borderColor,
  ...props
}) => {
  const {
    connectors: { connect, drag },
    selected,
    isHovered,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
    isHovered: state.events.hovered,
  }))
  const backgroundColor = useAppSelector(
    (state) => state?.theme?.general?.backgroundColor
  )
  const backgroundImage = useAppSelector(
    (state) => state?.theme?.general?.backgroundImage
  )
  return (
    <div ref={(ref: any) => connect(drag(ref))} data-cy="toolbox-usercontainer">
      <div
        {...props}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: `${backgroundColor}`,
          backgroundImage: `${backgroundImage}`,
          position: containerType === "header" ? "fixed" : "relative",
          color: `${color}`,
          marginLeft: `${marginLeft}px`,
          marginTop: `${marginTop}px`,
          marginRight: `${marginRight}px`,
          marginBottom: `${marginBottom}px`,
          paddingLeft: `${paddingLeft}px`,
          paddingTop: `${paddingTop}px`,
          paddingRight: `${paddingRight}px`,
          paddingBottom: `${paddingBottom}px`,
          borderRadius: `${radius}px`,
          flexDirection,
          alignItems: `${alignItems}`,
          justifyContent: `${justifyContent}`,
          flexWrap,
          padding: `${padding}px`,
          boxShadow:
            shadow === 0
              ? "none"
              : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
          flex: fillSpace == "1" ? 1 : "unset",
          display: "flex",
          overflowY,
          overflowX,
          gap: `${gap}px`,
          border: `${border}px solid ${borderColor}`,
          maxWidth: "100%",
        }}
      >
        {/* {isHovered && <Controller nameOfComponent={"CONTAINER"} />} */}
        {children}
      </div>
    </div>
  )
}

export const UserContainerSettings = () => {
  const {
    props: {
      padding,
      width,
      height,
      background,
      color,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      radius,
      shadow,
      flexDirection,
      fillSpace,
      alignItems,
      justifyContent,
      flexWrap,
      overflowY,
      overflowX,
      gap,
      borderColor,
      border,
    },
    actions: { setProp },
  } = useNode((node) => ({
    props: node.data.props,
  }))

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Dimensions </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Width</p>
              <Input
                defaultValue={width}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.width = e.target.value))
                }
              />
            </div>
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Height</p>
              <Input
                defaultValue={height}
                onChange={(e) =>
                  setProp((props) => (props.height = e.target.value))
                }
                className="w-full"
              />
            </div>
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Overflow X</p>
              <Select
                onValueChange={(e) => {
                  setProp((props) => (props.overflowX = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue className="capitalize" placeholder={overflowY} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="scroll">Scroll</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="style-control col-span-2 flex grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Overflow Y</p>
              <Select
                onValueChange={(e) => {
                  setProp((props) => (props.overflowY = e), 1000)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue className="capitalize" placeholder={overflowY} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="scroll">Scroll</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Colors </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control flex flex-col gap-2">
              <p className="text-md text-muted-foreground">Text</p>
              <Input
                type="color"
                value={color}
                onChange={(e) => {
                  setProp((props) => (props.color = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control flex flex-col gap-2">
              <p className="text-md text-muted-foreground">Background</p>
              <Input
                type="color"
                value={background}
                onChange={(e) => {
                  setProp((props) => (props.background = e.target.value), 1000)
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Margin </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
                placeholder={marginLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginLeft = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Input
                type="number"
                placeholder={marginTop}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginTop = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Input
                type="number"
                placeholder={marginRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.marginRight = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Input
                type="number"
                placeholder={marginBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.marginBottom = e.target.value),
                    1000
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Padding </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Left</p>
              <Input
                type="number"
                placeholder={paddingLeft}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.paddingLeft = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-1 flex w-1/2 grow-0 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Top</p>
              <Input
                type="number"
                placeholder={paddingTop}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.paddingTop = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Right</p>
              <Input
                type="number"
                placeholder={paddingRight}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.paddingRight = e.target.value),
                    1000
                  )
                }
              />
            </div>
            <div className="style-control flex w-1/2 basis-2/4 flex-col gap-2">
              <p className="text-md text-muted-foreground">Bottom</p>
              <Input
                type="number"
                placeholder={paddingBottom}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp(
                    (props) => (props.paddingBottom = e.target.value),
                    1000
                  )
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Decoration </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Border</p>
              <Input
                type="number"
                placeholder={border}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.border = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-2 flex flex-col gap-2">
              <p className="text-md text-muted-foreground">Border color</p>
              <Input
                type="color"
                value={borderColor}
                onChange={(e) => {
                  setProp((props) => (props.borderColor = e.target.value), 1000)
                }}
              />
            </div>
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Radius</p>
              <Input
                type="number"
                placeholder={radius}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.radius = e.target.value), 1000)
                }
              />
            </div>
            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Shadow</p>
              <Input
                type="number"
                placeholder={shadow}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.shadow = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2  hover:no-underline">
            <span className="text-sm font-medium">Alignment </span>
          </AccordionTrigger>
          <AccordionContent className="grid grid-cols-2 gap-2 p-2">
            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Direction</p>
              <RadioGroup
                defaultValue="column"
                onValueChange={(value) => {
                  setProp((props) => (props.flexDirection = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="column" id="r2" />
                  <Label htmlFor="r2">Column</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="row" id="r3" />
                  <Label htmlFor="r3">Row</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Fill Space</p>
              <RadioGroup
                defaultValue={fillSpace}
                onValueChange={(value) => {
                  setProp((props) => (props.fillSpace = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"1"} id="r2" />
                  <Label htmlFor="r2">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"0"} id="r3" />
                  <Label htmlFor="r3">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Align</p>
              <RadioGroup
                defaultValue={alignItems}
                onValueChange={(value) => {
                  setProp((props) => (props.alignItems = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"start"} id="r2" />
                  <Label htmlFor="r2">Start</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"center"} id="r3" />
                  <Label htmlFor="r3">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"end"} id="r4" />
                  <Label htmlFor="r4">End</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-1 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Justify</p>
              <RadioGroup
                defaultValue={justifyContent}
                onValueChange={(value) => {
                  setProp((props) => (props.justifyContent = value), 1000)
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"start"} id="r2" />
                  <Label htmlFor="r2">Start</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"center"} id="r3" />
                  <Label htmlFor="r3">Center</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={"end"} id="r4" />
                  <Label htmlFor="r4">End</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="style-control col-span-2 flex w-full flex-col gap-2">
              <p className="text-md text-muted-foreground">Gap</p>
              <Input
                type="number"
                placeholder={gap}
                max={100}
                min={0}
                className="w-full"
                onChange={(e) =>
                  setProp((props) => (props.gap = e.target.value), 1000)
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

{
  // container type can be container | header | footer
}
export const ContainerDefaultProps = {
  padding: 40,
  width: "400",
  height: "200",
  minHeight: "200px",
  minWidth: "400px",
  background: "transparent",
  containerType: "container",
  color: "inherit",
  marginLeft: "2",
  marginTop: "2",
  marginRight: "2",
  marginBottom: "2",
  paddingLeft: "4",
  paddingTop: "4",
  paddingRight: "4",
  paddingBottom: "4",
  radius: "none",
  shadow: "none",
  flexDirection: "column",
  fillSpace: "1",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "nowrap",
  overflowY: "hidden",
  overflowX: "hidden",
  gap: 0,
  border: 0,
  borderColor: "inherit",
}

UserContainer.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: UserContainerSettings,
  },
}

export const Container = ({ ...props }) => {
  const {
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  return (
    <div
      className="fixed border border-dashed border-transparent transition-all duration-200"
      // {...props}
      // ref={(ref: any) => ref && connect(drag(ref))}
    >
      {isHovered && <Controller nameOfComponent={"CONTAINER"} />}
      {/** @ts-ignore */}
      <Element
        canvas
        id="user-container"
        is={UserContainer}
        data-cy="user-container"
      ></Element>
    </div>
  )
}

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: UserContainerSettings,
  },
}

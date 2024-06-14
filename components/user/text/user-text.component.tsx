// import React, { useCallback, useEffect, useState, useRef } from "react";
// import ContentEditable from "react-contenteditable";
// import styled from "styled-components";
// import { throttle, debounce } from "lodash";
// import { useNode } from "@/lib/craftjs";
// import { useAppSelector } from "@/lib/state/flows-state/hooks";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Controller } from "../settings/controller.component";
// import { useTranslations } from "next-intl";
// import { cn } from "@/lib/utils";
// import { RootState } from "@/lib/state/flows-state/store";

// export const UserTextInputSettings = () => {
//   const t = useTranslations("Components");
//   const {
//     actions: { setProp },
//     props: {
//       text,
//       fontSize,
//       textAlign,
//       fontWeight,
//       marginLeft,
//       marginRight,
//       marginTop,
//       marginBottom,
//       textColor,
//       backgroundColor,
//       borderColor,
//       borderRadius,
//       padding,
//     },
//   } = useNode((node) => ({
//     props: node.data.props,
//   }));

//   const throttledSetProp = useCallback(
//     throttle((property, value) => {
//       setProp((prop) => { prop[property] = value }, 0);
//     }, 200), // Throttle to 50ms to 200ms
//     [setProp]
//   );

//   const handlePropChange = (property, value) => {
//     throttledSetProp(property, value);
//   };

//   const debouncedSetProp = useCallback(
//     debounce((property, value) => {
//       setProp((prop) => { prop[property] = value }, 0);
//     }), [setProp]
//   );

//   const handlePropChangeDebounced = (property, value) => {
//     debouncedSetProp(property, value);
//   };

//   return (
//     <>
//       <Accordion type="single" collapsible className="w-full">
//         <AccordionItem value="content">
//           <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//             <span className="text-sm font-medium">{t("Content")}</span>
//           </AccordionTrigger>
//           <AccordionContent className="p-2">
//             <Input
//               type="text"
//               value={text}
//               onChange={(e) => setProp((props) => (props.text = e.target.value))}
//               placeholder={t("Enter text")}
//               className="w-full"
//             />
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="design">
//           <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//             <span className="text-sm font-medium">{t("Design")}</span>
//           </AccordionTrigger>
//           <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
//             <div className="flex flex-row items-center col-span-2 space-x-2">
//               <label htmlFor="backgroundColor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3">
//                 {t("Background Color")}
//               </label>
//               <Input
//                 type="color"
//                 value={backgroundColor}
//                 onChange={(e) => handlePropChangeDebounced("backgroundColor", e.target.value)}
//                 className="basis-1/3"
//                 id="backgroundColor"
//               />
//             </div>
//             <div className="flex flex-row items-center col-span-2 space-x-2">
//               <label htmlFor="textColor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 basis-2/3">
//                 {t("Text Color")}
//               </label>
//               <Input
//                 type="color"
//                 value={textColor}
//                 onChange={(e) => handlePropChangeDebounced("textColor", e.target.value)}
//                 className="basis-1/3"
//                 id="textColor"
//               />
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="spacing">
//           <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//             <span className="text-sm font-medium">{t("Spacing")}</span>
//           </AccordionTrigger>
//           <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
//             {["marginTop", "marginBottom", "marginLeft", "marginRight"].map((prop) => (
//               <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2 items-start" key={prop}>
//                 <div className="flex w-full basis-full flex-row items-center gap-2 justify-between">
//                   <Label htmlFor={prop}>{t(prop.charAt(0).toUpperCase() + prop.slice(1))}</Label>
//                   <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
//                     {eval(prop)}
//                   </span>
//                 </div>
//                 <Slider
//                   defaultValue={[eval(prop)]}
//                   value={[eval(prop)]}
//                   max={100}
//                   min={0}
//                   step={1}
//                   onValueChange={(e) => handlePropChangeDebounced(prop, e)}
//                 />
//               </div>
//             ))}
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="border">
//           <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//             <span className="text-sm font-medium">{t("Border")}</span>
//           </AccordionTrigger>
//           <AccordionContent className="grid grid-cols-2 gap-y-2 p-2">
//             <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
//               <label htmlFor="borderColor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                 {t("Border Color")}
//               </label>
//               <Input
//                 type="color"
//                 value={borderColor}
//                 onChange={(e) => handlePropChangeDebounced("borderColor", e.target.value)}
//                 className="w-full"
//                 id="borderColor"
//               />
//             </div>
//             <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
//               <label htmlFor="borderRadius" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                 {t("Border Radius")}
//               </label>
//               <Input
//                 type="number"
//                 value={borderRadius}
//                 onChange={(e) => handlePropChangeDebounced("borderRadius", e.target.value)}
//                 className="w-full"
//                 id="borderRadius"
//               />
//             </div>
//           </AccordionContent>
//         </AccordionItem>

//         <AccordionItem value="typography">
//           <AccordionTrigger className="flex w-full basis-full flex-row flex-wrap justify-between p-2 hover:no-underline">
//             <span className="text-sm font-medium">{t("Typography")}</span>
//           </AccordionTrigger>
//           <AccordionContent className="grid grid-cols-2 gap-y-4 p-2">
//             <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
//               <label htmlFor="fontSize" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                 {t("Font Size")}
//               </label>
//               <Input
//                 type="number"
//                 value={fontSize}
//                 onChange={(e) => handlePropChangeDebounced("fontSize", e.target.value)}
//                 className="w-full"
//                 id="fontSize"
//               />
//             </div>
//             <div className="style-control col-span-2 flex w-full grow-0 basis-full flex-col gap-2">
//               <label htmlFor="fontWeight" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                 {t("Font Weight")}
//               </label>
//               <Select
//                 value={fontWeight}
//                 onValueChange={(e) => handlePropChange("fontWeight", e)}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select font weight" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>{t("Font Weight")}</SelectLabel>
//                     <SelectItem value="100">Thin</SelectItem>
//                     <SelectItem value="400">Normal</SelectItem>
//                     <SelectItem value="500">Medium</SelectItem>
//                     <SelectItem value="600">Semi-bold</SelectItem>
//                     <SelectItem value="700">Bold</SelectItem>
//                     <SelectItem value="800">Extra bold</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </>
//   );
// };

// const StyledTextInput = styled.div`
//   font-family: ${(props) => props.fontFamily};
//   font-size: ${(props) => props.fontSize}px;
//   font-weight: ${(props) => props.fontWeight};
//   color: ${(props) => props.textColor};
//   background-color: ${(props) => props.backgroundColor};
//   border: 1px solid ${(props) => props.borderColor};
//   border-radius: ${(props) => props.borderRadius}px;
//   padding: ${(props) => props.padding}px;
//   margin-top: ${(props) => props.marginTop}px;
//   margin-bottom: ${(props) => props.marginBottom}px;
//   margin-left: ${(props) => props.marginLeft}px;
//   margin-right: ${(props) => props.marginRight}px;
//   text-align: ${(props) => props.textAlign};
//   width: 100%;
//   box-sizing: border-box;
//   outline: none;
// `;

// export const UserTextInputGen = ({
//   text,
//   fontSize,
//   fontWeight,
//   textAlign,
//   marginLeft,
//   marginRight,
//   marginTop,
//   marginBottom,
//   textColor,
//   backgroundColor,
//   borderColor,
//   borderRadius,
//   padding,
//   ...props
// }) => {
//   return (
//     <StyledTextInput
//       fontSize={fontSize}
//       fontWeight={fontWeight}
//       textAlign={textAlign}
//       marginLeft={marginLeft}
//       marginRight={marginRight}
//       marginTop={marginTop}
//       marginBottom={marginBottom}
//       textColor={textColor}
//       backgroundColor={backgroundColor}
//       borderColor={borderColor}
//       borderRadius={borderRadius}
//       padding={padding}
//       {...props}
//     >
//       <ContentEditable
//         html={text}
//         disabled={false}
//         onChange={() => { }}
//         tagName="div"
//       />
//     </StyledTextInput>
//   );
// };

// export const UserTextInput = ({
//   text,
//   fontSize,
//   fontWeight,
//   textAlign,
//   marginLeft,
//   marginRight,
//   marginTop,
//   marginBottom,
//   textColor,
//   backgroundColor,
//   borderColor,
//   borderRadius,
//   padding,
//   ...props
// }) => {
//   const {
//     connectors: { connect, drag },
//     selected,
//     isHovered,
//     actions: { setProp },
//   } = useNode((state) => ({
//     selected: state.events.selected,
//     isHovered: state.events.hovered,
//   }));

//   const [editable, setEditable] = useState(false);

//   useEffect(() => {
//     if (selected) {
//       setEditable(true);
//     } else {
//       setEditable(false);
//     }
//   }, [selected]);

//   return (
//     <div
//       className="relative"
//       {...props}
//       ref={(ref) => ref && connect(drag(ref))}
//       onClick={() => setEditable(true)}
//     >
//       {isHovered && <Controller nameOfComponent={"TEXT_INPUT"} />}
//       <StyledTextInput
//         fontSize={fontSize}
//         fontWeight={fontWeight}
//         textAlign={textAlign}
//         marginLeft={marginLeft}
//         marginRight={marginRight}
//         marginTop={marginTop}
//         marginBottom={marginBottom}
//         textColor={textColor}
//         backgroundColor={backgroundColor}
//         borderColor={borderColor}
//         borderRadius={borderRadius}
//         padding={padding}
//         onClick={() => setEditable(true)}
//       >
//         <ContentEditable
//           html={text}
//           disabled={!editable}
//           onChange={(e) =>
//             setProp(
//               (props) => (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
//               500
//             )
//           }
//           tagName="div"
//         />
//       </StyledTextInput>
//     </div>
//   );
// };

// export const TextInputDefaultProps = {
//   text: "Your text here",
//   fontSize: 16,
//   fontWeight: "400",
//   textAlign: "left",
//   marginLeft: 0,
//   marginRight: 0,
//   marginTop: 0,
//   marginBottom: 0,
//   textColor: "#000000",
//   backgroundColor: "#ffffff",
//   borderColor: "#000000",
//   borderRadius: 4,
//   padding: 8,
// };

// UserTextInput.craft = {
//   rules: {
//     canMoveIn: () => true,
//   },
//   props: TextInputDefaultProps,
//   related: {
//     settings: UserTextInputSettings,
//   },
// };
import React, { useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { track } from "@vercel/analytics/react"
import { set } from "date-fns"
import { debounce, throttle } from "lodash"
import { useTranslations } from "next-intl"
import { darken, rgba } from "polished"
import ContentEditable from "react-contenteditable"
import styled from "styled-components"

import { useEditor, useNode } from "@/lib/craftjs"
import { navigateToScreen } from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

import { Controller } from "../settings/controller.component"
import { StyleProperty } from "../types/style.types"
import {
  getBackgroundForPreset,
  getHoverBackgroundForPreset,
} from "./useTextThemePresets"
import { UserTextInputSettings } from "./user-text-settings"

const IconButtonSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

const ButtonSizeValues = {
  small: ".8rem",
  medium: "1rem",
  large: "1.2rem",
}

const IconButtonMobileSizeValues = {
  small: "300px",
  medium: "330px",
  large: "360px",
  full: "100%",
}

const ButtonTextLimit = {
  small: 100,
  // small: 22,
  // medium: 30,
  // large: 40,
  // full: 82,

  medium: 100,
  large: 100,
  full: 100,
}
export const UserTextInputGen = ({
  fontFamily,
  size,
  buttonSize,
  color,
  text,  
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  containerBackground,
  marginBottom,
  background,
  backgroundHover,
  colorHover,
  icon,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  fontSize : fontSize,
  fontWeight : fontWeight,
  textAlign,
  backgroundColor,
  border,
  borderColor,
  borderHoverColor,
  ...props
}) => {
  const router = useRouter()
  const pathName = usePathname()
  const handleNavigateToContent = () => {
    // router.push(currentUrlWithHash);
  }
  return (
    <div
      className="w-full relative"
      style={{
        width: "100%",
        background: `${containerBackground}`,
        display: "flex",
        justifyContent: "center",
        minWidth: "100%",
        paddingTop: `${props.marginTop}px`,
        paddingBottom: `${props.marginBottom}px`,
        paddingLeft: `${props.marginLeft}px`,
        paddingRight: `${props.marginRight}px`,
      }}
    >
      <StyledCustomTextInput
        fontFamily={fontFamily?.value}
        color={color?.value}
        background={background?.value}
        backgroundHover={backgroundHover?.value}
        borderHoverColor={borderHoverColor?.value}
        colorHover={colorHover?.value}
        flexDirection={flexDirection}
        fontSize={fontSize.value}
        fontWeight={fontWeight.value}
        textAlign={textAlign?.value}
        justifyContent={justifyContent}
        borderColor={borderColor?.value}
        border={border}
        marginLeft={marginLeft}
        width={width}
        size={size}
        buttonSize={buttonSize}
        height={height}
        marginRight={marginRight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        paddingLeft={paddingLeft}
        paddingTop={paddingTop}
        paddingRight={paddingRight}
        paddingBottom={paddingBottom}
        alignItems={alignItems}
        gap={gap}
        mobileScreen={false}
        {...props}
        className="text-[1rem]"
        onClick={() => console.log(text)}
      >
        <p
          style={{
            maxWidth: "100%",
            transitionProperty: "all",
            overflowX: "clip",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </p>
      </StyledCustomTextInput>
    </div>
  )
}
interface StyleCustomTextContainerProps {
  fontFamily?: string
  color?: string
  background?: string
  backgroundHover?: string
  colorHover?: string
  size?: string
  buttonSize?: string
  marginLeft?: string | number
  width?: string | number
  height?: string | number
  marginRight?: string | number
  marginTop?: string | number
  marginBottom?: string | number
  paddingLeft?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  radius?: number
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  gap?: number
  border?: number
  borderColor?: string
  borderHoverColor?: string
  mobileScreen: boolean
  fontSize?: string
  fontWeight?: string
  textAlign?: string
  backgroundColor?: string
  borderRadius?: string
  padding?: string
  preset?: string
  settingsTab?: string
}
const StyledCustomTextInput = styled.div<StyleCustomTextContainerProps>`
  font-family: ${(props) => `var(${props?.fontFamily})`};
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 6px;
  font-size: ${(props) => ButtonSizeValues[props.buttonSize || "18px"]};
  font-weight: 400;
  border: 1px dashed transparent;
  transition: all 0.2s ease;

  &:hover {
    border-style: solid;
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired hover border color */
    background: ${(props) => props.backgroundHover};
    color: ${(props) => props.colorHover};
  }

  &:focus {
    border-color: ${(props) =>
      props.borderHoverColor}; /* Change to your desired focus border color */
  }

  background: ${(props) => props.background};
  color: ${(props) => props.color};
  overflow: hidden;
  max-width: ${(props) =>
    props.mobileScreen
      ? IconButtonMobileSizeValues[props.size || "medium"]
      : IconButtonSizeValues[props.size || "medium"]};
  width: 100%;
  box-sizing: border-box;
  height: ${(props) => props.height}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => ButtonSizeValues[props.buttonSize || "medium"]};
  border-radius: ${(props) => props.radius}px;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid ${(props) => props.borderColor};
  @media (max-width: 760px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 600px;
  }
  @media (max-width: 660px) {
    width: 100%; /* Make the button take the full width on smaller screens */
    max-width: 400px;
  }
`

export const UserText = ({
  fontFamily,
  borderHoverColor,
  size,
  buttonSize,
  color,
  text,
  marginLeft,
  width: width,
  height: height,
  marginRight,
  marginTop,
  marginBottom,
  fontSize,
  fontWeight,
  textAlign,
  backgroundColor,
  containerBackground,
  background,
  backgroundHover,
  colorHover,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  radius,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  border,
  borderColor,
  ...props
}) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const { actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }))
  const t = useTranslations("Components")
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [displayController, setDisplayController] = React.useState(false)
  const [buttonFullWidth, setButtonFullWidth] = React.useState(size === "full")
  const primaryTextColor = useAppSelector(
    (state) => state.theme?.text?.primaryColor
  )
  const secondaryTextColor = useAppSelector(
    (state) => state.theme?.text?.secondaryColor
  )
  const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont)
  const primaryColor = useAppSelector(
    (state) => state.theme?.general?.primaryColor
  )
  const secondaryColor = useAppSelector(
    (state) => state.theme?.general?.secondaryColor
  )
  const mobileScreen = useAppSelector((state) => state.theme?.mobileScreen)
  const screens = useAppSelector((state: RootState) => state?.screen?.screens)
  const screensLength = useAppSelector(
    (state: RootState) => state?.screen?.screens?.length ?? 0
  )
  const selectedScreen = useAppSelector(
    (state: RootState) => state.screen?.selectedScreen ?? 0
  )

  useEffect(() => {
    if (fontFamily.globalStyled && !fontFamily.isCustomized) {
      setProp((props) => (props.fontFamily.value = primaryFont), 200)
    }
  }, [primaryFont, fontFamily.globalStyled, fontFamily.isCustomized, setProp])

  useEffect(() => {
    if (primaryColor) {
      const backgroundPrimaryColor = getBackgroundForPreset(
        primaryColor,
        props.preset
      )
      const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(
        primaryColor,
        props.preset
      )

      if (background.globalStyled && !background.isCustomized) {
        setProp(
          (props) => (props.background.value = backgroundPrimaryColor),
          200
        )
      }
      if (color.globalStyled && !color.isCustomized) {
        setProp((props) => (props.color.value = primaryColor), 200)
      }
      if (borderColor.globalStyled && !borderColor.isCustomized) {
        setProp((props) => (props.borderColor.value = primaryColor), 200)
      }

      // hover colors

      if (backgroundHover.globalStyled && !backgroundHover.isCustomized) {
        setProp(
          (props) =>
            (props.backgroundHover.value = hoverBackgroundPrimaryColor),
          200
        )
      }
      if (borderHoverColor.globalStyled && !borderHoverColor.isCustomized) {
        setProp((props) => (props.borderHoverColor.value = primaryColor), 200)
      }
      if (colorHover.globalStyled && !colorHover.isCustomized) {
        setProp((props) => (props.colorHover.value = primaryColor), 200)
      }
    }
  }, [
    primaryColor,
    secondaryTextColor,
    primaryFont,
    background,
    color,
    borderColor,
    backgroundHover,
    borderHoverColor,
    colorHover,
    setProp,
    props.preset,
  ])
  const maxLength = ButtonTextLimit[size]
  const handleTextChange = (e) => {
    const value = e.target.innerText
    if (value.length <= maxLength) {
      setProp((props) => (props.text = value))
    } else {
      if (ref.current) {
        e.target.innerText = text || "" // Restore the previous text
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(ref.current)
        range.collapse(false) // Move cursor to the end
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }

  useEffect(() => {
    const currentRef = ref.current
    if (currentRef) {
      currentRef.addEventListener("input", handleTextChange)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("input", handleTextChange)
      }
    }
  }, [text, maxLength])
  const throttledSetProp = useCallback(
    throttle((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }, 200), // Throttle to 50ms to 200ms
    [setProp]
  )

  const handlePropChangeThrottled = (property, value) => {
    throttledSetProp(property, value)
  }

  const debouncedSetProp = useCallback(
    debounce((property, value) => {
      setProp((prop) => {
        prop[property] = value
      }, 0)
    }),
    [setProp]
  )

  const handlePropChangeDebounced = (property, value) => {
    debouncedSetProp(property, value)
  }
  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
      onMouseOver={() => setDisplayController(true)}
      onMouseOut={() => setDisplayController(false)}
    >
      {displayController && <Controller nameOfComponent={t("Text")} />}
      <div
        className="relative w-full"
        style={{
          background: `${containerBackground}`,
          display: "inline-flex",
          justifyContent: "center",
          boxSizing: "border-box",
          minWidth: "100%",
          maxWidth: "100%",
          paddingTop: `${props.marginTop}px`,
          paddingBottom: `${props.marginBottom}px`,
          paddingLeft: `${props.marginLeft}px`,
          paddingRight: `${props.marginRight}px`,
        }}
      >
        <StyledCustomTextInput
          fontFamily={fontFamily.value}
          color={color.value}
          background={background.value}
          backgroundHover={backgroundHover.value}
          colorHover={colorHover.value}
          radius={radius.value}
          flexDirection={flexDirection}
          fontSize={fontSize.value}
          fontWeight={fontWeight.value}
          textAlign={textAlign}
          justifyContent={justifyContent}
          borderColor={borderColor.value}
          borderHoverColor={borderHoverColor.value}
          border={border}
          marginLeft={marginLeft}
          mobileScreen={mobileScreen || false}
          width={width}
          height={height}
          marginRight={marginRight}
          marginTop={marginTop}
          marginBottom={marginBottom}
          paddingLeft={paddingLeft}
          paddingTop={paddingTop}
          paddingRight={paddingRight}
          paddingBottom={paddingBottom}
          alignItems={alignItems}
          gap={gap}
          size={size}
          buttonSize={buttonSize}
          {...props}
        >
          <div className="flex flex-col max-w-[100%] min-h-[16px] min-w-[32px] overflow-x-clip">
            <ContentEditable
              html={text}
              innerRef={ref}
              style={{
                maxWidth: "100%",
                transitionProperty: "all",
                overflowX: "clip",
                textOverflow: "ellipsis",
              }}
              className="min-w-16 border-transparent leading-relaxed border-dotted hover:border-blue-500"
              onChange={(e) => {
                handleTextChange(e)
              }}
              tagName="div"
            />
          </div>
        </StyledCustomTextInput>
      </div>
    </div>
  )
}

export enum IconButtonSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}

export type TextInputProps = {
  fontFamily: StyleProperty
  size: IconButtonSizes
  fontSize: StyleProperty
  fontWeight: StyleProperty
  textAlign: StyleProperty
  containerBackground: string
  background: StyleProperty
  backgroundHover: StyleProperty
  color: StyleProperty
  colorHover: StyleProperty
  text: string
  paddingLeft: string | number
  paddingTop: string | number
  paddingRight: string | number
  paddingBottom: string | number
  radius: StyleProperty
  flexDirection: string
  alignItems: string
  justifyContent: string
  gap: number
  border: number
  borderColor: StyleProperty
  borderHoverColor: StyleProperty
  marginLeft: number | number
  marginTop: number | number
  marginRight: number | number
  marginBottom: number | number
  width: string | number
  height: string | number
  fullWidth: boolean
  preset: string
  settingsTab: string
  buttonSize: string
}

export const TextInputDefaultProps: TextInputProps = {
  fontFamily: {
    value: "inherit",
    globalStyled: true,
    isCustomized: false,
  },
  containerBackground: "#ffffff",
  background: {
    value: "#4050ff",
    globalStyled: false,
    isCustomized: false,
  },
  color: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,
  },
  backgroundHover: {
    value: "#3182ce",
    globalStyled: false,
    isCustomized: false,
  },
  colorHover: {
    value: "#ffffff",
    globalStyled: false,
    isCustomized: false,
  },
  radius: {
    value: "0",
    globalStyled: false,
    isCustomized: false,
  },
  justifyContent: "center",
  borderColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  borderHoverColor: {
    value: "inherit",
    globalStyled: false,
    isCustomized: false,
  },
  width: "366",
  height: "auto",
  size: IconButtonSizes.medium,
  buttonSize: "medium",
  text: "Text Content",
  marginLeft: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  fontSize: {
    value: "16",
    globalStyled: false,
    isCustomized: false,
  },
  fontWeight: {
    value: "400",
    globalStyled: false,
    isCustomized: false,
  },
  textAlign: {
    value: "left",
    globalStyled: false,
    isCustomized: false,
  },
  paddingLeft: "16",
  paddingTop: "26",
  paddingRight: "16",
  paddingBottom: "26",
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  border: 0,
  fullWidth: true,
  preset: "filled",
  settingsTab: "content",
}

UserText.craft = {
  props: TextInputDefaultProps,
  related: {
    settings: UserTextInputSettings,
  },
}

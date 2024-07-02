import React from "react"
import { useTranslations } from "next-intl"
import styled from "styled-components"

import { Element, useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"

import { Button } from "../button/user-button.component"
import {
  Container,
  ContainerDefaultProps,
  UserContainerSettings,
} from "../container/user-container.component"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import { IconButton } from "../icon-button/user-icon-button.component"
import { UserInputCheckbox } from "../input-checkbox/user-input-checkbox.component"
import useInputMailThemePresets from "../input-email/useInputMailThemePresets"
import useInputCheckboxThemePresets from "../input-checkbox/useInputCheckboxThemePresets"
import {
  UserInputMail,
  UserInputMailGen,
} from "../input-email/user-input-mail.component"
import formPresetPhone from "../input-phone/useInputPhoneThemePresets"
import { UserInputPhone } from "../input-phone/user-input-phone.component"
import formPreset from "../input/useInputThemePresets"
import { UserInput } from "../input/user-input.component"
import { Controller } from "../settings/controller.component"
import { UserText } from "../text/user-text.component"
import { FormSettings } from "./user-form-settings"

interface FormOuterStyles {
  fullWidth: boolean
  width: string
  height: string
  background: string
  color: string
  marginLeft: string
  marginTop: string
  marginRight: string
  marginBottom: string
  paddingLeft: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  radius: string
  flexDirection: string
  fillSpace: string
  alignItems: string
  justifyContent: string
  flexWrap: "wrap" | "nowrap"
  overflowY: string
  overflowX: string
  gap: number
  border: number
  borderColor: string
}

const FormContentOuter = styled.div<FormOuterStyles>`
  width: "100%";
  flex-shrink: 0;
  flex-basis: 100%;
  min-width: 100%;
  height: auto;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  padding-left: ${(props) => props.paddingLeft}px;
  padding-top: ${(props) => props.paddingTop}px;
  padding-right: ${(props) => props.paddingRight}px;
  padding-bottom: ${(props) => props.paddingBottom}px;
  border-radius: ${(props) => props.radius};
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  flex: ${(props) => props.fillSpace};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  flex-wrap: ${(props) => props.flexWrap};
  overflow-y: ${(props) => props.overflowY};
  overflow-x: ${(props) => props.overflowX};
  gap: ${(props) => props.gap}px;
  border: ${(props) => props.border}px solid;
  border-color: ${(props) => props.borderColor};
`

interface FormInnerStyles {
  width: string
  direction: string
  size: string
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
  gap: string
  mobileFlexDirection: string
  alignItems: string
  justifyContent: string
  mobileAlignItems: string
  mobileJustifyContent: string
}

const FormContentInner = styled.form<FormInnerStyles>`
  max-width: ${(props) => CardSizeValues[props.size || "medium"]};
  width: 100%;
  display: flex;
  padding-top: ${(props) => props.marginTop}px;
  padding-bottom: ${(props) => props.marginBottom}px;
  margin-left: ${(props) => props.marginLeft}px;
  margin-right: ${(props) => props.marginRight}px;
  flex-direction: ${(props) => props.direction};
  flex: 1;
  align-items: ${(props) => props.alignItems};

  justify-content: ${(props) => props.justifyContent};
  flex-wrap: nowrap;
  gap: ${(props) => props.gap}px;
  height: auto;
  @media (max-width: 768px) {
    flex-direction: ${(props) => props.mobileFlexDirection};
    align-items: ${(props) => props.mobileAlignItems};
    justify-content: ${(props) => props.mobileJustifyContent};
  }
`




export const FormContentGen = ({ children, ...props }) => {
  return (
    <FormContentOuter
      fullWidth={props.fullWidth}
      width={props.width}
      height={props.height}
      background={props.background}
      color={props.color}
      marginLeft={props.marginLeft}
      marginTop={props.marginTop}
      marginRight={props.marginRight}
      marginBottom={props.marginBottom}
      paddingLeft={props.paddingLeft}
      paddingTop={props.paddingTop}
      paddingRight={props.paddingRight}
      paddingBottom={props.paddingBottom}
      radius={props.radius}
      flexDirection={props.flexDirection}
      fillSpace={props.fillSpace}
      alignItems={props.alignItems}
      justifyContent={props.justifyContent}
      flexWrap={props.flexWrap}
      overflowY={props.overflowY}
      overflowX={props.overflowX}
      gap={props.gap}
      border={props.border}
      borderColor={props.borderColor}
    >
      <FormContentInner
        size={props.size}
        width={props.width}
        gap={props.gap}
        alignItems={props.alignItems}
        justifyContent={props.justifyContent}
        mobileAlignItems={props.mobileAlignItems}
        mobileJustifyContent={props.mobileJustifyContent}
        direction={props.flexDirection || "column"}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        mobileFlexDirection={props.mobileFlexDirection}
      >
        {children}
      </FormContentInner>
    </FormContentOuter>
  )
}
export const FormContent = ({ children, ...props }) => {
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const { outlinedPresetMail, underlinedPresetMail } =
    useInputMailThemePresets()
  const { outLinePreset, filledPreset} = useButtonThemePresets()   

    const t = useTranslations("Components")

  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{ width: "100%", height: "100%" }}
      className={`${
        isHovered ? "border border-blue-500 border-dotted" : ""
      } border border-transparent relative`}
    >
      <FormContentGen
        fullWidth={props.fullWidth}
        width={props.width}
        height={props.height}
        background={props.background}
        color={props.color}
        marginLeft={props.marginLeft}
        marginTop={props.marginTop}
        marginRight={props.marginRight}
        marginBottom={props.marginBottom}
        mobileFlexDirection={props.mobileFlexDirection}
        size={props.size}
        paddingLeft={props.paddingLeft}
        paddingTop={props.paddingTop}
        paddingRight={props.paddingRight}
        paddingBottom={props.paddingBottom}
        radius={props.radius}
        flexDirection={
          mobileScreen ? props.mobileFlexDirection : props.flexDirection
        }
        fillSpace={props.fillSpace}
        alignItems={mobileScreen ? props.mobileAlignItems : props.alignItems}
        justifyContent={
          mobileScreen ? props.mobileJustifyContent : props.justifyContent
        }
        flexWrap={props.flexWrap}
        overflowY={props.overflowY}
        overflowX={props.overflowX}
        gap={props.gap}
        border={props.border}
        borderColor={props.borderColor}
        mobileAlignItems={props.mobileAlignItems}
        mobileJustifyContent={props.mobileJustifyContent}
      >
        {" "}
        <div className="flex w-full">
          <Element
            canvas
            id="user-input-name"
            is={UserInput}
            {...formPreset}
            label={t("FirstName")}
            placeholder="Enter your first name"
            floatingLabel={true}
            backgroundColor={"transparent"}
            marginBottom={0}
            marginTop={0}
            size={"100%"}
          />
          <Element
            canvas
            id="user-input-lastname"
            is={UserInput}
            floatingLabel={true}
            {...formPreset}
            label={t("LastName")}
            placeholder="Enter your last name"
            backgroundColor={"transparent"}
            marginBottom={0}
            marginleft={10}
            marginTop={0}
            size={"100%"}

          />
        </div>
        <Element
          canvas
          id="user-input-mail"
          is={UserInputMail}
          {...outlinedPresetMail}
          floatingLabel={true}
          marginTop={0}
          marginBottom={0}
          label= {t("EmailLabel")}
          fieldName= {t("EmailFieldName")}

        />
        <Element
          canvas
          id="user-input-phone"
          is={UserInputPhone}
          {...formPresetPhone}
          floatingLabel={true}
          backgroundColor={"transparent"}
          icon={"phone-telephone-android-phone-mobile-device-smartphone-iphone"}
          marginTop={0}
          marginBottom={0}
          label= {t("PhoneLabel")}
          fieldName= {t("PhoneFieldName")}

        />
        <Element
          canvas
          id="user-input-checkbox"
          is={UserInputCheckbox}
          marginTop={0}
          marginBottom={0}
          label= {t("CheckboxPlaceholder")}
          fieldName= {t("CheckboxFieldName")}
      
        />
        <Element
          canvas
          id="user-input-submit-button"
          is={IconButton}
          {...filledPreset}
          marginTop={0}
          marginBottom={0}
          text={t("Submit")}
          gap={220}
        />
        {children}
      </FormContentGen>
    </div>
  )
}
export enum CardSizes {
  small = "small",
  medium = "medium",
  large = "large",
  full = "full",
}
const CardSizeValues = {
  small: "300px",
  medium: "376px",
  large: "576px",
  full: "100%",
}

export type FormContentDefaultPropsTypes = {
  fullWidth: boolean
  width: string
  height: string
  background: string
  color: string
  marginLeft: string
  marginTop: string
  marginRight: string
  marginBottom: string
  paddingLeft: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  radius: string
  flexDirection: string
  fillSpace: string
  alignItems: string
  justifyContent: string
  mobileAlignItems: string
  mobileJustifyContent: string
  flexWrap: string
  overflowY: string
  overflowX: string
  gap: number
  border: number
  borderColor: string
  size: CardSizes
  mobileFlexDirection: string
  settingsTab: string
}
export const FormContentDefaultProps: FormContentDefaultPropsTypes = {
  fullWidth: true,
  width: "400",
  height: "200",
  background: "transparent",
  color: "#000000",
  marginLeft: "2",
  marginTop: "2",
  marginRight: "2",
  marginBottom: "2",
  paddingLeft: "12",
  paddingTop: "40",
  paddingRight: "12",
  paddingBottom: "40",
  radius: "none",
  flexDirection: "column",
  mobileFlexDirection: "column",
  fillSpace: "1",
  alignItems: "center",
  mobileAlignItems: "center",
  mobileJustifyContent: "center",
  justifyContent: "center",
  flexWrap: "nowrap",
  overflowY: "hidden",
  overflowX: "hidden",
  gap: 5,
  border: 0,
  borderColor: "inherit",
  size: CardSizes.medium,
  settingsTab: "layout",
}

FormContent.craft = {
  props: FormContentDefaultProps,
  displayName: "Form Content",
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canDragIn: () => true,
    canDragOut: () => true,
    isDeleteAble: () => true,
  },
  related: {
    settings: FormSettings,
  },
}

const FormContainer = styled.form<{
  background: string
}>`
  background: ${({ background }) => background};
  max-width: fit-content;
  width: 100%;
`
export const FormGen = ({ children, ...props }) => {
  return <div style={{ width: "100%", height: "100%" }}>{children}</div>
}

export const Form = ({ children, ...props }) => {
  const [hover, setHover] = React.useState(false)
  const {
    actions: { setProp },
    connectors: { connect, drag },
    selected,
    isHovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHovered: state.events.hovered,
  }))
  const t = useTranslations("Components")
  return (
    <FormContainer
      background={props.background}
      className="card-container relative shrink-0 basis-full min-w-full flex justify-center items-center flex-col"
      ref={(ref: any) => connect(drag(ref))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ minWidth: "100%", height: "100%" }}
    >
      {hover && <Controller nameOfComponent={t("Form")} />}
      <Element
        canvas
        id="formcard"
        is={FormContent}
        data-cy="form-content"
        className=""
      >
        {children}
      </Element>
    </FormContainer>
  )
}

Form.craft = {
  props: FormContentDefaultProps,
  displayName: "Form",
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canDragIn: () => true,
    canDragOut: () => true,
  },
}

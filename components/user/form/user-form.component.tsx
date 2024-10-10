"use client"

import React from "react"
import { transform } from "next/dist/build/swc"
import hexoid from "hexoid"
import { useTranslations } from "next-intl"
import styled from "styled-components"

import { Element, useNode } from "@/lib/craftjs"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"

import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import { IconButton } from "../icon-button/user-icon-button.component"
import useInputCheckboxThemePresets from "../input-checkbox/useInputCheckboxThemePresets"
import { UserInputCheckbox } from "../input-checkbox/user-input-checkbox.component"
import useInputMailThemePresets from "../input-email/useInputMailThemePresets"
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
  overflow: string
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
  overflow: visible;
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
  overflow: string
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
  overflow: visible;
  .text-input-comp {
    width: 100%;
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
      overflow="visible"
      id={props.id}
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
        overflow="visible"
        onSubmit={(e) => {
          e.preventDefault()
          console.log("submitted")
        }}
        id={props.id}
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

  const t = useTranslations("Components")

  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)

  return (
    <div
      ref={(ref: any) => connect(drag(ref))}
      style={{ width: "100%", height: "100%" }}
      className={cn(
        `relative`
        // isHovered ? "border border-dotted border-blue-500" : ""
      )}
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
        overflow="visible"
        id={props.id}
      >
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
  id: string
}

export const FormContentDefaultProps: FormContentDefaultPropsTypes = {
  fullWidth: true,
  width: "400",
  height: "200",
  background: "transparent",
  color: "#000000",
  marginLeft: "0",
  marginTop: "20",
  marginRight: "0",
  marginBottom: "20",
  paddingLeft: "12",
  paddingTop: "0",
  paddingRight: "12",
  paddingBottom: "0",
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
  id: `form-${hexoid(6)()}`,
}

FormContent.craft = {
  props: FormContentDefaultProps,
  displayName: "Form Content",
  id: `form-${hexoid(6)()}`,
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

const FormContainer = styled.div<{
  background: string
}>`
  background: ${({ background }) => background};
  max-width: fit-content;
  width: 100%;

  .text-input-comp,
  .email-input-comp,
  .phone-input-comp,
  .checkbox-input-comp,
  .textarea-input-comp,
  .button-input-comp,
  .mcq-input-comp,
  .separator-comp,
  .progress-comp,
  .user-headline-comp,
  .user-text-comp,
  .user-picture-choice-component,
  .logobar-comp,
  .user-list-comp,
  .user-checklist-comp {
    width: 100%;
  }
`
const FormGenWrapper = styled.div<{}>`
  width: 100%;
  height: 100%;
  .text-input-comp,
  .email-input-comp,
  .phone-input-comp,
  .checkbox-input-comp,
  .textarea-input-comp,
  .button-input-comp,
  .mcq-input-comp,
  .separator-comp,
  .progress-comp,
  .user-headline-comp,
  .user-text-comp,
  .user-picture-choice-component,
  .logobar-comp,
  .user-list-comp,
  .user-checklist-comp {
    width: 100%;
  }
`
export const FormGen = ({ children, ...props }) => {
  return <FormGenWrapper>{children}</FormGenWrapper>
}

export const Form = ({ children, ...props }) => {
  const [hover, setHover] = React.useState(false)
  const [innerHover, setInnerHover] = React.useState(false)
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
  const { outlinedPresetMail, underlinedPresetMail } =
    useInputMailThemePresets()
  const { outLinePreset, filledPreset, formPreset } = useButtonThemePresets()
  const mobileScreen = useAppSelector((state) => state?.theme?.mobileScreen)

  const adjustWidth = props.size

  return (
    <FormContainer
      background={props.background}
      className="card-container relative flex w-[800px] min-w-full shrink-0 basis-full flex-col items-center justify-center overflow-visible"
      ref={(ref: any) => connect(drag(ref))}
      onMouseEnter={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        setHover(false)
      }}
      style={{ minWidth: "100%", height: "100%" }}
      id={props.id}
    >
      {hover && <Controller nameOfComponent={t("Form")} />}
      <Element
        canvas
        data-answer={props.label}
        data-value={props.inputValue}
        id={props.id}
        // id="form-container"
        is={FormContent}
        data-cy="form-content"
        gap="5"
        ref={(ref: any) => connect(drag(ref))}
        style={{ width: "100%", height: "100%" }}
        className={` relative border border-transparent`}
      >
        {innerHover && <Controller nameOfComponent={t("Input Container")} />}
        <Element
          canvas
          id="text-input-container"
          is={FormContent}
          paddingTop={"0"}
          fillSpace={"0"}
          paddingBottom={"0"}
          paddingLeft={"0"}
          paddingRight={"0"}
          size={"full"}
          data-cy-="form-content-input-container"
          flexDirection={"row"}
          mobileFlexDirection={"row"}
          marginRight={"0"}
          marginLeft={"-2"}
          marginBottom={"0"}
          marginTop={"0"}
          style={{ overflow: "visible" }}
        >
          <Element
            canvas
            is={UserInput}
            {...formPreset}
            label={t("FirstName")}
            placeholder="Enter your first name"
            floatingLabel={true}
            backgroundColor={"transparent"}
            borderColor="transparent"
            marginBottom={0}
            marginleft={0}
            marginRight={0}
            marginTop={0}
            size={"full"}
            enableIcon={false}
            style={{ overflow: "visible" }}
          />
          <Element
            canvas
            is={UserInput}
            floatingLabel={true}
            {...formPreset}
            label={t("LastName")}
            placeholder="Enter your last name"
            backgroundColor={"transparent"}
            borderColor="transparent"
            marginBottom={0}
            marginleft={0}
            paddingRight={0}
            marginRight={0}
            marginTop={0}
            enableIcon={false}
            size={"full"}
            style={{ overflow: "visible" }}
          />
        </Element>
        <Element
          canvas
          is={UserInputMail}
          {...outlinedPresetMail}
          floatingLabel={true}
          marginTop={0}
          marginBottom={0}
          paddingRight={"4px"}
          label={t("EmailLabel")}
          fieldName={t("EmailFieldName")}
          size={"full"}
        />
        <Element
          canvas
          is={UserInputPhone}
          {...formPresetPhone}
          floatingLabel={true}
          backgroundColor={"transparent"}
          icon={"phone-telephone-android-phone-mobile-device-smartphone-iphone"}
          marginTop={0}
          marginBottom={0}
          label={t("PhoneLabel")}
          fieldName={t("PhoneFieldName")}
          size={"full"}
        />
        <Element
          canvas
          is={UserInputCheckbox}
          marginTop={0}
          marginBottom={0}
          label={t("CheckboxPlaceholder")}
          fieldName={t("CheckboxFieldName")}
          inputRequired={false}
          size={"full"}
        />
        <Element
          canvas
          is={IconButton}
          {...formPreset}
          marginTop={0}
          marginBottom={0}
          size={"full"}
          onClick={(e) => {
            e.preventDefault()
            console.log("clicked")
          }}
        />

        {children}
      </Element>
    </FormContainer>
  )
}

Form.craft = {
  props: FormContentDefaultProps,
  displayName: "Form",
  id: `form-${hexoid(6)()}`,
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canDragIn: () => true,
    canDragOut: () => true,
  },
}

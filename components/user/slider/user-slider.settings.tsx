import React, { useCallback, useEffect } from "react"
import {
    MoveHorizontal,
    Minus,
    Ellipsis,
    Info,
} from "lucide-react"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/custom-tabs"
import { useTranslations } from "next-intl"

import { throttle, debounce } from "lodash"
import { useNode } from "@/lib/craftjs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"
import useButtonThemePresets from "../icon-button/useButtonThemePresets"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { cn } from "@/lib/utils"
import {
    useScreenNames,
    useScreensLength,
} from "@/lib/state/flows-state/features/screenHooks"
import { RootState } from "@/lib/state/flows-state/store"
import Image from "next/image"

import dash_icon from "@/assets/images/dash_icon_new.svg"
import dash_icon_selected from "@/assets/images/dash_icon_selected.svg"
import { ColorInput } from "@/components/color-input"
import { Checkbox } from "@/components/custom-checkbox"

export const SliderBarSettings = () => {
    const t = useTranslations("Components")
    const screensLength: number = useScreensLength() ?? 0
    const selectedScreen = useAppSelector(
        (state: RootState) => state.screen?.selectedScreen ?? 0
    )

    const {
        actions: { setProp },
        props: {
            enableIcon,
            props,
            size,
            buttonSize,
            containerBackground,
            background,
            backgroundHover,
            colorHover,
            color,
            text,
            custom,
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
            border,
            borderColor,
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            width,
            height,
            settingsTab,
            preset,
            tracking,
            trackingEvent,
            nextScreen,
            buttonAction,
            progressStyle,
            progressvalue,
            maxValue,
            showLabel,
            bottomLabel,
            lowerLimit,
            upperLimit,
            stepsize,
            prefix,
            suffix,
            sliderColor,
            defaultValue
        },
    } = useNode((node) => ({
        props: node.data.props,
    }))

    const throttledSetProp = useCallback(
        throttle((property, value) => {
            setProp((prop) => {
                prop[property] = value
            }, 0)
        }, 200), // Throttle to 50ms to 200ms
        [setProp]
    )

    const handlePropChange = (property, value) => {
        throttledSetProp(property, value)
    }
    const isHeaderFooterMode = useAppSelector(
        (state: RootState) => state?.screen?.footerMode || state?.screen?.headerMode
    )
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

    const themeBackgroundColor = useAppSelector(
        (state) => state?.theme?.general?.backgroundColor
    )
    useEffect(() => {
        // if (progressvalue !== 1 && maxValue !== 5) {
        debouncedSetProp("maxValue", screensLength)
        if (progressvalue > screensLength) {
            debouncedSetProp("progressvalue", screensLength)
            // }
        }
    }, [screensLength])

    const numberInputHandler = (key: string, value: string): void => {

        const newValue = value;

        if (newValue === "") {
            setProp((props) => (props[key] = key === "upperLimit" ? lowerLimit + 1 : 0), 200);
        } else {

            const parsedValue = parseInt(newValue, 10);

            if (!isNaN(parsedValue)) {
                setProp((props) => (props[key] = parsedValue), 200);
            }

        }

    }

    return (
        <Accordion
            value={settingsTab || "content"}
            onValueChange={(value) => {
                setProp((props) => (props.settingsTab = value), 200)
            }}
            type="multiple"
            defaultValue={["content"]}
            className="w-full"
        >
            <AccordionItem value="content">
                <AccordionTrigger>{t("General")}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={showLabel}
                            onCheckedChange={(e) => {
                                setProp((props) => (props.showLabel = e), 200)

                                // setProp((props) => (props.error = !props.error),200)
                            }}
                            id="label"
                        />
                        <label
                            htmlFor="label"
                            className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {t("Show Label")}
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={bottomLabel}
                            onCheckedChange={(e) => {
                                setProp((props) => (props.bottomLabel = e), 200)

                                // setProp((props) => (props.error = !props.error),200)
                            }}
                            id="bottomLabel"
                        />
                        <label
                            htmlFor="bottomLabel"
                            className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {t("Bottom Label")}
                        </label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lowerLimit">{t("Lower Limit")}</Label>
                        <Input
                            id="lowerLimit"
                            value={lowerLimit === 0 ? "" : lowerLimit}
                            onChange={(e) =>
                                numberInputHandler("lowerLimit", e.target.value)
                            }
                            type="text"
                            placeholder={t("Enter lower limit here")}
                            min={0}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lowerLimit">{t("Upper Limit")}</Label>
                        <Input
                            id="lowerLimit"
                            value={upperLimit === 0 ? "" : upperLimit}
                            onChange={(e) =>
                                numberInputHandler("upperLimit", e.target.value)
                            }
                            type="text"
                            placeholder={t("Enter upper limit here")}
                            min={lowerLimit + 1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lowerLimit">{t("Default Value")}</Label>
                        <Input
                            id="defaultValue"
                            value={defaultValue}
                            onChange={(e) =>
                                setProp((prop) => (prop.defaultValue = parseInt(e.target.value)), 200)
                            }
                            type="number"
                            placeholder={t("Enter default value")}
                            min={lowerLimit}
                            max={upperLimit}
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="filled-elements">
                                {t("Step Size")}
                            </Label>
                            <span className="text-muted-foreground text-xs">
                                {stepsize}
                            </span>
                        </div>
                        <Slider
                            // defaultValue={[progressvalue]}
                            value={[stepsize]}
                            max={5}
                            min={1}
                            step={1}
                            onValueChange={(e) =>
                                // setProp((props) => (props.marginTop = e),200)
                                // handlePropChange("marginTop",e)
                                handlePropChangeDebounced("stepsize", e[0])
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prefix">{t("Prefix")}</Label>
                        <Input
                            id="prefix"
                            value={prefix}
                            onChange={(e) =>
                                setProp((prop) => (prop.prefix = e.target.value), 200)
                            }
                            type="text"
                            placeholder={t("Enter prefix here")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suffix">{t("Suffix")}</Label>
                        <Input
                            id="suffix"
                            value={suffix}
                            onChange={(e) =>
                                setProp((prop) => (prop.suffix = e.target.value), 200)
                            }
                            type="text"
                            placeholder={t("Enter suffix here")}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="design">
                <AccordionTrigger>{t("Design")}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="backgroundcolor">{t("Background Color")}</Label>
                        <ColorInput
                            value={containerBackground}
                            handleChange={(e) => {
                                debouncedSetProp("containerBackground", e.target.value)
                            }}
                            handleRemove={() => {
                                debouncedSetProp("containerBackground", "transparent")
                            }}
                            id="backgroundcolor"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="slidercolor">{t("Slider Color")}</Label>
                        <ColorInput
                            value={sliderColor}
                            handleChange={(e) => {
                                debouncedSetProp("sliderColor", e.target.value)
                            }}
                            handleRemove={() => {
                                debouncedSetProp("sliderColor", "")
                            }}
                            id="slidercolor"
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="spacing">
                <AccordionTrigger>{t("Spacing")}</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-2">
                    <div className="space-y-2">
                        <Label>{t("Width")}</Label>
                        <Tabs
                            value={size}
                            defaultValue={size}
                            onValueChange={(value) => {
                                setProp((props) => (props.size = value), 1000)
                            }}
                        >
                            <TabsList className="grid w-full grid-cols-4 bg-[#EEEEEE]">
                                <TabsTrigger
                                    className="rounded text-base leading-4"
                                    value="small"
                                >
                                    {t("S")}
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded text-base leading-4"
                                    value="medium"
                                >
                                    {t("M")}
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded text-base leading-4"
                                    value="large"
                                >
                                    {t("L")}
                                </TabsTrigger>
                                <TabsTrigger
                                    className="rounded text-base leading-4"
                                    value="full"
                                >
                                    <MoveHorizontal size={16} />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>{t("Top")}</Label>
                                <span className="text-muted-foreground text-xs">
                                    {marginTop}
                                </span>
                            </div>
                            <Slider
                                className=""
                                defaultValue={[marginTop]}
                                value={[marginTop]}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(e) =>
                                    handlePropChangeDebounced("marginTop", e)
                                }
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>{t("Bottom")}</Label>
                                <span className="text-muted-foreground text-xs">
                                    {marginBottom}
                                </span>
                            </div>
                            <Slider
                                defaultValue={[marginBottom]}
                                value={[marginBottom]}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(e) =>
                                    handlePropChangeDebounced("marginBottom", e)
                                }
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>{t("Right")}</Label>
                                <span className="text-muted-foreground text-xs">
                                    {marginRight}
                                </span>
                            </div>
                            <Slider
                                defaultValue={[marginRight]}
                                value={[marginRight]}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(e) =>
                                    handlePropChangeDebounced("marginRight", e)
                                }
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>{t("Left")}</Label>
                                <span className="text-muted-foreground text-xs">
                                    {marginLeft}
                                </span>
                            </div>
                            <Slider
                                defaultValue={[marginLeft]}
                                value={[marginLeft]}
                                max={100}
                                min={0}
                                step={1}
                                onValueChange={(e) =>
                                    handlePropChangeDebounced("marginLeft", e)
                                }
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

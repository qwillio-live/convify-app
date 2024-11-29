import { useNode } from "@craftjs/core"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { throttle, debounce } from "lodash"

import {
    MoveHorizontal,
    GripVertical,
    Trash2,
    Plus,
    Image,
    Trash,
    ChevronDown,
    CloudCog,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { ColorInput } from "@/components/color-input"
import { Checkbox } from "@/components/custom-checkbox"

function getYouTubeEmbedLink(url) {
    // Regular expressions for different YouTube URL formats
    const regexes = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
        /(?:https?:\/\/)?youtu\.be\/([^?]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/
    ];

    for (const regex of regexes) {
        const match = url.match(regex);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }
    return url

}


export const YoutubeVideoSettings = () => {
    const t = useTranslations("Components")
    const {
        actions: { setProp },
        props: {
            textColor,
            secTextColor,
            titleFontFamily,
            descriptionFontFamily,
            size,
            verticalGap,
            iconColor,
            titleColor,
            contentColor,
            containerBackground,
            paddingLeft,
            paddingTop,
            paddingRight,
            paddingBottom,
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            columnsDesktop,
            columnsMobile,
            flexDirection,
            blockColor,
            fullWidth,
            settingTabs,
            showControls,
            iconType,
            items,
            link,
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

    const debouncedSetProp = useCallback(
        debounce((property, value) => {
            console.log(value, "look here")
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
        <>
            <Accordion
                value={settingTabs || ["content"]}
                onValueChange={(value) => {
                    setProp((props) => (props.settingTabs = value), 200)
                }}
                type="multiple"
                defaultValue={settingTabs || ["content"]}
                className="w-full"
            >

                <AccordionItem value="content">
                    <AccordionTrigger>{t("Content")}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>{t("Video link")}</Label>
                            <Input
                                value={link}
                                placeholder={t("Enter YouTube video link")}
                                onChange={(e) => {
                                    handlePropChangeDebounced("link", getYouTubeEmbedLink(e.target.value))
                                }}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={!showControls}
                                onCheckedChange={(e) => {
                                    handlePropChange("showControls", !e)
                                }}
                                id="hide-controls"
                            />
                            <label
                                htmlFor="hide-controls"
                                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t("Hide controls")}
                            </label>
                        </div>

                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="design">
                    <AccordionTrigger>{t("Design")}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label>{t("Background Color")}</Label>
                            <ColorInput
                                value={containerBackground}
                                handleChange={(value) => {
                                    debouncedSetProp("containerBackground", value)
                                }}
                                handleRemove={() => {
                                    debouncedSetProp("containerBackground", "transparent")
                                }}
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
        </>
    )
}

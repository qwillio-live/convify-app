'use client'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/custom-select"
import { useScreenNames, useScreensLength } from "@/lib/state/flows-state/features/screenHooks"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { RootState } from "@/lib/state/flows-state/store"
import { useNode } from "@craftjs/core"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { throttle, debounce } from "lodash"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { CloudCog, MoveHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/custom-slider"
import { Checkbox } from "@/components/custom-checkbox"
import hexoid from "hexoid"
import { ColorInput } from "@/components/color-input"
import { LinksPreset, useLinksThemePresets } from "./useLinksThemePresets"
import { LinksGen } from "./user-links.component"
import { PRIVACY_URL } from "@/constant"


const APP_URL =
    process.env.NEXT_PUBLIC_DOMAIN_URL || "https://conv-hassan.picreel.bid"

export const LinksSettings = () => {
    const t = useTranslations("Components")
    const screenNames = useScreenNames()
    console.log("SCREEN NAMES: ", screenNames)
    const screensLength = useScreensLength()
    const selectedScreen = useAppSelector(
        (state: RootState) => state.screen?.selectedScreen ?? 0
    )

    const { boldPreset, defaultPresets } = useLinksThemePresets()
    const {
        actions: { setProp },
        props: {
            size,
            containerBackground,
            marginLeft,
            showDots,
            marginTop,
            marginRight,
            marginBottom,
            settingsTab,
            preset,
            tracking,
            textColor,
            links,
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
            setProp((prop) => {
                prop[property] = value
            }, 0)
        }),
        [setProp]
    )

    const handlePropChangeDebounced = (property, value) => {
        debouncedSetProp(property, value)
    }

    const theme = useAppSelector((state) => state.theme)

    const changePresetStyles = (preset) => {
        const updatedStyles = ["fontWeight", "fontSize", "preset", "textColor"]
        setProp((props) => {
            Object.keys(preset).forEach((key) => {
                if (updatedStyles.includes(key)) props[key] = preset[key]
            })
        }, 1000)
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
                <AccordionTrigger>{t("Content")}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={showDots}
                            onCheckedChange={(e) => {
                                handlePropChange("showDots", e)
                            }}
                            id="showDots"
                        />
                        <Label htmlFor="showDots">{t("Show dots")}</Label>
                    </div>

                    <Reorder.Group
                        axis="y"
                        values={links}
                        className="flex w-full flex-col gap-4"
                        onReorder={(e) => handlePropChange("links", e)}
                    >
                        {links.map((link, index) => (
                            <LinkItemSettings
                                key={`input-${link.id}`}
                                link={link}
                                index={index}
                                handlePropChangeDebounced={handlePropChangeDebounced}
                            />
                        ))}
                    </Reorder.Group>
                    <Button
                        className="h-9.5 w-full bg-[#23262C] text-white"
                        size="sm"
                        onClick={() =>
                            handlePropChange("links", [
                                ...links,
                                {
                                    id: `input-${hexoid(6)()}`,
                                    value: t("Privacy"),
                                    buttonAction: "redirect",
                                    trackingEvent: null,
                                    href: PRIVACY_URL,
                                    windowTarget: true,
                                    nextScreen: {
                                        screenId: "",
                                        screenName: "",
                                    },
                                }
                            ])
                        }
                    >
                        <Plus className="mr-2 size-4" /> {t("Add new link")}
                    </Button>
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
                        <Label htmlFor="linksColor">{t("Links color")}</Label>
                        <ColorInput
                            value={textColor}
                            handleChange={(e) => {
                                debouncedSetProp("textColor", e.target.value)
                            }}
                            handleRemove={() => {
                                debouncedSetProp("textColor", theme?.text?.secondaryColor || "#5a5a5a")
                            }}
                            id="linksColor"
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
                            <TabsList className="grid w-full grid-cols-4 bg-[#eeeeee]">
                                <TabsTrigger
                                    value="small"
                                    className="rounded text-base leading-4"
                                >
                                    {t("S")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="medium"
                                    className="rounded text-base leading-4"
                                >
                                    {t("M")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="large"
                                    className="rounded text-base leading-4"
                                >
                                    {t("L")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="full"
                                    className="rounded text-base leading-4"
                                >
                                    <MoveHorizontal className="size-4" />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="marginTop">{t("Top")}</Label>
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
                                <Label htmlFor="marginBottom">{t("Bottom")}</Label>
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
                                <Label htmlFor="marginRight">{t("Right")}</Label>
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
                                <Label htmlFor="marginLeft">{t("Left")}</Label>
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

            <AccordionItem value="styles">
                <AccordionTrigger>{t("Styles")}</AccordionTrigger>
                <AccordionContent className="pt-2">
                    <div className="space-y-4">
                        <Card
                            onClick={() => {
                                changePresetStyles(defaultPresets)
                            }}
                            className="px-4 py-0 transition-all duration-300 hover:cursor-pointer"
                            style={{
                                ...(preset === LinksPreset.default
                                    ? {
                                        border: `1px solid #2B3398`,
                                    }
                                    : {}),
                            }}
                        >
                            {/** @ts-ignore */}
                            {/** @ts-ignore */}
                            <LinksGen {...defaultPresets} />
                        </Card>
                        <Card
                            onClick={() => {
                                changePresetStyles(boldPreset)
                            }}
                            className="px-4 py-0 transition-all duration-300 hover:cursor-pointer"
                            style={{
                                ...(preset === LinksPreset.bold
                                    ? {
                                        border: `1px solid #2B3398`,
                                    }
                                    : {}),
                            }}
                        >
                            {/** @ts-ignore */}
                            {/** @ts-ignore */}
                            <LinksGen {...boldPreset} />
                        </Card>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tracking">
                <AccordionTrigger>{t("Tracking")}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={tracking}
                            onCheckedChange={(e) => {
                                handlePropChange("tracking", e)
                            }}
                            id="tracking"
                        />
                        <Label htmlFor="tracking">{t("Enable tracking")}</Label>
                    </div>
                    {tracking && (
                        <div className="space-y-4">
                            <div className="text-muted-foreground text-xs">
                                {t("Tracking Event")}
                            </div>
                            {links.map((link, index) => (
                                <LinksItemTrackingSettings
                                    key={`picture-choice-tracking-event-${link.id}`}
                                    link={link}
                                    index={index}
                                    onChange={(updatedTrackingEvent) => {
                                        handlePropChangeDebounced(
                                            "links",
                                            link.map((choice, i) =>
                                                i === index
                                                    ? { ...choice, trackingEvent: updatedTrackingEvent }
                                                    : choice
                                            )
                                        )
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export const LinkItemSettings = ({
    link: originalLink,
    index,
    handlePropChangeDebounced,
}) => {
    const t = useTranslations("Components")
    const y = useMotionValue(0)
    const controls = useDragControls()
    const screenNames = useScreenNames()
    const screensLength = useScreensLength()
    const selectedScreen = useAppSelector(
        (state: RootState) => state.screen?.selectedScreen ?? 0
    )
    const {
        actions: { setProp },
        props: { multiSelect, selections, links },
    } = useNode((node) => ({
        props: node.data.props,
    }))

    const [link, setLink] = useState(originalLink)

    useEffect(() => {
        setLink(originalLink)
    }, [originalLink])

    const handleChoiceDelete = () => {
        if (links.includes(link.id))
            setProp(
                (props) =>
                    (props.selections = selections.filter((id) => id !== link.id)),
                200
            )
        setProp(
            (props) => (props.links = links.filter((_, i) => i !== index)),
            200
        )
    }

    const nextScreenName =
        useAppSelector(
            (state: RootState) =>
                state?.screen?.screens[
                    selectedScreen + 1 < (screensLength || 0)
                        ? selectedScreen + 1
                        : selectedScreen
                ]?.screenName
        ) || ""

    const nextScreenId =
        useAppSelector(
            (state: RootState) =>
                state?.screen?.screens[
                    selectedScreen + 1 < (screensLength || 0) ? selectedScreen + 1 : 0
                ]?.screenId
        ) || ""

    const handleChoiceTextEdit = (newValue) => {
        setLink({ ...link, value: newValue })
        const val = [
            ...links.slice(0, index),
            { ...link, value: newValue },
            ...links.slice(index + 1),
        ]
        handlePropChangeDebounced("links", val)
    }

    const handleNavigationChange = (buttonAction, nextScreen) => {
        setLink({ ...link, buttonAction, nextScreen })
        handlePropChangeDebounced("links", [
            ...links.slice(0, index),
            { ...link, buttonAction, nextScreen },
            ...links.slice(index + 1),
        ])
    }

    const handleUpdateItem = (edits) => {
        setLink({ ...link, ...edits })
        handlePropChangeDebounced("links", [
            ...links.slice(0, index),
            { ...link, ...edits },
            ...links.slice(index + 1),
        ])
    }

    const { buttonAction, nextScreen, windowTarget, href } = link

    const { screenId, screenName } = nextScreen ?? {}
    return (
        <Reorder.Item
            dragListener={false}
            dragControls={controls}
            value={originalLink}
            transition={{ duration: 0 }}
            id={`picture-choice-${originalLink.id}`}
            style={{ y }}
            className="flex w-full select-none flex-col gap-1 "
        >
            <div className="flex items-center space-x-2">
                <Input
                    className="h-8.5 flex-1 bg-[#FAFAFA] text-xs"
                    value={link.value}
                    placeholder={`${t("Option")} ${index + 1}`}
                    onChange={(e) => handleChoiceTextEdit(e.target.value)}
                />
                <Icons.Delete
                    className="hover:cursor-pointer"
                    onClick={handleChoiceDelete}
                />
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className="reorder-handle !ml-1 hover:cursor-move"
                >
                    <Icons.GripVertical />
                </div>
            </div>
            <div className="pr-11">
                <div className="mb-1">
                    <Select
                        // className="w-full"
                        defaultValue={"redirect"}
                        value={
                            buttonAction === "custom-action"
                                ? nextScreenId
                                : buttonAction
                        }
                        onValueChange={(e) => {
                            if (e === "next-screen") {
                                handleUpdateItem({
                                    buttonAction: "next-screen",
                                    nextScreen: {
                                        screenId: nextScreenId,
                                        screenName: nextScreenName,
                                    }
                                })
                            } else if (e === "redirect") {
                                handleUpdateItem({
                                    buttonAction: "redirect"
                                })
                            } else if (e === "none") {
                                handleUpdateItem({
                                    buttonAction: "none",
                                    nextScreen: {
                                        screenId: "none",
                                        screenName: "",
                                    }
                                })
                            } else {
                                console.log("entered", e)
                                handleUpdateItem({
                                    buttonAction: "custom-action",
                                    nextScreen: {
                                        screenId: e,
                                        screenName: screenNames?.find(
                                            (screen) => screen.screenId === e
                                        )?.screenName,
                                    }
                                })
                            }
                        }}
                    >
                        <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                            <SelectValue placeholder="Select screen" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem className="text-xs" value={"next-screen"}>
                                    {t("Next Screen")}
                                </SelectItem>
                                <SelectItem className="text-xs" value={"redirect"}>
                                    {t("Redirect")}
                                </SelectItem>
                                <SelectItem className="text-xs" value={"none"}>
                                    {t("Do Nothing")}
                                </SelectItem>
                                {screenNames?.map((screen, index) => (
                                    <SelectItem
                                        className="text-xs"
                                        key={index}
                                        value={screen.screenId}
                                    >
                                        {index + 1} : {screen.screenName}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {buttonAction === "redirect" && (
                    <div className="my-1">
                        <div className="space-y-2">
                            <Input
                                className="h-8.5 flex-1 bg-[#FAFAFA] text-xs"
                                value={href}
                                onChange={(e) =>
                                    handleUpdateItem({ href: e.target.value })
                                }
                                placeholder={"URL"}
                            />
                        </div>

                        <div className="my-1">
                            <Select
                                defaultValue={"new-window"}
                                value={windowTarget ? "new-window" : "same-window"}
                                onValueChange={(e) =>
                                    handleUpdateItem({
                                        windowTarget: e === "new-window",
                                    })
                                }
                            >
                                <SelectTrigger className="h-8.5 w-full bg-[#FAFAFA] text-xs">
                                    <SelectValue placeholder="Select screen" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem className="text-xs" value={"new-window"}>
                                            {t("New Window")}
                                        </SelectItem>
                                        <SelectItem className="text-xs" value={"same-window"}>
                                            {t("Same Window")}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        </Reorder.Item >
    )
}


export const LinksItemTrackingSettings = ({
    link: originalLink,
    index,
    onChange,
}) => {
    const t = useTranslations("Components")

    const [link, setLink] = useState(originalLink)

    useEffect(() => {
        setLink(originalLink)
    }, [originalLink])

    const handleTrackingEventChange = (updatedTrackingEvent) => {
        setLink({ ...link, trackingEvent: updatedTrackingEvent })
        onChange(updatedTrackingEvent)
    }

    return (
        <div className="flex items-center space-x-2">
            <Label className="w-14 shrink-0" htmlFor="label-event">{link.value}</Label>
            <Input
                value={link.trackingEvent ?? ""}
                defaultValue={link.trackingEvent ?? ""}
                placeholder={t("Tracking Event")}
                onChange={(e) => handleTrackingEventChange(e.target.value)}
                type={"text"}
            />
        </div>
    )
}
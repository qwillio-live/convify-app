import { useNode } from "@craftjs/core"
import { useTranslations } from "next-intl"
import useFaqThemePresets, { IconType } from "./useFaqThemePresets"
import { useCallback, useEffect, useState } from "react"
import { throttle, debounce } from "lodash"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"

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
import { FAQGen, FAQItemIcons } from "./user-faq.component"
import hexoid from "hexoid"
import { Card } from "@/components/ui/card"


export const FAQSettings = () => {
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
            fullWidth,
            settingTabs,
            iconType,
            items,
        },
    } = useNode((node) => ({
        props: node.data.props,
    }))
    const { blockedPreset, preset: defaultPreset } = useFaqThemePresets()
    enum PRESETNAMES {
        blockedPreset = "blocked",
        regular = "regular",
    }
    const [selectedPreset, setSelectedPreset] = useState(PRESETNAMES.regular)
    const changePresetStyles = (preset) => {
        const updatedStyles = ["blockColor", "borderRadius", "borderWidth"]

        setProp((props) => {
            Object.keys(preset).forEach((key) => {
                if (updatedStyles.includes(key)) props[key] = preset[key]
            })
        }, 1000)
    }
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

    const theme = useAppSelector(
        (state) => state?.theme
    )
    const primaryColor = theme?.general?.primaryColor
    const secondaryColor = theme?.text?.secondaryColor || "#5a5a5a"
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
                        <div className="text-muted-foreground text-xs">
                            {t("Drag to re-arrange click to edit")}
                        </div>

                        <Reorder.Group
                            axis="y"
                            values={items}
                            className="flex w-full flex-col gap-2"
                            onReorder={(e) => handlePropChange("items", e)}
                        >
                            {items.map((item, index) => (
                                <FAQItemSettings
                                    key={`input-${item.id}`}
                                    item={item}
                                    index={index}
                                    handlePropChangeDebounced={handlePropChangeDebounced}
                                />
                            ))}
                        </Reorder.Group>
                        <Button
                            className="h-9.5 w-full bg-[#23262C] text-white"
                            size="sm"
                            onClick={() =>
                                handlePropChange("items", [
                                    ...items,
                                    {
                                        id: `${hexoid(6)()}`,
                                        question: `${t("Question")} ${items.length + 1}`,
                                        answer: `${t("Answer")}`,
                                    },
                                ])
                            }
                        >
                            <Plus className="mr-2 size-4" /> {t("Add new")}
                        </Button>
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

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>{t("Icon")}</Label>
                                <span className="text-muted-foreground text-xs">
                                    {columnsMobile}
                                </span>
                            </div>
                            <Tabs
                                defaultValue={iconType}
                                onValueChange={(value) => debouncedSetProp("iconType", value)}
                            >
                                <TabsList className="grid w-full grid-cols-2 bg-[#EEEEEE]">
                                    <TabsTrigger className="rounded" value={IconType.plus}>
                                        <Plus size={16} />
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="rounded"
                                        value={IconType.chevron}
                                    >
                                        <ChevronDown size={16} />
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="backgroundcolor">{t("Question Color")}</Label>
                            <ColorInput
                                value={titleColor}
                                handleChange={(e) => {
                                    debouncedSetProp("titleColor", e.target.value)
                                }}
                                handleRemove={() => {
                                    debouncedSetProp("titleColor", primaryColor)
                                }}
                                id="questionColor"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="backgroundcolor">{t("Answer Color")}</Label>
                            <ColorInput
                                value={contentColor}
                                handleChange={(e) => {
                                    debouncedSetProp("contentColor", e.target.value)
                                }}
                                handleRemove={() => {
                                    debouncedSetProp("contentColor", secondaryColor)
                                }}
                                id="answerColor"
                            />
                        </div>

                        {selectedPreset === PRESETNAMES.blockedPreset && <div className="flex items-center justify-between">
                            <Label htmlFor="backgroundcolor">{t("Block Color")}</Label>
                            <ColorInput
                                value={contentColor}
                                handleChange={(e) => {
                                    debouncedSetProp("blockColor", e.target.value)
                                }}
                                handleRemove={() => {
                                    debouncedSetProp("blockColor", "#f5f5f5")
                                }}
                                id="blockColor"
                            />
                        </div>}

                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="styles">
                    <AccordionTrigger>{t("Styles")}</AccordionTrigger>
                    <AccordionContent className=" pt-2">
                        <div className="space-y-4">
                            <Card
                                onClick={() => {
                                    changePresetStyles(defaultPreset)
                                    setSelectedPreset(PRESETNAMES.regular)
                                }}
                                className="px-4 transition-all duration-300 hover:cursor-pointer"
                            >
                                {/** @ts-ignore */}
                                {/** @ts-ignore */}
                                <FAQGen
                                    {...defaultPreset}
                                    size={'full'}
                                />
                            </Card>
                            <Card
                                onClick={() => {
                                    changePresetStyles(blockedPreset)
                                    setSelectedPreset(PRESETNAMES.blockedPreset)
                                }}
                                className="p-0 transition-all duration-300 hover:cursor-pointer"

                            >
                                {/** @ts-ignore */}
                                {/** @ts-ignore */}
                                <FAQGen
                                    {...blockedPreset}
                                    size={'full'}
                                />
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
}

export const FAQItemSettings = ({
    item: originalItem,
    index,
    handlePropChangeDebounced,
}) => {
    const t = useTranslations("Components")
    const y = useMotionValue(0)
    const controls = useDragControls()

    const {
        actions: { setProp },
        props: { items },
    } = useNode((node) => ({
        props: node.data.props,
    }))
    const [item, setItem] = useState(originalItem)
    useEffect(() => {
        setItem(originalItem)
    }, [originalItem])

    const handleItemDelete = () => {
        setProp((props) => (props.items = items.filter((_, i) => i !== index)), 200)
    }

    const handleItemTitleEdit = (newQuestion) => {
        setItem({ ...item, question: newQuestion })
        handlePropChangeDebounced("items", [
            ...items.slice(0, index),
            { ...item, question: newQuestion },
            ...items.slice(index + 1),
        ])
    }

    const handleItemDescriptionEdit = (newAnswer) => {
        setItem({ ...item, answer: newAnswer })
        handlePropChangeDebounced("items", [
            ...items.slice(0, index),
            { ...item, answer: newAnswer },
            ...items.slice(index + 1),
        ])
    }
    return (
        <Reorder.Item
            dragListener={false}
            dragControls={controls}
            value={originalItem}
            transition={{ duration: 0 }}
            id={`list-item-${originalItem.id}`}
            style={{ y }}
            className="flex w-full select-none flex-col gap-2"
        >
            <div className="flex w-full items-center space-x-2">
                <Input
                    className="h-8.5 flex-1 text-xs"
                    value={item.question}
                    placeholder={`Question`}
                    onChange={(e) => handleItemTitleEdit(e.target.value)}
                />

                <Icons.Delete
                    className="hover:cursor-pointer"
                    onClick={handleItemDelete}
                />
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className="reorder-handle !ml-1  hover:cursor-move"
                >
                    <Icons.GripVertical />
                </div>
            </div>
            <div className="pr-11">
                <Input
                    className="h-8.5 flex-1 text-xs text-[#5a5a5a]"
                    value={item.answer}
                    placeholder={`Answer to the question`}
                    onChange={(e) => handleItemDescriptionEdit(e.target.value)}
                />
            </div>
        </Reorder.Item>
    )

}

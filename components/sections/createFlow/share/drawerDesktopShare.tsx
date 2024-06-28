import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/custom-tabs"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawerDesctop"

import { Minus, Plus } from "lucide-react"

import { Bar, BarChart, ResponsiveContainer } from "recharts"
import './Share.css'

export const ShareDrawerDesktop = ({ desktopDrawerOpen, setDesktopDrawerOpen }) => {
    const t = useTranslations("CreateFlow.SharePage")
    return (
        <Drawer open={desktopDrawerOpen} onOpenChange={setDesktopDrawerOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader style={{ alignItems: 'left' }}>
                        <DrawerTitle>{t("Continue on desktop")}</DrawerTitle>
                        <DrawerDescription>{t("continue on desktop desc")}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button
                            className="w-full bg-[rgb(38,38,39)] text-white hover:bg-[rgb(71,71,71)] mb-2 text-base"
                            onClick={() => setDesktopDrawerOpen(false)}
                        >
                            <svg
                                className="mr-2.5"
                                width="16"
                                height="12"
                                viewBox="0 0 16 12"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.898 7.182C9.391 7.689 8.717 7.968 8 7.968C7.2825 7.968 6.6085 7.6885 6.102 7.1815L0 1.08V10C0 11.1045 0.8955 12 2 12H14C15.1045 12 16 11.1045 16 10V1.08L9.898 7.182Z"></path>
                                <path d="M8 6.505C8.3165 6.505 8.633 6.3875 8.8685 6.1525L15.0205 0H0.9795L7.1315 6.1525C7.367 6.3875 7.6835 6.505 8 6.505Z"></path>
                            </svg>
                            {t("Email me a direct link")}
                        </Button>
                        <DrawerClose asChild>
                            <Button
                                variant="outline"
                                className="w-full text-base bg-[rgb(227,227,227)] hover:bg-[rgb(227,227,227)]"
                                onClick={() => setDesktopDrawerOpen(false)}
                            >
                                {t("Dismiss")}
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
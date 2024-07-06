"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Eye, Plus } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BreadCrumbs } from "@/components/breadcrumbs"

const Header = () => {
    const t = useTranslations("CreateFlow"); // Initialize your translation hook
    const router = useRouter();
    const currentPath = usePathname();

    const handleLogout = async () => {
        localStorage.removeItem('date');
        localStorage.removeItem('days');
        localStorage.removeItem('Dropoff');
        localStorage.removeItem('flowId');
        localStorage.removeItem('analyticsData');
        localStorage.removeItem('responses');
        localStorage.removeItem('dataKey');
        await signOut({ redirect: false });
        router.push("/login");
    };

    const linkClasses = (path) => (
        `h-full rounded-none border-b-4 flex-1 lg:flex-auto flex justify-center items-center text-sm px-3 ${currentPath === path || currentPath === "/pt" + path ? 'text-foreground border-current' : 'text-muted-foreground border-transparent'}`
    );

    return (
        <header className="flex flex-wrap lg:flex-nowrap h-28 items-center justify-between gap-x-4 lg:gap-4 bg-[#fcfdfe] px-4 lg:h-[60px] lg:px-6">
            <div className="bread-crumbs flex h-1/2 lg:h-full max-h-screen flex-col items-center">
                <div className="flex h-14 items-center lg:h-[60px]">
                    <BreadCrumbs />
                </div>
                <div className="h-14 flex-1 flex-col items-center justify-between overflow-y-auto px-4 lg:h-[60px] lg:px-6 hidden">
                    <div className="flex flex-row items-center justify-between py-4">
                        <h4 className="scroll-m-20 text-lg font-normal tracking-tight">
                            {t("Content")}
                        </h4>
                        <Button size="icon" className="size-8">
                            <Plus className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full order-last lg:order-[unset] basis-full lg:basis-auto lg:w-auto flex h-1/2 lg:h-full shadow-[rgba(0,0,0,0.07)_0px_1px_inset]">
                <div className="flex bg-inherit lg:justify-center py-0 size-full lg:w-auto">
                    <Link
                        className={linkClasses("/dashboard/flows/create-flow")}
                        href="/dashboard/flows/create-flow"
                    >
                        {t("Create")}
                    </Link>
                    <Link
                        className={linkClasses("/dashboard/flows/connect")}
                        href="/dashboard/flows/connect"
                    >
                        {t("Connect")}
                    </Link>
                    <Link
                        className={linkClasses("/dashboard/flows/share1")}
                        href="/dashboard/flows/share1"
                    >
                        {t("Share")}
                    </Link>
                    <Link
                        className={linkClasses("/dashboard/flows/results")}
                        href="/dashboard/flows/results"
                    >
                        {t("Results")}
                    </Link>
                </div>
            </div>
            <div className="account-settings flex flex-row items-center justify-between gap-4 h-1/2 lg:h-full">
                <Link href="/dashboard/flows/preview-flow" target="_blank">
                    <Button
                        variant="outline"
                        size="sm"
                        className="my-4 h-8 gap-1 p-2"
                    >
                        <Eye className="size-3.5" />
                    </Button>
                </Link>
                <div className="">
                    <Button size="sm" className="my-4 h-8 gap-1 py-2">
                        {t("Publish")}
                    </Button>
                </div>

                <div className="lg:block hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full size-10"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-circle-user"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="10" r="3" />
                                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                                </svg>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{t("Settings")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Support")}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                {t("Logout")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;

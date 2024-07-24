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
import { useEffect, useState } from "react"
import { User } from "../../page"
const clearFlowNamesFromLocalStorage = () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('flowName_')) {
            localStorage.removeItem(key);
        }
    }
};

const extractFlowIdFromUrl = (currentPath) => {
    const url = currentPath; // Get the current URL
    const matchShare = url && url.match(/dashboard\/([^\/]+)\/share/); // Use regex to match the flowId
    const matchConnect = url && url.match(/dashboard\/([^\/]+)\/connect/); // Use regex to match the flowId
    const matchResult = url && url.match(/dashboard\/([^\/]+)\/results/); // Use regex to match the flowId
    if (matchShare && matchShare[1] && matchShare[1] !== "flows") {
        return matchShare[1]
    }
    else if (matchConnect && matchConnect[1] && matchConnect[1] !== "flows") {
        return matchConnect[1]
    }
    else if (matchResult && matchResult[1] && matchResult[1] !== "flows") {
        return matchResult[1]
    }
    return null
};
const Header = () => {
    const t = useTranslations("CreateFlow"); // Initialize your translation hook
    const router = useRouter();
    const currentPath = usePathname();
    const [flowId, setFlowId] = useState<string | null>(extractFlowIdFromUrl(currentPath));
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [userData, setUserData] = useState<User>()

    useEffect(() => {
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => setUserData(data))
            .catch((error) => console.error("Error fetching user data:", error))
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 370);
        };

        handleResize(); // Check screen size on component mount
        window.addEventListener('resize', handleResize); // Add resize event listener

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up event listener on component unmount
        };
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('flowData');
        localStorage.removeItem('flowId');
        localStorage.removeItem('responses');
        localStorage.removeItem('flowName');
        clearFlowNamesFromLocalStorage();
        await signOut({ redirect: false });
        router.push("/login");
    };
    const linkClasses = (path) => (
        `h-full rounded-none border-b-4 flex-1 lg:flex-auto flex justify-center items-center text-sm ${isSmallScreen ? 'px-2.5' : 'px-3'} ${currentPath?.split("/").at(-1) === path.split("/").at(-1) || currentPath === "/pt" + path ? 'text-foreground border-current' : 'text-muted-foreground border-transparent'}`
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
                        href={`/dashboard/${flowId}/create-flow`}
                        style={{
                            paddingLeft: isSmallScreen ? "0.625rem" : "1rem",
                        }}
                    >
                        {t("Create")}
                    </Link>
                    <Link
                        className={linkClasses("/dashboard/flows/connect")}
                        href={`/dashboard/${flowId}/connect`}
                    >
                        {t("Connect")}
                    </Link>
                    <Link
                        className={linkClasses("/dashboard/flows/share")}
                        href={`/dashboard/${flowId}/share`}
                    >
                        {t("Share")}
                    </Link>
                    <Link
                        className={linkClasses("/dashboard/flows/results")}
                        href={`/dashboard/${flowId}/results`}
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
                                 className="flex items-center justify-center rounded-full bg-[#eaeaec] p-0 text-base font-bold hover:bg-[#eaeaec] uppercase"
                                 style={{ width: '40px', height: '40px' }} // Adjust the size as needed
                            >
                                {userData ? (
                                    userData?.name ? (
                                        userData?.name?.charAt(0).toUpperCase()
                                    ) : (
                                        userData?.email?.charAt(0).toUpperCase()
                                    )
                                ) : (
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
                                    </svg>)}
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
        </header >
    );
};

export default Header;

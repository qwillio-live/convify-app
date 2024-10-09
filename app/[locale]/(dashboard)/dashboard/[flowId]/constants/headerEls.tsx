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
import { BreadCrumbs } from "@/components/breadcrumbs-with-flowId"
import { useEffect, useState } from "react"
import { User } from "../../page"
import { useAppDispatch, useAppSelector } from "@/lib/state/flows-state/hooks"
import {
  setIsUpdating,
  setResetTotalFilled,
  setSelectedScreen,
} from "@/lib/state/flows-state/features/placeholderScreensSlice"
import { revalidateFlow } from "@/actions/flow/revalidateFlow"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { env } from "@/env.mjs"

const clearFlowNamesFromLocalStorage = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key && key.startsWith("flowName_")) {
      localStorage.removeItem(key)
    }
  }
}

const Header = ({ flowId }) => {
  const t = useTranslations("CreateFlow")
  const router = useRouter()
  const currentPath = usePathname()
  const dispatch = useAppDispatch()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<User>()
  const localFlowData = useAppSelector((state) => state?.screen)
  const localFlowSettings = useAppSelector((state) => state?.theme)
  // const flowDomain = env.NEXT_PUBLIC_FLOW_DOMAIN
  const screeenName = useAppSelector(
    (state) => state?.screen?.screens[state?.screen?.selectedScreen]?.screenName
  )
  const isUpdating =
    useAppSelector((state) => state?.screen?.isUpdating) || false
  const selectedScreen =
    useAppSelector((state) => state?.screen?.selectedScreen) || 0

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error))
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 370)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("flowData")
    localStorage.removeItem("flowId")
    localStorage.removeItem("responses")
    localStorage.removeItem("flowName")
    clearFlowNamesFromLocalStorage()
    await signOut({ redirect: false })
    router.push("/login")
  }

  const linkClasses = (path) =>
    `h-full rounded-none border-b-2 md:border-b-4 flex-1 lg:flex-auto flex justify-center items-center text-sm md:text-base ${
      isSmallScreen ? "px-2.5" : "px-3"
    } ${
      currentPath?.split("/").at(-1) === path.split("/").at(-1) ||
      currentPath === "/pt" + path
        ? "text-foreground border-current"
        : "text-muted-foreground border-transparent"
    }`

  const publishFlow = async () => {
    try {
      setIsLoading(true)
      dispatch(setIsUpdating(true))
      const steps = localFlowData?.screens
        ? Array.from(
            new Set(localFlowData.screens.map((step) => step.screenName))
          ).map((name) => {
            const step = localFlowData.screens.find(
              (s) => s.screenName === name
            )
            return {
              id: step?.screenId,
              name: step?.screenName,
              content: JSON.parse(step?.screenData),
              link: step?.screenLink,
              order: step ? localFlowData.screens.indexOf(step) : 0,
              templateId: step?.screenTemplateId,
            }
          })
        : [] // Return an empty array if localFlowData or screens is undefined

      const data = {
        steps,
        headerData: localFlowData?.screensHeader,
        footerData: localFlowData?.screensFooter,
        flowSettings: {
          mobileScreen: localFlowSettings?.mobileScreen,
          header: localFlowSettings?.header,
          general: localFlowSettings?.general,
          text: localFlowSettings?.text,
        },
      }
      try {
        await fetch(`/api/flows/${flowId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Previous request canceled")
        } else {
          console.error("Update flow error:", error)
        }
      }
      // const res = await fetch(`${flowDomain}/api/flows/revalidate`, {
      //   method: "GET",
      // })
      // if (res.ok) {

      setTimeout(async () => {
        const response = await fetch(`/api/flows/published/${flowId}`, {
          method: "POST",
        })
        if (response.ok) {
          // revalidateFlow({ tag: "publishedFlow" })
          router.push(`./share`)
        }
        setIsLoading(false)
        dispatch(setIsUpdating(false))
        router.push(`./share`)
      }, 6000)
      // }
    } catch (err) {
      console.error("Publishing flow failed:", err)
    }
  }
  router.prefetch(`/dashboard/${flowId}/create-flow`)
  function onClick() {
    window.location.href = `/dashboard/${flowId}/create-flow`
  }
  return (
    <header className="font-poppins flex h-28 flex-wrap items-center justify-between gap-x-4 bg-[#F6F6F6] px-4 lg:h-[60px] lg:flex-nowrap lg:gap-4 lg:px-6">
      <div className="bread-crumbs flex h-1/2 max-h-screen flex-col items-center lg:h-full">
        <div className="flex h-14 items-center lg:h-[60px]">
          <BreadCrumbs flowId={flowId} />
        </div>
        <div className="hidden h-14 flex-1 flex-col items-center justify-between overflow-y-auto px-4 lg:h-[60px] lg:px-6">
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

      <div className="order-last flex h-1/2 w-full basis-full shadow-[rgba(0,0,0,0.07)_0px_1px_inset] lg:order-[unset] lg:h-full lg:w-auto lg:basis-auto">
        <div className="flex size-full bg-inherit py-0 lg:w-auto lg:justify-center">
          <div
            className={linkClasses("/dashboard/flows/create-flow")}
            onClick={onClick}
            style={{
              paddingLeft: isSmallScreen ? "0.625rem" : "1rem",
              cursor: "pointer",
            }}
          >
            {t("Create")}
          </div>
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

      <div
        className="account-settings flex flex-row items-center justify-between gap-2 lg:h-full"
        onClick={() => {
          dispatch(setResetTotalFilled(true))
          dispatch(setSelectedScreen(selectedScreen))
          revalidateFlow({ tag: "previewFlow" })
        }}
      >
        <Link
          href={`/dashboard/preview-flow/${flowId}?screen=${screeenName}`}
          target="_blank"
        >
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 border border-[#E6E2DD] px-2 md:h-10 md:px-4"
          >
            <Eye className="size-4 text-[#23262C]" />
            <div className="hidden text-sm font-normal md:block md:text-base ">
              {t("Preview")}
            </div>
          </Button>
        </Link>
        <div className="">
          <Button
            size="sm"
            className="h-8 gap-1  px-3 py-2 text-sm md:h-10 md:px-4 md:text-base"
            onClick={publishFlow}
            disabled={isLoading ? true : false}
          >
            <span className="font-normal">{t("Publish")}</span>
            {isLoading && (
              <div>
                <Icons.spinner className=" z-20  size-4 animate-spin" />
              </div>
            )}
          </Button>
        </div>

        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center rounded-full bg-[#EAEAEC] p-0 text-base font-semibold uppercase hover:bg-[#eaeaec]"
                style={{ width: "40px", height: "40px" }} // Adjust the size as needed
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
                  </svg>
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ zIndex: 80 }}>
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
  )
}

export default Header

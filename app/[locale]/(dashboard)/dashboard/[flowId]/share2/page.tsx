"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import ShareFlowComponents from "@/components/sections/createFlow/share/Share"
import { useEffect, useState } from "react"
import { User } from "../../page"

// sections

export default function CreateFlowsPage() {
  const t = useTranslations("Components")
  const router = useRouter()
  const [userData, setUserData] = useState<User>()

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error))
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    // document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-[60]">
          <header className="flex h-28 flex-wrap items-center justify-between gap-x-4 border-b bg-[#fcfdfe] px-4 lg:h-[60px] lg:flex-nowrap lg:gap-4 lg:px-6">
            <div className="bread-crumbs flex h-1/2 max-h-screen flex-col items-center lg:h-full">
              <div className="flex h-14 items-center lg:h-[60px]">
                <BreadCrumbs />
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
                <Link
                  className="text-muted-foreground flex h-full flex-1 items-center justify-center rounded-none border-b-4 border-transparent px-3 text-sm lg:flex-auto"
                  href="/dashboard/flows/create"
                >
                  {t("Create")}
                </Link>
                <Link
                  className="text-muted-foreground flex h-full flex-1 items-center justify-center rounded-none border-b-4 border-transparent px-3 text-sm lg:flex-auto"
                  href="/dashboard/flows/connect"
                >
                  {t("Connect")}
                </Link>
                <Link
                  className="text-foreground flex h-full flex-1 items-center justify-center rounded-none border-b-4 border-current px-3 text-sm lg:flex-auto"
                  href="/dashboard/flows/share1"
                >
                  {t("Share")}
                </Link>
                <Link
                  className="text-muted-foreground flex h-full flex-1 items-center justify-center rounded-none border-b-4 border-transparent px-3 text-sm lg:flex-auto"
                  href="/dashboard/flows/results"
                >
                  {t("Results")}
                </Link>
              </div>
            </div>
            <div className="account-settings flex h-1/2 flex-row items-center justify-between gap-4 lg:h-full">
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

              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center justify-center rounded-full bg-[#eaeaec] p-0 text-base font-bold uppercase hover:bg-[#eaeaec]"
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
        </div>
        <main
          className={`content relative z-50 h-full flex-1 overflow-hidden bg-[#FAFAFA]`}
        >
          {/* <ShareFlowComponents isPublished={true} /> */}
        </main>
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all delay-0 duration-200 ease-in-out">
        <button className="relative size-8 cursor-pointer rounded-[50%] border border-solid border-transparent bg-white p-0 shadow-[rgba(0,0,0,0.08)_0px_2px_4px,rgba(0,0,0,0.06)_0px_2px_12px,rgba(0,0,0,0.04)_0px_8px_14px,rgba(0,0,0,0.02)_0px_12px_16px] outline-none transition-all duration-500 ease-in hover:bg-[rgb(231,231,231)]">
          <div className="flex size-auto cursor-pointer items-center justify-center">
            <span className="SVGInline">
              <svg
                className="SVGInline-svg"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fillRule="evenodd">
                  <path
                    d="M0 5h2v.088H0V5zm0-1.25C0 1.494 1.626 0 4 0c2.377 0 4 1.488 4 3.75 0 1.462-.636 2.323-1.885 3.164l-.44.29c-.33.221-.482.355-.54.455C5.068 7.774 4.999 8.25 5 9l-2 .003c-.002-1.083.108-1.835.405-2.347.255-.439.59-.732 1.158-1.113l.435-.287C5.75 4.748 6 4.41 6 3.75 6 2.633 5.309 2 4 2c-1.305 0-2 .638-2 1.75v1.338H0V3.75z"
                    fillRule="nonzero"
                  ></path>
                  <path d="M3 10h2v2H3z"></path>
                </g>
              </svg>
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}

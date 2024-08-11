"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  ChevronDown,
  FolderOpen,
  Home,
  LineChart,
  Package,
  Package2,
  Plus,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FlowsList } from "@/components/flows"
import SkeletonFlowCard from "@/components/flows-skeleton"

export interface User {
  name: string
  email: string
  image: string
  id: string
}

const clearFlowNamesFromLocalStorage = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key && key.startsWith("flowName_")) {
      localStorage.removeItem(key)
    }
  }
}

export default function DashboardPage() {
  const [openCreateFlow, setOpenCreatedFlow] = useState(false)
  const [userData, setUserData] = useState<User>()
  const router = useRouter()
  const t = useTranslations("Dashboard")
  const [flows, setFlows] = useState([])
  const [status, setStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error))
  }, [])

  useEffect(() => {
    async function fetchFlows() {
      setLoading(true)
      const response = await fetch("/api/flows")
      const data = await response.json()
      if (data.length > 0) {
        setOpenCreatedFlow(true)
      }
      setFlows(data)
      setLoading(false)
    }
    fetchFlows()
  }, [status])

  const handleLogout = async () => {
    localStorage.removeItem("flowData")
    localStorage.removeItem("flowId")
    localStorage.removeItem("responses")
    localStorage.removeItem("flowName")
    clearFlowNamesFromLocalStorage()
    await signOut({ redirect: false })
    // document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  return (
    <div className="font-poppins bg-[#F6F6F6]">
      <div className="sticky top-0 flex md:h-[60px] h-[56px] items-center justify-between border-b border-b-[#E6E2DD] px-6 ">
        {/* logo */}
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <svg
              className="h-6 w-6 md:h-7 md:w-7"
              viewBox="0 0 720 524"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_2503_36160"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="65"
                y="65"
                width="590"
                height="394"
              >
                <rect
                  x="65.4551"
                  y="65.4551"
                  width="589.091"
                  height="392.727"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_2503_36160)">
                <path
                  d="M114.547 507.273L286.365 261.819L114.547 16.3643"
                  stroke="white"
                  strokeWidth="98.1818"
                />
                <path
                  d="M114.547 507.273L286.365 261.819L114.547 16.3643"
                  stroke="black"
                  strokeWidth="98.1818"
                />
                <path
                  d="M261.818 507.273L433.637 261.819L261.818 16.3643"
                  stroke="white"
                  strokeWidth="98.1818"
                />
                <path
                  d="M261.818 507.273L433.637 261.819L261.818 16.3643"
                  stroke="black"
                  strokeOpacity="0.6"
                  strokeWidth="98.1818"
                />
                <path
                  d="M409.092 507.273L580.91 261.819L409.092 16.3643"
                  stroke="white"
                  strokeWidth="98.1818"
                />
                <path
                  d="M409.092 507.273L580.91 261.819L409.092 16.3643"
                  stroke="black"
                  strokeOpacity="0.2"
                  strokeWidth="98.1818"
                />
              </g>
            </svg>
            <span className="text-base md:text-lg">Convify</span>
          </div>
        </div>
        {/* notification and account menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-[6px] border border-[#EAEAEC]"
          >
            <Bell className="size-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center rounded-full bg-[#eaeaec] p-0 text-base font-semibold uppercase hover:bg-[#eaeaec]"
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                  </svg>
                )}
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

      <div className="sticky md:top-[60px] top-[56px] flex h-[88px] md:border-b md:border-b-[#E6E2DD]">
        <div className="h-full border-r border-r-[#E6E2DD] md:w-[220px] lg:w-[280px] hidden md:block">
          
          <form className="h-full flex items-center lg:px-6 px-2">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder={t("Find workspace or flow")}
                className="bg-background w-full appearance-none pl-8 shadow-none"
              />
            </div>
          </form>
        </div>
        <div className="flex-1 md:bg-white pt-5 md:pt-0">
          <div className="h-full flex md:flex-row flex-col md:items-center items-start md:justify-between gap-4 px-4 md:px-8 ">
            <h1 className="text-base md:text-2xl font-semibold text-[#23262C]">
              {t("My workspace")}
            </h1>
            <Link
              className="flex items-center w-full md:w-fit"
              href="/dashboard/flows/create-flow/select-template"
            >
              <Button className="itmes-center flex gap-2 px-4 py-2 font-normal rounded-lg  text-sm md:text-base text-white bg-[#23262C] w-full">
                <Plus size={16} /> {t("Create new flow")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r border-r-[#E6E2DD] bg-[#F6F6F6] md:block">
          <div className="fixed flex h-full flex-col gap-2 md:w-[220px] lg:w-[280px]">
            <div className="flex-1 overflow-x-hidden">
              <nav className="grid items-start px-2 mt-8 text-base lg:px-6">
                <div className="text-[#9B9A99] flex items-center gap-3 rounded-lg px-3 py-2">
                  <ChevronDown className="size-4" />
                  {t("Private")}
                </div>
                <div
                  onClick={() => setOpenCreatedFlow(true)}
                  // href="/dashboard/flows"
                  className="border border-[#E6E2DD] bg-muted text-primary hover:text-primary flex items-center gap-3 rounded-lg lg:px-4 py-2 transition-all hover:cursor-pointer"
                >
                  {/* <Package className="size-4" /> */}
                  <FolderOpen className="size-4" />
                  {t("My workspace")}{" "}
                  <span className="ml-auto text-[#9B9A99]">
                    1
                  </span>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex h-full flex-col overflow-y-auto">
          <main className="flex h-full flex-1 flex-col overflow-y-auto bg-[#F6F6F6] p-4 lg:p-8">
            {loading ? (
              <div
                className={`flex flex-1 items-center justify-center rounded-lg border-none`}
                x-chunk="dashboard-02-chunk-1"
              >
                <SkeletonFlowCard />
              </div>
            ) : (
              <>
                {openCreateFlow ? (
                  <div
                    className={`flex flex-1  justify-center rounded-lg ${
                      openCreateFlow ? "border-none" : "border"
                    }`}
                    x-chunk="dashboard-02-chunk-1"
                  >
                    <FlowsList
                      flows={flows}
                      setStatus={setStatus}
                      status={status}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex flex-1 items-center  justify-center rounded-lg shadow-sm ${
                      openCreateFlow ? "border-none" : "border"
                    }`}
                    x-chunk="dashboard-02-chunk-1"
                  >
                    <div className="flex flex-col items-center gap-1 text-center">
                      <img
                        src="/images/character.svg"
                        alt=""
                        className="mb-4 h-[104px]"
                      />
                      <h3 className="text-2xl font-bold tracking-tight">
                        {t("There's not a flow in sight")}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t.rich(
                          "Click on 'Create new flow' or use one of flow <br></br> suggestions above to get started",
                          {
                            br: () => <br />,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

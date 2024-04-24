"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  ChevronDown,
  Eye,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Plus,
  Search,
  ShoppingCart,
  User,
  Users,
} from "lucide-react"
import { signOut } from "next-auth/react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BreadCrumbs } from "@/components/breadcrumbs"
import { CreateFlowComponent } from "@/components/create-flow/create-flow.component"
import { FlowsList } from "@/components/flows"
import ConnectFlowComponents from "@/components/sections/createFlow/connect/Connect"
// sections
import ResultFlowComponents from "@/components/sections/createFlow/result/Result"

export default function CreateFlowsPage() {
  const [openCreateFlow, setOpenCreatedFlow] = useState(true)
  const [tab, setTab] = useState("create")

  // store the current tab value
  const onTabChange = (value: string) => {
    setTab(value)
  }
  const router = useRouter()

  const handleOpenCreateFlow = () => {
    setOpenCreatedFlow(true)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    // document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  return (
    <div className="min-h-screen w-full">
      <Tabs defaultValue="create" onValueChange={onTabChange}>
        <div className="sticky top-0 z-0 ">
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/20 px-4 lg:h-[60px] lg:px-6">
            <div className="bread-crumbs flex h-full max-h-screen flex-col items-center">
              <div className="flex h-14 items-center lg:h-[60px]">
                <BreadCrumbs />
              </div>
              <div className="flex h-14 flex-1 flex-col items-center justify-between overflow-y-auto px-4 lg:h-[60px] lg:px-6">
                <div className="flex flex-row items-center justify-between py-4">
                  <h4 className="scroll-m-20 text-lg font-normal tracking-tight">
                    Content
                  </h4>
                  <Button size="icon" className="h-8 w-8">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="tabs-list-container flex h-full">
              <TabsList className="flex h-full bg-inherit py-0 ">
                <TabsTrigger
                  className="h-full rounded-sm border-b-4 border-transparent data-[state=active]:border-current data-[state=active]:bg-inherit"
                  value="create"
                >
                  Create
                </TabsTrigger>
                <TabsTrigger
                  className="h-full rounded-sm border-b-4 border-transparent data-[state=active]:border-current data-[state=active]:bg-inherit"
                  value="connect"
                >
                  Connect
                </TabsTrigger>
                <TabsTrigger
                  className="h-full  rounded-sm border-b-4 border-transparent data-[state=active]:border-current data-[state=active]:bg-inherit"
                  value="share"
                >
                  Share
                </TabsTrigger>
                <TabsTrigger
                  className="h-full  rounded-sm border-b-4 border-transparent data-[state=active]:border-current data-[state=active]:bg-inherit"
                  value="results"
                >
                  Results
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="account-settings flex flex-row items-center justify-between gap-4">
              <div className="">
                <Button
                  variant="outline"
                  size="sm"
                  className="my-4 h-8 gap-1 p-2"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="">
                <Button size="sm" className="my-4 h-8 gap-1 py-2">
                  Publish
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
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
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </div>
        <main
          className={`content relative z-50 overflow-hidden ${
            tab === "results" ? "" :` "px-4 lg:px-6"`
          }`}
        >
          <div className="tabs-content">
            <TabsContent className="mt-0" value="create">
              <CreateFlowComponent />
            </TabsContent>

            <TabsContent className="mt-0" value="connect">
              <ConnectFlowComponents />
            </TabsContent>
            <TabsContent className="mt-0" value="share">
              Share your flows.
            </TabsContent>
            <TabsContent className="mt-0" value="results">
              <ResultFlowComponents />
            </TabsContent>
          </div>
        </main>
      </Tabs>
    </div>
  )
}

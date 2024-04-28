"use client"

import {
  Bell,
  ChevronDown,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Plus,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { FlowsList } from "@/components/flows"
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

interface User {
  name: string
  email: string
  image: string
  id: string
}

export default function DashboardPage() {
  const [openCreateFlow, setOpenCreatedFlow] = useState(false)
  const [userData, setUserData] = useState<User>()
  const router = useRouter()

  console.log(userData)

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error))
  }, [])

  const handleOpenCreateFlow = () => {
    setOpenCreatedFlow(true)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    // document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="fixed flex h-full max-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="size-6" />
              <span className="">Convify</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto size-8">
              <Bell className="size-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className="grid items-start px-2 pt-2 text-sm font-medium lg:px-4">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Find workspace or typeform"
                    className="w-full appearance-none bg-background pl-8 shadow-none "
                  />
                </div>
              </form>
              <Separator className="my-4" />
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 uppercase text-muted-foreground">
                <ChevronDown className="size-4" />
                {/* <User className="h-4 w-4" /> */}
                Private
              </div>

              {/* <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link> */}
              <div
                onClick={() => setOpenCreatedFlow(true)}
                // href="/dashboard/flows"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:cursor-pointer hover:text-primary"
              >
                <Package className="size-4" />
                My workspace{" "}
                <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-transparent text-black hover:bg-transparent hover:text-black">
                  1
                </Badge>
              </div>
              {/* <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link> */}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="sticky top-0 z-20">
          <header className="flex h-14 items-center gap-4 border-b bg-[#fafbfc] px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Package2 className="size-6" />
                    <span className="sr-only">Convify</span>
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="size-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                  >
                    <ShoppingCart className="size-5" />
                    Orders
                    <Badge className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">
                      6
                    </Badge>
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Package className="size-5" />
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Users className="size-5" />
                    Customers
                  </Link>
                  <Link
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <LineChart className="size-5" />
                    Analytics
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form> */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-[#eaeaec] font-bold hover:bg-[#eaeaec]"
                >
                  {userData && userData?.name.charAt(0).toUpperCase()}
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
          </header>
        </div>

        <main className="flex flex-1 flex-col p-4 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-lg">My workspace</h1>
          </div>
          <div
            className={`flex flex-1 items-center justify-center rounded-lg shadow-sm ${
              openCreateFlow ? "border-none" : "border"
            }`}
            x-chunk="dashboard-02-chunk-1"
          >
            {openCreateFlow ? (
              <FlowsList />
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  There&apos;s not a form in sight
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click on &quot;Create new form&quot; or use one of the
                  AI-powered <br /> form suggestions above to get started
                </p>
                <Button
                  className="itmes-center mt-4 flex gap-2"
                  onClick={handleOpenCreateFlow}
                >
                  <Plus size={16} /> Create new form
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

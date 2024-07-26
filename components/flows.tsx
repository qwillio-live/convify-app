"use client"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import placeholder from "@/assets/placeholder.svg"
import { MoreHorizontal, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "./ui/badge"
import { useEffect, useState, useRef, LegacyRef } from "react"
import { Icons } from "@/components/icons"
import { useRouter, usePathname } from "next/navigation"

function formatDate(isoString: string): string {
  const date = new Date(isoString)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const filterAllowedFields = (data) => {
  const allowedFields = [
    "name",
    "previewImage",
    "link",
    "status",
    "numberOfSteps",
  ]
  return Object.keys(data).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = data[key]
    }
    return acc
  }, {})
}

interface Flow {
  id: string
  name: string
  previewImage: string
  status: string
  numberOfSteps: number
  numberOfResponses: number
  createdAt: string
}
function splitAndJoin(word: string, isClamped: boolean): string {
  const maxLength = 50

  if (isClamped) {
    // Check if the word length is greater than the maximum length
    if (word.length > maxLength) {
      // Trim the word to the maximum length and add ellipsis
      return word.substring(0, maxLength).trim() + "..."
    } else {
      // Return the word as it is if it's within the length limit
      return word
    }
  } else {
    // Return the word as it is if not clamped
    return word
  }
}

export function FlowsList({ flows, setStatus, status }) {
  const t = useTranslations("Dashboard")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [flow, setFlow] = useState<Flow>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paddingScreen, setPaddingScreen] = useState<string>("inherit")
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  const currentPath = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (windowSize <= 360) {
      setPaddingScreen("0.3rem")
    } else if (windowSize <= 390) {
      if (currentPath?.includes("pt")) {
        setPaddingScreen("0.3rem")
      } else {
        setPaddingScreen("0.35rem")
      }
    } else if (windowSize <= 400) {
      setPaddingScreen("0.75rem")
    } else if (windowSize <= 500) {
      setPaddingScreen("0.85rem")
    }
  }, [windowSize])

  // const cellRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false)
  useEffect(() => {
    if (windowSize > 600) {
      setIsClamped(false)
    }
  }, [windowSize])
  const cellRef = useRef<HTMLDivElement>(null) // Assign the correct type to cellRef

  useEffect(() => {
    const element = cellRef.current
    if (element) {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight)
      const maxLines = 3
      const maxHeight = lineHeight * maxLines // Calculate max height for 3 lines
      // Calculate content height based on actual content
      const contentHeight = element.scrollHeight

      // Check if content exceeds maximum height
      if (contentHeight >= maxHeight) {
        setIsClamped(true)
      }
    }
  }, [windowSize])
  const editFlow = async (flow) => {
    const flowId = flow.id
    const url = `/dashboard/${flowId}/create-flow`

    // Redirect the user to the constructed URL
    router.push(url)
  }

  const duplicateFlow = async (flow_id) => {
    try {
      await fetch(`/api/flows/${flow_id}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setStatus(!status)
    } catch (error) {
      console.error("Error duplicate flow:", error)
    }
    return null
  }

  const deleteFlow = async (flow_id) => {
    try {
      setIsLoading(true)
      await fetch(`/api/flows/${flow_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setStatus(!status)
      setIsLoading(false)
      setDeleteDialog(false)
    } catch (error) {
      console.error("Error delete flow:", error)
    }
    return null
  }
  return (
    <div className="flex  w-full flex-col">
      <main className="sm:py-0 md:gap-8">
        <div className="flex flex-col">
          <Link
            className="flex items-center justify-start self-start"
            href="/dashboard/flows/create-flow/select-template"
          >
            <Button size="sm" className="my-4 h-8 gap-1 py-2">
              <Plus className="size-3.5" />
              <span className="whitespace-nowrap">{t("Create new flow")}</span>
            </Button>
          </Link>

          <Card>
            <CardHeader
              style={{
                padding: paddingScreen !== "inherit" ? "1rem" : "1rem",
              }}
            >
              <CardTitle>{t("My flows")}</CardTitle>
              <CardDescription>
                {t("Manage your flows and view their performance")}
              </CardDescription>
            </CardHeader>
            <CardContent
              style={{
                padding: paddingScreen !== "inherit" ? paddingScreen : "1rem",
              }}
            >
              <div>
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="hidden w-[144px] sm:table-cell"
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        {t("Name")}
                      </TableHead>
                      <TableHead
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        {t("Status")}
                      </TableHead>
                      <TableHead
                        className="hidden lg:table-cell"
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        {t("Steps")}
                      </TableHead>
                      <TableHead
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        {t("Responses")}
                      </TableHead>
                      <TableHead
                        className="hidden lg:table-cell"
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        {t("Created at")}
                      </TableHead>
                      <TableHead
                        style={{
                          padding:
                            paddingScreen !== "inherit"
                              ? paddingScreen
                              : "1rem",
                        }}
                      >
                        <span className="sr-only">{t("Actions")}</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flows.length > 0 &&
                      flows.map((flow) => {
                        return (
                          <TableRow key={flow.id}>
                            <TableCell
                              onClick={() =>
                                router.push(`/dashboard/${flow.id}/create-flow`)
                              }
                              className="hidden hover:cursor-pointer sm:table-cell"
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              <Image
                                alt="Product image"
                                className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover "
                                height="64"
                                width="113"
                                src={
                                  flow.previewImage
                                    ? flow.previewImage
                                    : placeholder.src
                                }
                              />
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                router.push(`/dashboard/${flow.id}/create-flow`)
                              }
                              ref={
                                cellRef as
                                  | LegacyRef<HTMLTableCellElement>
                                  | undefined
                              }
                              className="font-bold hover:cursor-pointer"
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              {isClamped
                                ? splitAndJoin(flow.name, isClamped)
                                : flow.name}
                            </TableCell>
                            <TableCell
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              <Badge variant="outline">{t(flow.status)}</Badge>
                            </TableCell>
                            <TableCell
                              className="hidden lg:table-cell"
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              {flow.numberOfSteps ? flow.numberOfSteps : 0}
                            </TableCell>
                            <TableCell
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              {flow.numberOfResponses
                                ? flow.numberOfResponses
                                : 0}
                            </TableCell>
                            <TableCell
                              className="hidden lg:table-cell"
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              {formatDate(flow.createdAt)}
                            </TableCell>
                            <TableCell
                              style={{
                                padding:
                                  paddingScreen !== "inherit"
                                    ? paddingScreen
                                    : "1rem",
                              }}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="size-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {/* <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel> */}
                                  <DropdownMenuItem
                                    className="cursor-pointer pl-[12px]"
                                    onClick={() => editFlow(flow)}
                                  >
                                    {t("Edit")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer pl-[12px]"
                                    onClick={() => duplicateFlow(flow.id)}
                                  >
                                    {t("Duplicate")}
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem> */}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full justify-start bg-[none] text-black hover:bg-[#DC2626] hover:text-[#FAFAFA]"
                                    onClick={() => {
                                      setDeleteDialog(true)
                                      setFlow(flow)
                                    }}
                                  >
                                    {t("Delete")}
                                  </Button>
                                  {/* </DropdownMenuItem> */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {/* <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong> products
                  </div>
                </CardFooter> */}
          </Card>

          <AlertDialog open={deleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("Are you sure want to delete the Flow")}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteDialog(false)}>
                  {t("Cancel")}
                </AlertDialogCancel>
                <Button
                  disabled={isLoading}
                  variant="destructive"
                  size="sm"
                  className="bg-[#DC2626] text-[#FAFAFA]"
                  onClick={() => deleteFlow(flow && flow?.id)}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("Delete")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  )
}

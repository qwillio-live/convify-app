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
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const filterAllowedFields = (data) => {
  const allowedFields = ["name", "previewImage", "link", "status", "numberOfSteps"]
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
function splitAndJoin(word: string, isClamped: boolean) {
  if (isClamped) {
    let segments: string[] = []; // Explicitly define the type of the segments array
    for (let i = 0; i < word.length && i < 20; i += 1) {
      segments.push(word.substring(i, i + 1));
    }
    return segments.join('').trim() + "...";
  } else {
    return word;
  }
}
export function FlowsList({ flows, setStatus, status }) {
  const t = useTranslations("Dashboard")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [flow, setFlow] = useState<Flow>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [padding400, setPadding400] = useState<string>("inherit")
  const [padding05Rem, setPadding05Rem] = useState<string>("inherit")
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const currentPath = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    if (windowSize <= 360) {
      setPadding400("0")
    }
    else if (windowSize <= 375) {
      if (currentPath?.includes("pt")) {
        setPadding400("0")
        setPadding05Rem("0.5rem")
      } else {
        setPadding400("0.35rem")
      }
    }
    else if (windowSize <= 400) {
      setPadding400("0.75rem")
    }
  }, [windowSize])

  // const cellRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);
  useEffect(() => {
    if (windowSize > 600) {
      setIsClamped(false)
    }
  }, [windowSize])
  const cellRef = useRef<HTMLDivElement>(null); // Assign the correct type to cellRef

  useEffect(() => {
    const element = cellRef.current;
    if (windowSize <= 600) {
      if (element) {
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const maxLines = 3;
        const maxHeight = lineHeight * maxLines; // Calculate max height for 3 lines
        // Calculate content height based on actual content
        const contentHeight = element.scrollHeight;

        // Check if content exceeds maximum height
        if (contentHeight > maxHeight) {
          setIsClamped(true);
        }
      }
    }
  }, [windowSize]);
  const editFlow = async (flow) => {
    try {
      const filteredFlow = filterAllowedFields(flow)
      const res = await fetch(`/api/flows/${flow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(filteredFlow)
      })

      const result = await res.json()
      if (res.ok) {
        console.log("Flow edited successfully:", result)
        setStatus(!status)
      }
    } catch (error) {
      console.error("Error creating flow:", error)
    }
    return null
  }

  const duplicateFlow = async (flow_id) => {
    try {
      await fetch(`/api/flows/${flow_id}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
          "Content-Type": "application/json"
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
    <div className="flex min-h-screen w-full flex-col">
      <main className="sm:py-0 md:gap-8">
        <div className="flex flex-col">
          <Link
            className="flex items-center justify-start self-start"
            href="/dashboard/flows/create-flow"
          >
            <Button size="sm" className="my-4 h-8 gap-1 py-2">
              <Plus className="size-3.5" />
              <span className="whitespace-nowrap">{t("Create new flow")}</span>
            </Button>
          </Link>

          <Card>
            <CardHeader style={{
              padding: padding400 !== "inherit" ? "1rem" : "1.5rem"
            }}>
              <CardTitle>{t("My flows")}</CardTitle>
              <CardDescription>
                {t("Manage your flows and view their performance")}
              </CardDescription>
            </CardHeader>
            <CardContent
              style={{
                padding: padding400 !== "inherit" ? padding400 : "1.5rem"
              }}
            >
              <div>
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[144px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead>
                      <TableHead>{t("Name")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                      <TableHead>{t("Steps")}</TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("Responses")}
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {t("Created at")}
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">{t("Actions")}</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      flows.length > 0 && flows.map((flow) => {
                        return (
                          <TableRow key={flow.id}>
                            <TableCell className="hidden sm:table-cell"
                              style={{
                                padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                              }}
                            >
                              <Image
                                alt="Product image"
                                className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                                height="64"
                                width="113"
                                src={flow.previewImage ? flow.previewImage : placeholder.src}
                              />
                            </TableCell>
                            <TableCell ref={cellRef as LegacyRef<HTMLTableCellElement> | undefined} className="font-bold"
                              style={{
                                padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                              }}>
                              {isClamped ? splitAndJoin(flow.name, isClamped) : flow.name}
                            </TableCell>
                            <TableCell
                              style={{
                                padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                              }}>
                              <Badge variant="outline">{t(flow.status)}</Badge>
                            </TableCell>
                            <TableCell
                              style={{
                                padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                              }}>{flow.numberOfSteps ? flow.numberOfSteps : 0}</TableCell>
                            <TableCell className="hidden md:table-cell"
                              style={{
                                padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                              }}>{flow.numberOfResponses ? flow.numberOfResponses : 0}</TableCell>
                            <TableCell className="hidden md:table-cell"
                              style={{
                                padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                              }}>
                              {formatDate(flow.createdAt)}
                            </TableCell>
                            <TableCell style={{
                              padding: padding05Rem !== "inherit" ? padding05Rem : "1rem"
                            }}>
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
                                  <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                                  <DropdownMenuItem className="pl-[12px] cursor-pointer" onClick={() => editFlow(flow)}>{t("Edit")}</DropdownMenuItem>
                                  <DropdownMenuItem className="pl-[12px] cursor-pointer" onClick={() => duplicateFlow(flow.id)} >{t("Duplicate")}</DropdownMenuItem>
                                  {/* <DropdownMenuItem> */}
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-[none] text-black hover:text-[#FAFAFA] hover:bg-[#DC2626] w-full justify-start"
                                    onClick={() => { setDeleteDialog(true); setFlow(flow) }}
                                  >
                                    {t("Delete")}
                                  </Button>
                                  {/* </DropdownMenuItem> */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>)
                      })
                    }
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
                <AlertDialogTitle>{t("Are you sure want to delete the Flow")}</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteDialog(false)}>{t("Cancel")}</AlertDialogCancel>
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

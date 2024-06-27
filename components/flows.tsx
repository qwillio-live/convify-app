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
import { useEffect, useState } from "react"
import { Icons } from "@/components/icons"
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

export function FlowsList({ flows, setStatus }) {
  const t = useTranslations("Dashboard")
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [flow, setFlow] = useState<Flow>();
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
        setStatus(true)
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
      setStatus(true)
    } catch (error) {
      console.error("Error duplicate flow:", error)
    }
    return null
  }

  const deleteFlow = (flow_id) => {
    try {
      setIsLoading(true)
      fetch(`/api/flows/${flow_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      })
      setStatus(true)
      // setIsLoading(false)
    } catch (error) {
      console.error("Error delete flow:", error)
    }
    return null
  }
  console.log("flows", flows)
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
            <CardHeader>
              <CardTitle>{t("My flows")}</CardTitle>
              <CardDescription>
                {t("Manage your flows and view their performance")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Product image"
                                className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                                height="64"
                                width="113"
                                src={flow.previewImage ? flow.previewImage : placeholder.src}
                              />
                            </TableCell>
                            <TableCell className="font-bold">
                              {flow.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{flow.status}</Badge>
                            </TableCell>
                            <TableCell>{flow.numberOfSteps ? flow.numberOfSteps : 0}</TableCell>
                            <TableCell className="hidden md:table-cell">{flow.numberOfResponses ? flow.numberOfResponses : 0}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(flow.createdAt)}
                            </TableCell>
                            <TableCell>
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
                                  <DropdownMenuItem onClick={() => editFlow(flow)}>{t("Edit")}</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateFlow(flow.id)} >{t("Duplicate")}</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setDeleteDialog(true); setFlow(flow.id) }}>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="w-full justify-start"
                                    >
                                      {t("Delete")}
                                    </Button>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>)
                      })
                    }
                    {/* <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                          height="64"
                          width="113"
                          src={placeholder.src}
                        />
                      </TableCell>
                      <TableCell className="font-bold">
                        Laser Lemonade Machine
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Draft</Badge>
                      </TableCell>
                      <TableCell>499</TableCell>
                      <TableCell className="hidden md:table-cell">25</TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-07-12 10:42
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Duplicate")}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {t("Delete")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                          height="64"
                          width="113"
                          src={placeholder.src}
                        />
                      </TableCell>
                      <TableCell className="font-bold" style={{ overflowWrap: 'break-word', maxWidth: '100px' }}>
                        Hypernova Headphones
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell>129</TableCell>
                      <TableCell className="hidden md:table-cell">100</TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-10-18 15:21
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Duplicate")}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {t("Delete")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                          height="64"
                          width="113"
                          src={placeholder.src}
                        />
                      </TableCell>
                      <TableCell className="font-bold">
                        AeroGlow Desk Lamp
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell>39</TableCell>
                      <TableCell className="hidden md:table-cell">50</TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-11-29 08:15
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Duplicate")}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {t("Delete")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                          height="64"
                          width="113"
                          src={placeholder.src}
                        />
                      </TableCell>
                      <TableCell className="font-bold">
                        TechTonic Energy Drink
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Draft</Badge>
                      </TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="hidden md:table-cell">0</TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-12-25 23:59
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Duplicate")}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {t("Delete")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                          height="64"
                          width="113"
                          src={placeholder.src}
                        />
                      </TableCell>
                      <TableCell className="font-bold">
                        Gamer Gear Pro Controller
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell>59</TableCell>
                      <TableCell className="hidden md:table-cell">75</TableCell>
                      <TableCell className="hidden md:table-cell">
                        2024-01-01 00:00
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Duplicate")}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {t("Delete")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                          height="64"
                          width="113"
                          src={placeholder.src}
                        />
                      </TableCell>
                      <TableCell className="font-bold">
                        Luminous VR Headset
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell>199</TableCell>
                      <TableCell className="hidden md:table-cell">30</TableCell>
                      <TableCell className="hidden md:table-cell">
                        2024-02-14 14:14
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem>{t("Edit")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("Duplicate")}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full justify-start"
                              >
                                {t("Delete")}
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow> */}
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

        </div>
      </main>

      <AlertDialog open={deleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Are you sure want to delete the Flow")}</AlertDialogTitle>
            {/* <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <button
              className={cn(buttonVariants())}
              disabled={isLoading}
              style={{ fontWeight: "600", background: 'red' }}
              onClick={() => deleteFlow(flow && flow?.id)}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("Delete")}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

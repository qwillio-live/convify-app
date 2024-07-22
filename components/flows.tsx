"use client"

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

export function FlowsList() {
  const t = useTranslations("Dashboard")

  return (
    <div className="flex min-h-screen w-full flex-col">
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
            <CardHeader>
              <CardTitle>{t("My flows")}</CardTitle>
              <CardDescription>
                {t("Manage your flows and view their performance")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
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
                  <TableRow>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover"
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
                        className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover"
                        height="64"
                        width="113"
                        src={placeholder.src}
                      />
                    </TableCell>
                    <TableCell className="font-bold">
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
                        className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover"
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
                        className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover"
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
                        className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover"
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
                        className="aspect-video !min-h-16 !w-auto min-w-[113px] rounded-md object-cover"
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
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            {/* <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter> */}
          </Card>
        </div>
      </main>
    </div>
  )
}

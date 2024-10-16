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
import { Skeleton } from "./ui/skeleton"

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
const SkeletonFlowCard = () => {
    // Example state to simulate loading
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [flow, setFlow] = useState(null);

    const [flows, setFlows] = useState<Flow[]>([]);

    // Function to format date (replace with your actual date formatting function)
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Function to delete a flow (replace with your actual delete function)
    const deleteFlow = (flowId) => {
        // Implement delete logic here
        console.log(`Deleting flow with ID: ${flowId}`);
    };

    // Function to edit a flow (replace with your actual edit function)
    const editFlow = (flow) => {
        // Implement edit logic here
        console.log(`Editing flow: ${flow.name}`);
    };

    // Function to duplicate a flow (replace with your actual duplicate function)
    const duplicateFlow = (flowId) => {
        // Implement duplicate logic here
        console.log(`Duplicating flow with ID: ${flowId}`);
    };

    // Placeholder skeleton markup
    const skeletonMarkup = (
            <div className="grid w-full gap-10">
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-[38px] w-[90px]" />
            <Skeleton className="h-[38px] w-[80px]" />
          </div>
          <div className="mx-auto w-[800px] space-y-6">
            <Skeleton className="h-[50px] w-full" />
            <Skeleton className="h-[20px] w-2/3" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
          </div>
        </div>
    );

    // Render skeleton or actual content based on loading state
    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="sm:py-0 md:gap-8">
                {isLoading ? skeletonMarkup : (
                    <div className="flex flex-col">
                        {/* <Link
                            className="flex items-center justify-start self-start"
                            href="/create-flow"
                        >
                            <Button size="sm" className="my-4 h-8 gap-1 py-2">
                                <Plus className="size-3.5" />
                                <span className="whitespace-nowrap">Create new flow</span>
                            </Button>
                        </Link> */}

                        <Card>
                            <CardHeader>
                                <CardTitle>My flows</CardTitle>
                                <CardDescription>
                                    Manage your flows and view their performance
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
                                                <TableHead>Name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Steps</TableHead>
                                                <TableHead className="hidden md:table-cell">Responses</TableHead>
                                                <TableHead className="hidden md:table-cell">Created at</TableHead>
                                                <TableHead>
                                                    <span className="sr-only">Actions</span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {flows.map((flow) => (
                                                <TableRow key={flow.id}>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Image
                                                            alt="Product image"
                                                            className="aspect-video rounded-md object-cover !w-auto min-w-[113px] !min-h-16"
                                                            height="64"
                                                            width="113"
                                                            src={flow.previewImage ? flow.previewImage : 'placeholder-url'}
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
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => editFlow(flow)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => duplicateFlow(flow.id)}>Duplicate</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => { setDeleteDialog(true); }}>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="w-full justify-start"
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delete confirmation dialog */}
                        <AlertDialog open={deleteDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete the Flow?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteDialog(false)}>Cancel</AlertDialogCancel>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Delete
                                    </button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SkeletonFlowCard;
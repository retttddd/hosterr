"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import Link from "next/link";

type Storage = {
    id: number
    name: string
    status?: string
    created_at?: Date | string
}

type StorageTableProps = {
    storages: Storage[]
}

export function StorageTable({ storages }: StorageTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {storages.map((storage) => (
                    <TableRow key={storage.id}>
                        <TableCell className="font-medium font-bold text-primary">
                            {storage.name}
                        </TableCell>
                        <TableCell>
                            {storage.status ?? "Unknown"}
                        </TableCell>
                        <TableCell>
                            {storage.created_at
                                ? new Date(storage.created_at).toLocaleDateString()
                                : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button asChild size="sm">
                                <Link href={`/storage/${storage.id}`}>
                                    Connect
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

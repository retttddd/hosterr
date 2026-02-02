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
import * as React from "react";

type Storage = {
    id: number
    name: string
    status: string
    memory: string
}

export function StorageTable({ storages }: { storages: Storage[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Memory allocation</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {storages.map((storage) => (
                    <TableRow key={storage.id}>
                        <TableCell className="font-medium font-bold text-primary"> {storage.name} </TableCell>
                        <TableCell> {storage.status} </TableCell>
                        <TableCell> {storage.memory} </TableCell>
                        <TableCell className="text-right">
                            <Button onClick={() => { }} size="sm">
                                <Link href={`/storage/${storage.name}`}>
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

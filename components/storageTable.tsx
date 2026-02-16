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
import { useStorageStore } from "@/lib/stores/storage-store";
import { useRouter } from "next/navigation";
import * as React from "react";

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
    const router = useRouter();
    const setSelectedStorageData = useStorageStore((state) => state.setSelectedStorageData);
    const [connectingStorageId, setConnectingStorageId] = React.useState<number | null>(null);

    const handleConnect = async (storage: Storage) => {
        try {
            setConnectingStorageId(storage.id);

            const query = new URLSearchParams({ name: storage.name });
            const filesResponse = await fetch(`/api/minio/files?${query.toString()}`);
            if (!filesResponse.ok) {
                throw new Error("Could not load storage files");
            }
            const filesData = await filesResponse.json();
            const files = Array.isArray(filesData.files) ? filesData.files : [];

            setSelectedStorageData(
                {
                    id: storage.id,
                    name: storage.name,
                    status: storage.status,
                    created_at: storage.created_at,
                },
                files
            );

            router.push(`/storage/${storage.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setConnectingStorageId(null);
        }
    };

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
                            <Button
                                size="sm"
                                onClick={() => handleConnect(storage)}
                                disabled={connectingStorageId === storage.id}
                            >
                                {connectingStorageId === storage.id ? "Connecting..." : "Connect"}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

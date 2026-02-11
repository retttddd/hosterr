import { Card, CardContent } from "@/components/ui/card";
import { Title } from "@/components/start-page";
import { StorageTable } from "@/components/storageTable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Header } from "@/components/header";
import { getStorageByEmail } from "@/lib/features/db/users.repository";
import {getStorages, type Storage} from "@/lib/features/db/storages.repository"

export default async function StoragePage() {

    const session = await getServerSession();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const storages = await getStorageByEmail(session.user.email);

    return (
        <>
            <Header />

            <div className="flex flex-col gap-8 p-10 m-20">
                <Title>Available storages</Title>

                <Card className="w-full max-w-2xl">
                    <CardContent>
                        <StorageTable storages={storages as unknown as Storage[]} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

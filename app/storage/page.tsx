import { Card, CardContent } from "@/components/ui/card";
import { Title } from "@/components/start-page";
import { StorageTable } from "@/components/storageTable";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Header } from "@/components/header";
import { getStorageByEmail } from "@/lib/features/db/users.repository";
import { type Storage } from "@/lib/features/db/storages.repository"

export default async function StoragePage() {

    const session = await getServerSession();

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const storages = await getStorageByEmail(session.user.email);

    return (
        <>
            <Header />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:px-10">
                <Title>Available storages</Title>

                <Card className="w-full max-w-4xl">
                    <CardContent>
                        <StorageTable storages={storages as unknown as Storage[]} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

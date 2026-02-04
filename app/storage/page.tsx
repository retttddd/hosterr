import {Card, CardContent} from "@/components/ui/card";
import {Title} from "@/components/start-page";
import {StorageTable} from "@/components/storageTable";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {getStorages, type Storage} from "@/lib/features/db/storages.repository";
import React from "react";
import {Header} from "@/components/header";


export default async function storagePage() {
    const session = await getServerSession();
    console.log(session)
    if (!session) {
        return redirect("/login");
    }

    const storages = [{ id: 1, name: "Storage 1", status: "Active", created_at: new Date() }]; //TODO replace with actual user ID

    return (
        <>
            <Header />
            <div className="flex flex-col gap-8 p-10 m-20">
                <Title>
                    Available storages
                </Title>


                <Card className="w-full max-w-2xl">
                    <CardContent>
                        <StorageTable storages={storages as unknown as Storage[]} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

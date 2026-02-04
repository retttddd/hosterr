import { Title } from "@/components/start-page";
import {LoginCard} from "@/components/loginCard";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Toaster} from "sonner";
import * as React from "react";

export default async function  loginPage() {
    const session = await getServerSession();

    if (session) {
        redirect("/storage");
    }

    return (
        <>
            <div className="flex flex-col gap-8 p-10 m-20">
                <Title>
                    Log into your storage manager or <Link href="/" className="text-primary font-bold">go to start page</Link>
                </Title>
                <Toaster />
                <LoginCard/>
            </div>
        </>
    );
}

import { Title } from "@/components/start-page";
import {LoginCard} from "@/components/loginCard";
import Link from "next/link";
import {Toaster} from "sonner";

export default async function  loginPage() {

    return (
        <>
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:px-10">
                <Title>
                    Log into your storage manager or <Link href="/" className="text-primary font-bold">go to start page</Link>
                </Title>
                <Toaster />
                <LoginCard/>
            </div>
        </>
    );
}

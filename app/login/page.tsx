import { Title } from "@/components/start-page";
import {LoginCard} from "@/components/loginCard";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function  loginPage() {
    const session = await getServerSession();
    console.log({ session });

    if (session) {
        redirect("/storage");
    }

    return (
        <div className="flex flex-col gap-8 p-10 m-20">
            <Title>
                Log into your storage manager
            </Title>
            <LoginCard />
        </div>
    );
}

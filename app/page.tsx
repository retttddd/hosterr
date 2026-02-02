import { StartPage } from "@/components/start-page";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function Page() {
    const session = await getServerSession();


    if (session) {
        redirect(process.env.NEXTAUTH_URL + "/storage");
    }
return <StartPage />;
}

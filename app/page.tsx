import { StartPage } from "@/components/start-page";
import {getServerSession} from "next-auth";

export default async function Page() {
    const session = await getServerSession();
return <StartPage session={session} />;
}

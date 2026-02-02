import { Title } from "@/components/start-page";
import {LoginCard} from "@/components/loginCard";

export default function loginPage() {

    return (
        <div className="flex flex-col gap-8 p-10 m-20">
            <Title>
                Log into your storage manager
            </Title>
            <LoginCard />
        </div>
    );
}

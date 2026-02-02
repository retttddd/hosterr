import {NextRequest, NextResponse} from "next/server";
import {createUser} from "@/lib/features/db/users.repository";
import {hash} from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const { name, password, email } = await request.json();
        const hashedPassword = await hash(password, 10);

        const response = await createUser(name, hashedPassword, email);
        if (response) {
            return NextResponse.json({ message: "success", user: response });
        }
    } catch (e) {
        console.error({ e });
        return NextResponse.json({ error: e.message || "Error creating user" }, { status: 500 });
    }
}

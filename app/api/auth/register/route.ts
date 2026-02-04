import {NextRequest, NextResponse} from "next/server";
import {createUserWithStorage} from "@/lib/features/db/users.repository";
import {hash} from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const { status, storageName, defaultUser, password, email } = await request.json();

        const hashedPassword = await hash(password, 10);

        const { user, storage } = await createUserWithStorage(
            defaultUser,
            hashedPassword,
            email,
            storageName,
            status
        );

        return NextResponse.json({
            message: "success",
            user: user.id,
            storage: storage.id
        });

    } catch (e: unknown) {
        console.error({ e });
        return NextResponse.json({ error: e instanceof Error ? e.message : "Error creating user" }, { status: 500 });
    }
}

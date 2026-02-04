import { NextResponse } from "next/server";
import { getStorages } from "@/lib/features/db/storages.repository";

export async function GET() {
    try {
        const storages = await getStorages();
        return NextResponse.json({ storages });
    } catch (error) {
        console.error("Error fetching storages:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

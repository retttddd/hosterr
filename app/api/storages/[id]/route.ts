import { NextRequest, NextResponse } from "next/server";
import getStorageById from "@/lib/features/db/storages.repository";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { error: "Invalid storage ID" },
                { status: 400 }
            );
        }

        const storage = await getStorageById(Number(id));

        if (!storage) {
            return NextResponse.json(
                { error: "Storage not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ storage });
    } catch (error) {
        console.error("Error fetching storage:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

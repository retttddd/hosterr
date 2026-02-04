
import sql from "./db";

export type Storage = {
    id: number;
    name: string;
    status?: string;
    created_at: Date;
};

export async function getStorages(): Promise<Storage[]> {
    const rows = await sql`
    SELECT id, name, status, created_at
    FROM storages
    ORDER BY created_at DESC
  `;
    return rows as unknown as Storage[];
}

export default async function getStorageById(id: number) {
    const rows = await sql<Storage[]>`
    SELECT id, name, status, created_at
    FROM storages
    WHERE id = ${id}
  `;
    return rows[0];
}

export async function createStorage(name: string, status: string, userId: number) {
    if (!name || !status || !userId) {
        console.error(name, status, userId);
        throw new Error("Name, status, and userId are required");
    }
    const rows = await sql`
    INSERT INTO storages (name, status, user_id)
    VALUES (${name}, ${status}, ${userId})
    RETURNING id, created_at
  `;
    return rows[0];
}

export async function deleteStorage(id: number) {
    await sql`
    DELETE FROM storages
    WHERE id = ${id}
  `;
}

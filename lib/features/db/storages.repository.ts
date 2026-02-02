
import sql from "./db";

export async function getStorages() {
    return await sql`
    SELECT id, name, created_at
    FROM storages
    ORDER BY created_at DESC
  `;
}

export async function getStorageById(id: number) {
    const rows = await sql`
    SELECT id, name, created_at
    FROM storages
    WHERE id = ${id}
  `;
    return rows[0];
}

export async function createStorage(name: string) {
    const rows = await sql`
    INSERT INTO storages (name)
    VALUES (${name})
    RETURNING id, name, created_at
  `;
    return rows[0];
}

export async function deleteStorage(id: number) {
    await sql`
    DELETE FROM storages
    WHERE id = ${id}
  `;
}

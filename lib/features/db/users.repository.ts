import sql from "./db";

export async function createUser(name?: string, password?: string, email?: string) {
    if (!name || !password || !email) {
        throw new Error("Name, password, and email are required");
    }

    return sql`
    INSERT INTO users (name, password, email, storage_id)
    VALUES (${name}, ${password}, ${email}, 1)
    RETURNING id, name, created_at
  `;
}

export async function findUser(email?: string) {
    if (!email) {
        throw new Error("Email is required");
    }

    const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
    return result[0] || null;
}


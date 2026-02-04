import sql from "./db";

export async function createUser(name?: string, password?: string, email?: string) {
    if (!name || !password || !email ) {
        throw new Error("Name, password, email, and storageId are required");
    }
    return sql`
    INSERT INTO users (name, password, email)
    VALUES (${name}, ${password}, ${email})
    RETURNING id
  `;
}

export async function createUserWithStorage(
    name: string,
    password: string,
    email: string,
    storageName: string,
    storageStatus: string
) {
    if (!name || !password || !email || !storageName || !storageStatus) {
        throw new Error("All fields are required");
    }

    return await sql.begin(async (sql) => {
        const [user] = await sql`
            INSERT INTO users (name, password, email)
            VALUES (${name}, ${password}, ${email})
            RETURNING id
        `;

        const [storage] = await sql`
            INSERT INTO storages (name, status, user_id)
            VALUES (${storageName}, ${storageStatus}, ${user.id})
            RETURNING id, created_at
        `;

        return { user, storage };
    });
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


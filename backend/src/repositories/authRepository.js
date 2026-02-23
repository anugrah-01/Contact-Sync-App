import pool from "../config/db.js";

export const createUser = async(name, email, password) => {
    const query = 
        `INSERT INTO users (name, email, password)
        VALUES  ($1, $2, $3)
        RETURNING id, name, email, created_at `;

    const values = [name, email, password];
    const result = await pool.query(query, values);

    return result.rows[0];
};
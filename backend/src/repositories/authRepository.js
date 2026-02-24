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

export const getUserByEmail = async(email) => {
    const query = 
        `SELECT id, email, password
        FROM users where email = $1`;
    const result  = await pool.query(query, [email]);

    return result.rows[0];
};
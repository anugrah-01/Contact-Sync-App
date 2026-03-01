import pool from "../config/db.js";

export const createContact = async(name, email, phone, user_id) =>{
    const query = 
        `INSERT INTO contacts (name, email, phone, user_id)
        VALUES  ($1, $2, $3, $4)
        RETURNING id, name, email, phone, created_at`

        const values = [name, email, phone, user_id];
        const result = await pool.query(query, values);

        return result.rows[0];
};

export const getContactsByUserId = async(user_id) => {
    const query = 
        `SELECT * FROM contacts
        WHERE user_id = $1`
    const values = [user_id];
    const result = await pool.query(query, values);

    return result.rows;
};
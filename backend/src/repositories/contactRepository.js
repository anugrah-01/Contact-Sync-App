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

export const getContactById = async(contactId, user_id) => {
    const query = 
        `SELECT id, name, email, phone, created_at
        FROM contacts
        WHERE id = $1 AND user_id = $2`
    
    const values = [contactId, user_id];
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const updateContact = async(contactId, user_id, name, email, phone) => {
    const query = 
        `UPDATE contacts 
        SET name = $3, email = $4, phone = $5
        WHERE id = $1 AND user_id = $2
        RETURNING id, name, email, phone, created_at`

    const values = [contactId, user_id, name, email, phone];
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const deleteContact = async(contactId, user_id) => {
    const query = 
        `DELETE FROM contacts
        WHERE id = $1 and user_id = $2
        RETURNING id, name, email, phone, created_at`
    
    const values = [contactId, user_id];
    const result = await pool.query(query, values);

    return result.rows[0];
};
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "contact_sync",
    password: "postgres",
    port: 5432
});

pool.connect()
    .then(() => {
        console.log("Database Connected Succesfully");
    })
    .catch((err) => {
        console.log("Database Connection Failed:", err.message);
    });

export default pool;
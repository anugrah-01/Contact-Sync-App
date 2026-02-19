import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("ContactSync Backend Running");
})

export default app;
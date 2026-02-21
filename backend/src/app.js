import express from "express";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

app.use("/api", healthRoutes);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("ContactSync Backend Running");
})

export default app;
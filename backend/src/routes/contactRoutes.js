import express, { Router } from "express";
import { createContact } from "../controllers/contactController.js";
import { authMidd } from "../middlewares/authMiddleware.js";
import { getContacts } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", authMidd, createContact);
router.get("/", authMidd, getContacts);

export default router;
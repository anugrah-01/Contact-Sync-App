import express from "express";
import { createContact } from "../controllers/contactController.js";
import { authMidd } from "../middlewares/authMiddleware.js";
import { getContacts } from "../controllers/contactController.js";
import { getContactById } from "../controllers/contactController.js";
import { updateContact } from "../controllers/contactController.js";
import { deleteContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", authMidd, createContact);
router.get("/", authMidd, getContacts);
router.get("/:id", authMidd, getContactById);
router.put("/:id", authMidd, updateContact);
router.delete("/:id", authMidd, deleteContact);

export default router;
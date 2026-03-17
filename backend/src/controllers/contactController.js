import { createContactService } from "../services/contactService.js";
import { getContactsService } from "../services/contactService.js";
import { getContactByIdService } from "../services/contactService.js";
import { updateContactService } from "../services/contactService.js";
import { deleteContactService } from "../services/contactService.js";
import { generateContactService } from "../services/contactService.js";

export const createContact = async(req, res, next) => {
    try {
        const contactData = req.body;
        const userId = req.user.userid;
        
        const newContact = await createContactService(contactData, userId);

        res.status(201).json({
            message: "Contact created successfully",
            contact : newContact
        });
    } catch (error) {
        next(error);
    }
};

export const getContacts = async(req, res, next) => {
    try {
        const userId = req.user.userid;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const allContacts = await getContactsService(userId, page, limit);
        res.status(200).json(allContacts);

    } catch (error) {
        next(error);
    }
};

export const getContactById = async(req, res, next) =>{
    try {
        const contactId = req.params.id;
        const userId = req.user.userid;

        const contact = await getContactByIdService(contactId, userId);
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async(req, res, next) =>{
    try {
        const contactId = req.params.id;
        const userId = req.user.userid;

        const contactData = req.body;
        const updatedContact = await updateContactService(contactId, userId, contactData);

        res.status(200).json({
            message: "Contact updated successfully",
            contact : updatedContact
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async(req, res, next) => {
    try {
        const contactId = req.params.id;
        const userId = req.user.userid;

        const deletedContact = await deleteContactService(contactId, userId);

        res.status(200).json({
            message: "Contact deleted successfully",
            contact : deletedContact
        });
    } catch (error) {
        next(error);
    }
};

export const generateContact = async(req, res) => {
    try {
        const userId = req.user.userid;
        const contact = await generateContactService(userId);

        res.status(200).json({
            message: "Random contact generated",
            contact
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
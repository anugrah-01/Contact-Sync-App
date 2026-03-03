import { createContactService } from "../services/contactService.js";
import { getContactsService } from "../services/contactService.js";
import { getContactByIdService } from "../services/contactService.js"


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
        const allContacts = await getContactsService(userId);
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
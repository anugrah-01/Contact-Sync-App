import { createContactService } from "../services/contactService.js";
import { getContactsService } from "../services/contactService.js";


export const createContact = async(req, res) => {
    try {
        const contactData = req.body;
        const userId = req.user.userid;
        
        const newContact = await createContactService(contactData, userId);

        res.status(201).json({
            message: "Contact created successfully",
            contact : newContact
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const getContacts = async(req, res) => {
    try {
        const userId = req.user.userid;
        const allContacts = await getContactsService(userId);
        res.status(200).json(allContacts);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
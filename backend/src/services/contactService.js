import { createContact, deleteContact } from "../repositories/contactRepository.js";
import { getContactsByUserId } from "../repositories/contactRepository.js";
import { getContactById } from "../repositories/contactRepository.js";
import { updateContact } from "../repositories/contactRepository.js";
import { deleteContact } from "../repositories/contactRepository.js";

export const createContactService = async(contactData, userId) => {

    const {name, email, phone} = contactData;

    if(!name){
        const err = new Error("Invalid name");
        throw err;
    }

    const createdContact = await createContact(name, email, phone, userId);

    return createdContact;
};

export const getContactsService = async(userId, page, limit) => {

    const offset = (page - 1) * limit;
    const allContacts = await getContactsByUserId(userId, limit, offset);

    return allContacts;
};

export const getContactByIdService = async(contactId, userId) =>{

    const contact = await getContactById(contactId, userId);

    if(!contact){
        const err = new Error("Contact not found");
        err.statusCode = 404;
        throw err;
    }

    return contact;
};

export const updateContactService = async(contactId, userId, contactData) => {

    const { name, email, phone } = contactData;
    const updatedContact = await updateContact(contactId, userId, name, email, phone);

    if(!updatedContact){
        const err = new Error("Contact not found");
        err.statusCode = 404;
        throw err;
    }

    return updatedContact;
};

export const deleteContactService = async(contactId, userId) => {

    const deletedContact = await deleteContact(contactId, userId);

    if(!deletedContact){
        const err = new Error("Contact not found");
        err.statusCode = 404;
        throw err;
    }

    return deletedContact;
};
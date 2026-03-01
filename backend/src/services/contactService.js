import { createContact } from "../repositories/contactRepository.js";
import { getContactsByUserId } from "../repositories/contactRepository.js";

export const createContactService = async(contactData, userId) => {

    const {name, email, phone} = contactData;

    if(!name){
        const err = new Error("Invalid name");
        throw err;
    }

    const createdContact = await createContact(name, email, phone, userId);

    return createdContact;
};

export const getContactsService = async(userId) => {

    const allContacts = await getContactsByUserId(userId);

    return allContacts;
};
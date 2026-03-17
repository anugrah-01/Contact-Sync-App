import { createContact } from "../repositories/contactRepository.js";
import { getContactsByUserId } from "../repositories/contactRepository.js";
import { getContactById } from "../repositories/contactRepository.js";
import { updateContact } from "../repositories/contactRepository.js";
import { deleteContact } from "../repositories/contactRepository.js";
import axios from "axios";

export const createContactService = async(contactData, userId) => {

    let company = null;
    let location = null;

    const {name, email, phone} = contactData;
    const domain = email.split("@")[1];
    
    try {
        const response = await axios.get(`https://companyenrichment.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&domain=${domain}`);
        console.log(response.data);

        if(response.data){
            company = response.data?.name || null;
            location = response.data?.locality ? `${response.data.locality}, ${response.data.country}` : null;
        }
        console.log("Company:", company, "Location:", location);
        
    } catch (error) {
        console.log("Company enrichment failed:", error.message);
    }

    if(!name){
        const err = new Error("Invalid name");
        throw err;
    }

    const createdContact = await createContact(name, email, phone, company, location, userId);

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

export const generateContactService = async(userId) => {
    const res = await axios.get("https://randomuser.me/api/");  //fetch random user data from external API
    const user = res.data.results[0];

    const name = `${user.name.first} ${user.name.last}`;
    const phone = user.phone;

    const companyDomains = ["stripe.com", "shopify.com", "tesla.com", "airbnb.com", "google.com", "amazon.com"];

    const randomDomain = companyDomains[Math.floor(Math.random() * companyDomains.length)];
    const email = `${user.name.first.toLowerCase()}.${user.name.last.toLowerCase()}@${randomDomain}`;  //generate email using random domain from the list

    const domain = email.split("@")[1];
    let company = null;
    let location = null;

    try {
        const response = await axios.get(`https://companyenrichment.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&domain=${domain}`);
        console.log(response.data);
        company = response.data?.name || null;
        location = response.data?.locality ? `${response.data.locality}, ${response.data.country}` : null;
    } catch (error) {
        console.log("Company enrichment failed:", error.message);
    }

    const createdContact = await createContact(name, email, phone, company, location, userId);
    console.log("Generated contact:", createdContact);

    return createdContact;
};
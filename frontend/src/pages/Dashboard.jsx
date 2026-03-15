import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [contacts, setContacts] = useState([]); //state to hold contacts fetched from backend so setContacts is used to update it

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [editingContactId, setEditingContactId] = useState(null); //state to track which contact is being edited, if any

    const [loading, setLoading] = useState(true); //state to track loading status of contacts, initially set to true while we fetch contacts from backend

    const navigate = useNavigate();

    useEffect(() => {     //runs when component mounts/ page loads, fetches contacts from backend and updates state with setContacts, then contacts are displayed in the UI
        fetchContacts();   
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);       
            const res = await api.get("/contacts");
            setContacts(res.data);     //update contacts state with data from backend so setContacts will contain contacts like [{id: 1, name: "John Doe", email: "john.doe@example.com"}]
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);  //set loading to false once we have fetched contacts, this can be used to hide the loading indicator in the UI
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();    //prevent default form submission behavior which would cause a page reload, we want to handle form submission with JavaScript instead

        try{
             if (editingContactId) {

                await api.put(`/contacts/${editingContactId}`, {
                    name,
                    email,
                    phone
                });   //update existing contact in the backend with new data from form fields

            } else {
                await api.post("/contacts", {name, email, phone});  //send new contact data to backend to create a new contact in the database
            }

            fetchContacts();   //after adding a contact, fetch the updated list of contacts to reflect the new contact in the UI

            setName("");   //clear form fields after adding a contact
            setEmail("");
            setPhone("");

            setEditingContactId(null);  //clear editingContactId state to indicate that we are no longer editing a contact'

        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await api.delete(`/contacts/${contactId}`);
            fetchContacts();   //after deleting a contact, fetch the updated list of contacts to reflect the deletion in the UI
        } catch (err) {
            console.log(err);
        }
    }

    const handleEditContact = (contact) => {
        setEditingContactId(contact.id);

        setName(contact.name || "");   //populate form fields with existing contact data so user can edit it, if any field is missing (like phone), we set it to an empty string to avoid uncontrolled input issues in React
        setEmail(contact.email || "");
        setPhone(contact.phone || "");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");  //remove token from local storage to log the user out
        navigate("/login");   //navigate user back to login page after logging out
    }

    return (
        <div>
            <h1>Dashboard</h1>  

            <button onClick={handleLogout}>Logout</button>  {/* when user clicks logout button, handleLogout function is called to log the user out and navigate them back to the login page */} 

            <h2>Add Contact</h2>   

            <form onSubmit={handleSubmit}>  {/* when form is submitted, handleSubmit function is called to either add a new contact or update an existing contact based on whether editingContactId is set or not */}
                <input type="text" placeholder="Name" value={name || ""} onChange={e => setName(e.target.value)}/>
                <br />

                <input type="email" placeholder="Email" value={email || ""} onChange={e => setEmail(e.target.value)} />
                <br />

                <input type="text" placeholder="Phone" value={phone || ""} onChange={e => setPhone(e.target.value)} />
                <br />

                <button type="submit">
                    {editingContactId ? "Update Contact" : "Add Contact"}
                </button>
            </form>

            <h2>Your Contacts</h2>

            {loading ? (
                <p>Loading contacts...</p>   //display loading message while contacts are being fetched from backend
            ) : (contacts.map(contact => (   //map function is used to iterate over contacts array and display each contact's name and email in the UI, each contact is displayed in a div with a unique key (contact.id) to help React identify which items have changed, are added, or are removed
                    <div key={contact.id}>
                        <p>Name: {contact.name}</p>
                        <p>Email: {contact.email}</p>
                        <p>Phone: {contact.phone}</p>

                        <button onClick={() => handleEditContact(contact)}>
                            Edit
                        </button>

                        <button onClick={() => handleDeleteContact(contact.id)}>
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Dashboard;
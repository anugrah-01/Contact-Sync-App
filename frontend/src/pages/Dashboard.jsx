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
        <div className="min-h-screen bg gray-100 p-8">

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">

                <div className="flex justify-between items-center mb-6">

                    <h1 className="text-2xl font-bold">Dashboard</h1>

                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                        Logout
                    </button>

                </div>  {/* when user clicks logout button, handleLogout function is called to log the user out and navigate them back to the login page */} 
                

                <form onSubmit={handleSubmit} className="space-y-3">  {/* when form is submitted, handleSubmit function is called to either add a new contact or update an existing contact based on whether editingContactId is set or not */}
                    <input type="text" placeholder="Name" value={name || ""} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded"/>

                    <input type="email" placeholder="Email" value={email || ""} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded"/>

                    <input type="text" placeholder="Phone" value={phone || ""} onChange={e => setPhone(e.target.value)} className="w-full border p-2 rounded"/>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        {editingContactId ? "Update Contact" : "Add Contact"}
                    </button>
                </form>

                <h2 className="text-xl font-semibold mt-6 mb-3">
                    Your Contacts
                </h2>

                {loading ? (
                <p>Loading contacts...</p>
                ) : (
                    contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="border p-3 mb-2 rounded flex justify-between items-center"
                            >

                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                                <p className="text-sm text-gray-600">{contact.phone}</p>
                            </div>

                            <div className="space-x-2">

                                <button
                                onClick={() => handleEditContact(contact)}
                                className="bg-yellow-400 px-3 py-1 rounded"
                                >
                                Edit
                                </button>

                                <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                Delete
                                </button>

                            </div>

                        </div>
                    ))
                )}
            </div>
            
        </div>
    );
}

export default Dashboard;
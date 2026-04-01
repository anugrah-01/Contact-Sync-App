import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
    const [contacts, setContacts] = useState([]); //state to hold contacts fetched from backend so setContacts is used to update it

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [editingContactId, setEditingContactId] = useState(null); //state to track which contact is being edited, if any

    const [loading, setLoading] = useState(true); //state to track loading status of contacts, initially set to true while we fetch contacts from backend
    const [searchTerm, setSearchTerm] = useState(""); 

    const navigate = useNavigate();

    useEffect(() => {     //runs when component mounts/ page loads, fetches contacts from backend and updates state with setContacts, then contacts are displayed in the UI
      const token = localStorage.getItem("token");

      if (!token) {
          navigate("/"); // 👈 go to login/signup selector page
          return;
      }  
      fetchContacts();   
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);       
            const res = await api.get("/api/contacts");
            setContacts(res.data);     //update contacts state with data from backend so setContacts will contain contacts like [{id: 1, name: "John Doe", email: "john.doe@example.com"}]
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to fetch contacts. Please try again.");  //show a toast if there was an error fetching contacts from backend
        } finally {
            setLoading(false);  //set loading to false once we have fetched contacts, this can be used to hide the loading indicator in the UI
        }
    };

    const generateRandomContact = async () => {
        try {
            const res = await api.post("/api/contacts/generate");  //call backend endpoint to generate a random contact, backend will use randomuser API to get random contact data and create a new contact in the database
            toast.success("Contact generated");
            fetchContacts();   //after generating a random contact, fetch the updated list of contacts to reflect the new contact in the UI

        } catch (error) {
            console.error(error);
            console.error("BACKEND RESPONSE:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                "Failed to generate contact (check backend logs)"
            );
        }
    };

    /*response of randomuser API looks like this:
    {
    "results": [
        {
        "name": {
            "first": "John",
            "last": "Doe"
        },
        "email": "
        "phone": "123-456-7890"
        }
        ]
    }
    */

    const handleSubmit = async (e) => {
        e.preventDefault();    //prevent default form submission behavior which would cause a page reload, we want to handle form submission with JavaScript instead

        try{
             if (editingContactId) {

                await api.put(`/api/contacts/${editingContactId}`, {
                    name,
                    email,
                    phone
                });   //update existing contact in the backend with new data from form fields
                toast.success("Contact updated");

            } else {
                await api.post("/api/contacts", {name, email, phone});  //send new contact data to backend to create a new contact in the database
                toast.success("Contact added");
            }

            fetchContacts();   //after adding a contact, fetch the updated list of contacts to reflect the new contact in the UI

            setName("");   //clear form fields after adding a contact
            setEmail("");
            setPhone("");

            setEditingContactId(null);  //clear editingContactId state to indicate that we are no longer editing a contact'

        } catch (err) {
            console.error(err);
            console.error("BACKEND RESPONSE:", err.response?.data);

            toast.error(err.response?.data?.message || "Failed to save contact");
        }
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await api.delete(`/api/contacts/${contactId}`);
            fetchContacts();   //after deleting a contact, fetch the updated list of contacts to reflect the deletion in the UI
        } catch (err) {
            console.log("Delete error:", err);
            toast.error(err.response?.data?.message || "Failed to delete contact");
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
        navigate("/");   //navigate user back to login page after logging out
    }

    // FILTERED CONTACTS
    const filteredContacts = contacts.filter((contact) =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">ContactSync</h2>

                <ul className="space-y-3">
                    <li className="text-blue-600 font-medium">Dashboard</li>
                    <li className="text-gray-600">Contacts</li>
                    <li className="text-gray-600">Settings</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Contact Dashboard
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>

                {/* Add / Edit Contact */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            {editingContactId ? "Edit Contact" : "Add Contact"}
                        </h2>

                        <button
                            onClick={generateRandomContact}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                        >
                            Generate Contact
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <button
                            type="submit"
                            className="col-span-1 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                        >
                            {editingContactId ? "Update Contact" : "Add Contact"}
                        </button>
                    </form>
                </div>

                {/* Contacts */}
                <div className="bg-white p-6 rounded-lg shadow">
                    
                    {/* Header + Search */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Your Contacts</h2>

                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border px-3 py-2 rounded w-64"
                        />
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredContacts.length === 0 ? (
                        <p className="text-gray-500">No contacts found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:shadow-md transition"
                                >
                                    {/* Top */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800">
                                                {contact.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {contact.email}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditContact(contact)}
                                                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteContact(contact.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom */}
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p>📞 {contact.phone}</p>

                                        {contact.company && (
                                            <p>🏢 {contact.company}</p>
                                        )}

                                        {contact.location && (
                                            <p>📍 {contact.location}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
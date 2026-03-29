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
            const res = await api.get("/contacts");
            setContacts(res.data);     //update contacts state with data from backend so setContacts will contain contacts like [{id: 1, name: "John Doe", email: "john.doe@example.com"}]
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch contacts. Please try again.");  //show an alert if there was an error fetching contacts from backend
        } finally {
            setLoading(false);  //set loading to false once we have fetched contacts, this can be used to hide the loading indicator in the UI
        }
    };

    const generateRandomContact = async () => {
        try {
            await api.post("/contacts/generate");  //call backend endpoint to generate a random contact, backend will use randomuser API to get random contact data and create a new contact in the database
            console.log("Generate response:", res.data);
            fetchContacts();   //after generating a random contact, fetch the updated list of contacts to reflect the new contact in the UI

        } catch (error) {
            console.error(error);
            console.error("BACKEND RESPONSE:", error.response?.data);

            alert(
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
            console.error("BACKEND RESPONSE:", err.response?.data);

            alert(
                error.response?.data?.message ||
                "Failed to save contact"
            );
        }
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await api.delete(`/contacts/${contactId}`);
            fetchContacts();   //after deleting a contact, fetch the updated list of contacts to reflect the deletion in the UI
        } catch (err) {
            console.log("Delete error:", err);
            alert(err.response?.data?.message || "Failed to delete contact");
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

    return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Contact Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <button
            onClick={generateRandomContact}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Generate Business Contact
          </button>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded w-full font-medium"
            >
              {editingContactId ? "Update Contact" : "Add Contact"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Contacts</h2>

          {loading ? (
            <p>Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="text-gray-500">No contacts yet</p>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {contact.name}
                    </p>

                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>

                    {contact.company && (
                      <p className="text-sm text-gray-700 mt-1">
                        🏢 {contact.company}
                      </p>
                    )}

                    {contact.location && (
                      <p className="text-sm text-gray-500">
                        📍 {contact.location}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="bg-yellow-400 hover:bg-yellow-500 px-3 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

export default Dashboard;
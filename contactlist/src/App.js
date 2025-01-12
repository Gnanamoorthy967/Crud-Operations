import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [contact, setContact] = useState([]);
  const [filterContact, setFilterContact] = useState([]);
  const [contactdata, setContactdata] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getAllContact = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/contact/users");
      setContact(res.data);
      setFilterContact(res.data);
    } catch (error) {
      console.log("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    getAllContact();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactdata({ ...contactdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await axios.put(
          `http://localhost:4000/api/contact/users/${editId}`,
          contactdata
        );
        console.log("Update response:", res.data);

        const updatedContacts = contact.map((item) =>
          item._id === editId ? res.data : item
        );
        setContact(updatedContacts);
        setFilterContact(updatedContacts);
        setEditing(false);
        setContactdata({ name: "", email: "", phone: "", address: "" });
        setEditId(null);
        setShowModal(false); // Close the modal
      } else {
        const res = await axios.post(
          "http://localhost:4000/api/contact/users",
          contactdata
        );
        setContact([...contact, res.data]);
        setFilterContact([...contact, res.data]);
      }
      setContactdata({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Error adding/updating contact:", error);
    }
  };

  // console.log("Edit ID:", editId);
  // console.log("Contact Data:", contactdata);

  const handleEdit = (contact) => {
    setEditing(true);
    setEditId(contact._id);
    setContactdata(contact);
    setShowModal(true); // Open the modal
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = contact.filter((c) =>
      c.name.toLowerCase().includes(value)
    );
    setFilterContact(filtered);
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:4000/api/contact/users/${id}`);
        const updatedContacts = contact.filter((item) => item._id !== id);
        setContact(updatedContacts);
        setFilterContact(updatedContacts);
      } catch (error) {
        console.error("Failed to delete contact:", error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setContactdata({ name: "", email: "", phone: "", address: "" });
    setEditing(false);
  };

  return (
    <div className="container">
      <div className="form">
        <h1>Contact Manager</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={contactdata.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={contactdata.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={contactdata.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={contactdata.address}
            onChange={handleInputChange}
          />
          <button
            className="btn green"
            type="submit"
            disabled={!contactdata.name || !contactdata.email}
          >
            {editing ? "Update Contact" : "Add Contact"}
          </button>
        </form>
        <table className="table">
          <thead>
            <tr>
              <td>
                <input
                  type="search"
                  placeholder="Search Name"
                  onChange={handleSearchChange}
                />
              </td>
            </tr>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterContact.length > 0 ? (
              filterContact.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.address}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn green"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteContact(item._id)}
                      className="btn red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No contacts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editing ? "Edit Contact" : "Add Contact"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={contactdata.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={contactdata.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={contactdata.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={contactdata.address}
                onChange={handleInputChange}
              />
              <button className="btn green" type="submit">
                {editing ? "Update Contact" : "Add Contact"}
              </button>
              <button className="btn red" type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

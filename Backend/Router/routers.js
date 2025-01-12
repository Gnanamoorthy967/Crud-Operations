const express = require("express");
const router = express.Router();
const Contact = require("../Model/contact");

router.get("/users", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/users", async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const newContact = await Contact.create({ name, email, phone, address });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Error adding contact" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

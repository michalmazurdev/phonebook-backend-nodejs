const express = require("express");
const router = express.Router();

const authenticate = require("../../middleware/authenticate");
const getAllContacts = require("../../controllers/contacts/getAllContacts");
const getById = require("../../controllers/contacts/getById");
const deleteContact = require("../../controllers/contacts/deleteContact");
const createContact = require("../../controllers/contacts/createContact");
const patchContact = require("../../controllers/contacts/patchContact");
const updateStatusContact = require("../../controllers/contacts/updateStatusContact");

// @ GET /api/contacts
router.get("/", authenticate, getAllContacts);

// @ GET /api/contacts/:id
router.get("/:contactId", authenticate, getById);

// @ DELETE /api/contacts/:id
router.delete("/:contactId", authenticate, deleteContact);

// @ POST /api/contacts
router.post("/", authenticate, createContact);

// @ PUT /api/contacts/:id
router.put("/:contactId", authenticate, patchContact);

// @ PATCH /api/contacts/:contactId
router.patch("/:contactId", authenticate, updateStatusContact);

module.exports = router;

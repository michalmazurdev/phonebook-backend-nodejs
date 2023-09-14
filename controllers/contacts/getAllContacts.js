const service = require("../../models/contacts");

const getAllContacts = async (_, res) => {
  const response = await service.listContacts();
  if (!response) {
    res.status(400).json({
      message: "An error occured on attempt to read the contacts file",
    });
  }
  res.json(response);
};

module.exports = getAllContacts;

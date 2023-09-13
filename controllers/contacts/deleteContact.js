const service = require("../../models/contacts");

const deleteContact = async (req, res) => {
  const response = await service.removeContact(req.params.contactId);
  if (!response) {
    return res.status(404).json({
      message: `Contact with id ${req.params.contactId} has not been found`,
    });
  } else {
    return res.status(200).json(response);
  }
};

module.exports = deleteContact;

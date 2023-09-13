const service = require("../../models/contacts");

const getById = async (req, res) => {
  const response = await service.getContactById(req.params.contactId);
  if (!response) {
    return res
      .status(404)
      .json(`Contact with id ${req.params.contactId} has not been found`);
  } else {
    return res.json(response);
  }
};
module.exports = getById;

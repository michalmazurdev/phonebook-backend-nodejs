const Joi = require("joi");
const service = require("../../models/contacts");

const putBodyScheme = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  phone: Joi.string(),
});

const patchContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const validatedBody = putBodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res
      .status(400)
      .json({ message: "Your request is not in proper format." });
  }

  const response = await service.updateContact(req.params.contactId, req.body);

  if (!response) {
    return res.status(404).json({
      message: `Contact with id ${req.params.contactId} has not been found`,
    });
  } else {
    return res.status(200).json(response);
  }
};

module.exports = patchContact;

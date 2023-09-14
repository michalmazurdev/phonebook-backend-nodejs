const service = require("../../models/contacts");
const Joi = require("joi");

const postBodyScheme = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
});

const createContact = async (req, res) => {
  const validatedBody = postBodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res
      .status(400)
      .json({ message: "Your request is not in proper format." });
  }
  const response = await service.addContact(req.body);
  return res.status(201).json(response);
};

module.exports = createContact;

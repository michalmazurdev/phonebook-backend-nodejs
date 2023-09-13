const Joi = require("joi");
const service = require("../../models/contacts");

const patchBodyScheme = Joi.object({
  favorite: Joi.boolean().required(),
});

const updateStatusContact = async (req, res) => {
  const validatedBody = patchBodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  const response = await service.updateStatusContact(
    req.params.contactId,
    req.body
  );
  if (!response) {
    return res.status(404).json({
      message: `Contact with id ${req.params.contactId} has not been found`,
    });
  } else {
    return res.status(200).json(response);
  }
};

module.exports = updateStatusContact;

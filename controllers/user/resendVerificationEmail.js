const Joi = require("joi");
const User = require("../../service/schemas/userSchema");
const sendVerifacationEmail = require("../../helpers/sendVerifacationEmail");

const bodyScheme = Joi.object({
  email: Joi.string().email().required(),
});

const resendVerificationEmail = async (req, res) => {
  const validatedBody = bodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res.status(400).json({ message: "Missing required field email" });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user.verify) {
      return res.status(400).json({
        message: "Verification has already been passed",
        status: "Bad reequest",
        code: 400,
      });
    }

    await sendVerifacationEmail(email, user.verificationToken);
    return res.status(200).json({
      message: "Verification email sent",
      code: 200,
      status: "OK",
      "Content-Type": "application/json",
    });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

module.exports = resendVerificationEmail;

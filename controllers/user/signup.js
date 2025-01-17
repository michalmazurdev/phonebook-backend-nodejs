const Joi = require("joi");
const User = require("../../service/schemas/userSchema");
const { v4: uuidv4 } = require("uuid");
const sendVerifacationEmail = require("../../helpers/sendVerifacationEmail");

const bodyScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signup = async (req, res) => {
  const validatedBody = bodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res.status(400).json({ message: validatedBody.error.message });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email, verificationToken: uuidv4() });
    newUser.setPassword(password);
    newUser.setAvatarUrl(email);
    await newUser.save();
    await sendVerifacationEmail(email, newUser.verificationToken);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: `Registration successful. Account created with email ${email}.`,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = signup;

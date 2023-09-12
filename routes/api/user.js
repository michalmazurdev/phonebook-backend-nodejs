const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../../service/schemas/userSchema");

const signUpBodyScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/signup", async (req, res) => {
  const validatedBody = signUpBodyScheme.validate(req.body);
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
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: `Registration successful. Account created with email ${email}.`,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

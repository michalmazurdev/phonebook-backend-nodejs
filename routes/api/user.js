const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../../service/schemas/userSchema");
const jwtKey = process.env.JWT_SECRET_KEY;

const bodyScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// @ POST /api/users/signup

router.post("/signup", async (req, res) => {
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

// @ POST /api/users/login

router.post("/login", async (req, res) => {
  const validatedBody = bodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res.status(400).json({ message: validatedBody.error.message });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "Unauthorized",
      code: 400,
      message: "Email or password is wrong",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, jwtKey, { expiresIn: "1h" });

  user.token = token;
  await user.save();

  res.json({
    status: "success",
    code: 200,
    token: {
      token,
    },
    user: {
      email: email,
      subscription: user.subscription,
    },
  });
});
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization.slice(7);
  try {
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, jwtKey);
    const user = await User.findById(decodedToken.id);
    if (!user || user.token !== token) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "Unauthorized",
      code: 401,
      message: error.message || "Not authorized",
    });
  }
};

// below for tests only
router.get("/", authenticate, (req, res) => {
  console.log(req.user);

  return res.status(200).json({ message: "all good" });
});

module.exports = router;

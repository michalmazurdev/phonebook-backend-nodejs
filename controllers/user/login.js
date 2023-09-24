const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../../service/schemas/userSchema");
const jwtKey = process.env.JWT_SECRET_KEY;

const bodyScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const login = async (req, res) => {
  const validatedBody = bodyScheme.validate(req.body);
  if (validatedBody.error?.details.length > 0) {
    return res.status(400).json({ message: validatedBody.error.message });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user.verify) {
      return res.status(400).json({
        message: "User not yet verified",
        status: "Unauthoirzed",
        code: 400,
      });
    }
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

    return res.json({
      status: "success",
      code: 200,
      token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = login;

const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerifacationEmail = async (email, verificationToken) => {
  const config = {
    service: "gmail",
    auth: {
      user: "m12253233@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: "m12253233@gmail.com",
    to: email,
    subject: "Verify your account in phonebok app.",
    html: `<a href=http://localhost:3000/api/users/verify/${verificationToken} target="_blank" rel="noreferrer noopener">Confrim your account.</a>`,
  };

  try {
    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.log("error", error);
  }

  // transporter
  //   .sendMail(emailOptions)
  //   .then((info) => console.log("email sent"))
  //   .catch((err) => console.log("error", err));
};
module.exports = sendVerifacationEmail;

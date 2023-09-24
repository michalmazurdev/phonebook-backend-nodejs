const User = require("../../service/schemas/userSchema");

const verifyUser = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    // console.log(verificationToken);
    const user = await User.findOne({ verificationToken });
    // console.log("user", user);
    if (user === null || user.verificationToken === null) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { verificationToken: "", verify: true } },
      { new: true }
    );
    return res.status(200).json({ message: "Verification successful" });
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = verifyUser;

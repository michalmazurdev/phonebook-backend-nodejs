const path = require("path");
const fs = require("fs").promises;
const jimp = require("jimp");
const User = require("../../service/schemas/userSchema");
const storeImage = path.join(process.cwd(), "public", "avatars");

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { path: tmppDir, originalname } = req.file;
    const { _id: userId } = req.user;

    const avatar = await jimp.read(tmppDir);
    avatar.resize(250, 250);
    await avatar.writeAsync(tmppDir);
    const fileName = `${userId}_${originalname}`;
    const staticDir = path.join(storeImage, fileName);
    await fs.rename(tmppDir, staticDir);

    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { avatarURL: staticDir } },
      { new: true }
    );

    return res.json({
      status: "OK",
      code: 200,
      "Content-Type": "application / json",
      avatarURL: staticDir,
    });
  } catch (error) {
    return res
      .json({ message: "Internal server error", error: error.message })
      .status(500);
  }
};
module.exports = updateAvatar;

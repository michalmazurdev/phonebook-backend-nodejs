const multer = require("multer");
const path = require("path");

const uploadDir = path.join(process.cwd(), "tmp");

const configMulter = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const uploadAvatar = multer({ storage: configMulter });

module.exports = uploadAvatar;

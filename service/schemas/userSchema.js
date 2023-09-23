const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gravatar = require("gravatar");
const bCrypt = require("bcryptjs");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,
});

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

userSchema.methods.setAvatarUrl = function (email) {
  this.avatarURL = gravatar.url(email, { default: "mp", size: "140" }, false);
};

const User = mongoose.model("user", userSchema, "user");

module.exports = User;

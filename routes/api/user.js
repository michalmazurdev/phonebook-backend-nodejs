const express = require("express");
const router = express.Router();

const signup = require("../../controllers/user/signup");
const login = require("../../controllers/user/login");
const logout = require("../../controllers/user/logout");
const getCurrentUser = require("../../controllers/user/getCurrentUser");
const updateAvatar = require("../../controllers/user/updateAvatar");
const authenticate = require("../../middleware/authenticate");
const uploadAvatar = require("../../middleware/uploadAvatar");

// @ POST /api/users/signup
router.post("/signup", signup);

// @ POST /api/users/login
router.post("/login", login);

// @ POST /api/users/logout
router.post("/logout", authenticate, logout);

// @ GET /api/users/current
router.get("/current", authenticate, getCurrentUser);

// @ PATCH /api/users/avatars
router.patch(
  "/avatars",
  authenticate,
  uploadAvatar.single("avatar"),
  updateAvatar
);

module.exports = router;

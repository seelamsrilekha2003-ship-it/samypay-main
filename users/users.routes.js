const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { getProfile, updateProfile, changePassword, getAllUsers, updateUser, deleteUser, resetUserPassword, resetUserPin } = require("./users.controller");

// Get Profile
router.get("/me", auth, getProfile);

// Update Profile
router.put("/profile", auth, updateProfile);

// Change Password
router.put("/change-password", auth, changePassword);

// Admin/All Users
router.get("/", auth, getAllUsers);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.put("/:id/reset-password", auth, resetUserPassword);
router.put("/:id/reset-pin", auth, resetUserPin);

module.exports = router;

const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  searchUsers,
  getUserById,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

const authMiddleware =
  require("../middleware/authMiddleware");


// =====================================
// SEARCH USERS
// =====================================

router.get(
  "/search",
  authMiddleware,
  searchUsers
);


// =====================================
// CURRENT USER PROFILE
// =====================================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);


// =====================================
// UPDATE CURRENT USER PROFILE
// =====================================

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);


// =====================================
// OTHER USER PROFILE
// =====================================

router.get(
  "/:id",
  authMiddleware,
  getUserById
);


// =====================================
// FOLLOW
// =====================================

router.post(
  "/:id/follow",
  authMiddleware,
  followUser
);


// =====================================
// UNFOLLOW
// =====================================

router.post(
  "/:id/unfollow",
  authMiddleware,
  unfollowUser
);


module.exports = router;
const express = require("express");

const router = express.Router();

const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  getFollowingFeed,
  getUserPosts,
  deletePost,
} = require("../controllers/postController");

const authMiddleware =
  require("../middleware/authMiddleware");

// =====================================
// GET ALL POSTS
// =====================================

router.get(
  "/",
  authMiddleware,
  getPosts
);

// =====================================
// CREATE POST
// =====================================

router.post(
  "/",
  authMiddleware,
  createPost
);

// =====================================
// GET FOLLOWING FEED
// =====================================

router.get(
  "/following",
  authMiddleware,
  getFollowingFeed
);

// =====================================
// LIKE / UNLIKE POST
// =====================================

router.put(
  "/:id/like",
  authMiddleware,
  toggleLike
);

// =====================================
// ADD COMMENT
// =====================================

router.post(
  "/:id/comment",
  authMiddleware,
  addComment
);

// =====================================
// GET USER POSTS
// =====================================

router.get(
  "/user/:userId",
  authMiddleware,
  getUserPosts
);

// =====================================
// DELETE POST
// =====================================

router.delete(
  "/:id",
  authMiddleware,
  deletePost
);

module.exports = router;
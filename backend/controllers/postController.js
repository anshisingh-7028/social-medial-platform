const Post = require("../models/Post");
const User = require("../models/User");
const createNotification =
  require("../utils/createNotification");

// =====================================
// CREATE POST
// =====================================

const createPost = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const { content, image } = req.body;

    // At least text or image required
    if (
      (!content || content.trim() === "") &&
      (!image || image.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Post cannot be empty",
      });
    }

    const post = await Post.create({
      author: userId,
      content: content?.trim() || "",
      image: image?.trim() || "",
    });

    const populatedPost =
      await Post.findById(post._id)
        .populate(
          "author",
          "name username avatar"
        )
        .populate(
          "comments.user",
          "name username avatar"
        );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error(
      "CREATE POST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};


// =====================================
// GET HOME POSTS
// Current User + Following Users
// =====================================

const getPosts = async (req, res) => {
  try {
    const currentUserId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const currentUser =
      await User.findById(currentUserId)
        .select("following");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Current user + followed users
    const userIds = [
      currentUser._id,
      ...(currentUser.following || []),
    ];

    const posts =
      await Post.find({
        author: {
          $in: userIds,
        },
      })
        .populate(
          "author",
          "name username avatar"
        )
        .populate(
          "comments.user",
          "name username avatar"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(
      "GET POSTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};


// =====================================
// LIKE / UNLIKE POST
// =====================================

const toggleLike = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const postId = req.params.id;

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked =
      post.likes.some(
        (id) =>
          id.toString() ===
          userId.toString()
      );

    if (alreadyLiked) {
      post.likes =
        post.likes.filter(
          (id) =>
            id.toString() !==
            userId.toString()
        );
    } else {
      post.likes.push(userId);

      const io = req.app.get("io");

      await createNotification({
        recipient:
          post.author._id ||
          post.author,

        sender: userId,

        type: "like",

        post: post._id,

        io,
      });
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error(
      "TOGGLE LIKE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to like post",
    });
  }
};


// =====================================
// ADD COMMENT
// =====================================

const addComment = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const postId = req.params.id;

    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: userId,
      text: text.trim(),
    });

    const io = req.app.get("io");

    await createNotification({
      recipient:
        post.author._id ||
        post.author,

      sender: userId,

      type: "comment",

      post: post._id,

      comment: text.trim(),

      io,
    });

    await post.save();

    const updatedPost =
      await Post.findById(postId)
        .populate(
          "author",
          "name username avatar"
        )
        .populate(
          "comments.user",
          "name username avatar"
        );

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(
      "ADD COMMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};


// =====================================
// GET FOLLOWING FEED
// =====================================

const getFollowingFeed = async (req, res) => {
  try {
    const currentUserId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const currentUser =
      await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    const userIds = [
      currentUser._id,
      ...(currentUser.following || []),
    ];

    const posts =
      await Post.find({
        author: {
          $in: userIds,
        },
      })
        .populate(
          "author",
          "name username avatar"
        )
        .populate(
          "comments.user",
          "name username avatar"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(
      "FOLLOWING FEED ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load following feed",
    });
  }
};


// =====================================
// GET USER POSTS
// =====================================

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts =
      await Post.find({
        author: userId,
      })
        .populate(
          "author",
          "name username avatar"
        )
        .populate(
          "comments.user",
          "name username avatar"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(
      "GET USER POSTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load user posts",
    });
  }
};


// =====================================
// DELETE POST
// =====================================

const deletePost = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const postId = req.params.id;

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only post owner can delete
    if (
      post.author.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own post",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message:
        "Post deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE POST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete post",
    });
  }
};


// =====================================
// EXPORTS
// =====================================

module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  getFollowingFeed,
  getUserPosts,
  deletePost,
};
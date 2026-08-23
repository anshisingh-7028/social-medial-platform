const User = require("../models/User");
const createNotification =
  require("../utils/createNotification");


// =====================================
// GET PROFILE
// =====================================

const getProfile = async (req, res) => {
  try {

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "GET PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (req, res) => {
  try {

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const {
      name,
      username,
      bio,
      avatar,
    } = req.body;


    const user = await User.findById(userId);


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // =========================
    // NAME
    // =========================

    if (
      name !== undefined &&
      name.trim() !== ""
    ) {
      user.name = name.trim();
    }


    // =========================
    // USERNAME
    // =========================

    if (
      username !== undefined &&
      username.trim() !== ""
    ) {

      const cleanUsername =
        username.trim().toLowerCase();

      if (
        cleanUsername !== user.username
      ) {

        const existingUser =
          await User.findOne({
            username: cleanUsername,
          });

        if (existingUser) {
          return res.status(400).json({
            message:
              "Username already exists",
          });
        }

        user.username =
          cleanUsername;
      }
    }


    // =========================
    // BIO
    // =========================

    if (bio !== undefined) {
      user.bio = bio.trim();
    }


    // =========================
    // AVATAR
    // =========================

    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }


    await user.save();


    const updatedUser =
      await User.findById(userId)
        .select("-password");


    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Profile update failed",
    });
  }
};

// =====================================
// SEARCH USERS
// =====================================

const searchUsers = async (req, res) => {
  try {

    const query = req.query.q;

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const users = await User.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "name username avatar bio followers following"
      )
      .limit(10);

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.error(
      "SEARCH USERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

// =====================================
// GET USER BY ID
// =====================================

const getUserById = async (req, res) => {
  try {

    const user = await User.findById(
      req.params.id
    )
      .select("-password")
      .populate(
        "followers",
        "name username avatar"
      )
      .populate(
        "following",
        "name username avatar"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "GET USER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};


// =====================================
// FOLLOW USER
// =====================================

const followUser = async (req, res) => {
  try {

    // ================================
    // CURRENT USER ID
    // ================================

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;


    // ================================
    // FIND USERS
    // ================================

    const currentUser =
      await User.findById(userId);

    const targetUser =
      await User.findById(req.params.id);


    // ================================
    // CHECK CURRENT USER
    // ================================

    if (!currentUser) {

      return res.status(404).json({
        success: false,
        message:
          "Current user not found",
      });

    }


    // ================================
    // CHECK TARGET USER
    // ================================

    if (!targetUser) {

      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });

    }


    // ================================
    // CANNOT FOLLOW YOURSELF
    // ================================

    if (
      currentUser._id.toString() ===
      targetUser._id.toString()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "You cannot follow yourself",
      });

    }


    // ================================
    // INITIALIZE ARRAYS
    // ================================

    if (!currentUser.following) {
      currentUser.following = [];
    }

    if (!targetUser.followers) {
      targetUser.followers = [];
    }


    // ================================
    // CHECK ALREADY FOLLOWING
    // ================================

    const alreadyFollowing =
      currentUser.following.some(
        (id) =>
          id.toString() ===
          targetUser._id.toString()
      );


    if (alreadyFollowing) {

      return res.status(400).json({
        success: false,
        message:
          "Already following this user",
      });

    }


    // ================================
    // ADD FOLLOWING
    // ================================

    currentUser.following.push(
      targetUser._id
    );


    // ================================
    // ADD FOLLOWER
    // ================================

    targetUser.followers.push(
      currentUser._id
    );


    // ================================
    // SAVE USERS
    // ================================

    await currentUser.save();

    await targetUser.save();


    // ================================
    // CREATE NOTIFICATION
    // ================================

try {

const io = req.app.get("io");

await createNotification({
  recipient: targetUser._id,
  sender: currentUser._id,
  type: "follow",
  io,
});

    } catch (notificationError) {

      console.error(
        "FOLLOW NOTIFICATION ERROR:",
        notificationError
      );

     
    }


    // ================================
    // RESPONSE
    // ================================

    return res.status(200).json({
      success: true,
      message:
        "User followed successfully",
    });


  } catch (error) {

    console.error(
      "FOLLOW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Follow failed",
    });

  }
};
// =====================================
// UNFOLLOW USER
// =====================================

const unfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(
      req.user.id || req.user.userId
    );

    const targetUser = await User.findById(
      req.params.id
    );

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    currentUser.following =
      (currentUser.following || []).filter(
        (id) =>
          id.toString() !==
          targetUser._id.toString()
      );

    targetUser.followers =
      (targetUser.followers || []).filter(
        (id) =>
          id.toString() !==
          currentUser._id.toString()
      );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });

  } catch (error) {
    console.error(
      "UNFOLLOW ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unfollow failed",
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
   searchUsers,
  getUserById,
  followUser,
  unfollowUser,
};
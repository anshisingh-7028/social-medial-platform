const Notification = require("../models/Notification");


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getMyNotifications = async (req, res) => {
  try {

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;


    const notifications =
      await Notification.find({
        recipient: userId,
      })
        .populate(
          "sender",
          "name username avatar"
        )
        .populate(
          "post",
          "content image"
        )
        .sort({
          createdAt: -1,
        });


    const unreadCount =
      await Notification.countDocuments({
        recipient: userId,
        read: false,
      });


    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });


  } catch (error) {

    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};



// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markNotificationAsRead =
  async (req, res) => {

    try {

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const { id } = req.params;


      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: id,
            recipient: userId,
          },
          {
            read: true,
          },
          {
            new: true,
          }
        );


      if (!notification) {

        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });

      }


      res.status(200).json({
        success: true,
        notification,
      });


    } catch (error) {

      console.error(
        "MARK NOTIFICATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to update notification",
      });
    }
  };



// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllNotificationsAsRead =
  async (req, res) => {

    try {

      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;


      await Notification.updateMany(
        {
          recipient: userId,
          read: false,
        },
        {
          read: true,
        }
      );


      res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });


    } catch (error) {

      console.error(
        "MARK ALL NOTIFICATIONS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update notifications",
      });
    }
  };

  // ==========================================
// DELETE ONE NOTIFICATION
// ==========================================

const deleteNotification = async (req, res) => {
  try {

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user._id;

    const { id } = req.params;


    const notification =
      await Notification.findOneAndDelete({
        _id: id,
        recipient: userId,
      });


    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }


    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE NOTIFICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete notification",
    });
  }
};



module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
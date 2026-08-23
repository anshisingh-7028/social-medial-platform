const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  sender,
  type,
  post = null,
  comment = "",
  io = null,
}) => {

  try {

    // Don't notify yourself
    if (
      recipient?.toString() ===
      sender?.toString()
    ) {
      return null;
    }


    // =====================================
    // CREATE NOTIFICATION
    // =====================================

    const notification =
      await Notification.create({
        recipient,
        sender,
        type,
        post,
        comment,
        read: false,
      });


    // =====================================
    // POPULATE SENDER
    // =====================================

    const populatedNotification =
      await Notification.findById(
        notification._id
      ).populate(
        "sender",
        "name username avatar"
      );


    // =====================================
    // REAL-TIME NOTIFICATION
    // =====================================

    if (io) {

      io.to(
        recipient.toString()
      ).emit(
        "newNotification",
        populatedNotification
      );

      console.log(
        "REAL-TIME NOTIFICATION SENT:",
        recipient.toString()
      );

    }


    console.log(
      "NOTIFICATION CREATED:",
      notification._id
    );


    return populatedNotification;


  } catch (error) {

    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    throw error;

  }
};


module.exports =
  createNotification;
const Conversation =
  require("../models/Conversation");

const Message =
  require("../models/Message");

const User =
  require("../models/User");


// =====================================
// GET OR CREATE CONVERSATION
// =====================================

const getOrCreateConversation =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      if (
        currentUserId.toString() ===
        userId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot chat with yourself",
        });
      }

      const otherUser =
        await User.findById(userId);

      if (!otherUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let conversation =
        await Conversation.findOne({
          participants: {
            $all: [
              currentUserId,
              userId,
            ],
          },
        });

      if (!conversation) {
        conversation =
          await Conversation.create({
            participants: [
              currentUserId,
              userId,
            ],
          });
      }

      conversation =
        await Conversation.findById(
          conversation._id
        )
          .populate(
            "participants",
            "name username avatar"
          )
          .populate("lastMessage");

      res.status(200).json({
        success: true,
        conversation,
      });

    } catch (error) {
      console.error(
        "GET CONVERSATION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get conversation",
      });
    }
  };


// =====================================
// GET MESSAGES
// =====================================

const getMessages =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const { conversationId } =
        req.params;

      const conversation =
        await Conversation.findOne({
          _id: conversationId,
          participants: currentUserId,
        });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation not found",
        });
      }

      const messages =
        await Message.find({
          conversation: conversationId,
        })
          .populate(
            "sender",
            "name username avatar"
          )
          .populate(
            "receiver",
            "name username avatar"
          )
          .sort({
            createdAt: 1,
          });

      res.status(200).json({
        success: true,
        messages,
      });

    } catch (error) {
      console.error(
        "GET MESSAGES ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get messages",
      });
    }
  };


// =====================================
// SEND MESSAGE
// =====================================

const sendMessage =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const { conversationId } =
        req.params;

      const { text } = req.body;

      if (
        !text ||
        text.trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Message cannot be empty",
        });
      }

      const conversation =
        await Conversation.findOne({
          _id: conversationId,
          participants: currentUserId,
        });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message:
            "Conversation not found",
        });
      }

      const receiverId =
        conversation.participants.find(
          (id) =>
            id.toString() !==
            currentUserId.toString()
        );

      const message =
        await Message.create({
          conversation:
            conversationId,

          sender:
            currentUserId,

          receiver:
            receiverId,

          text:
            text.trim(),
        });

      conversation.lastMessage =
        message._id;

      conversation.lastMessageAt =
        new Date();

      await conversation.save();

      const populatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name username avatar"
          )
          .populate(
            "receiver",
            "name username avatar"
          );

      // ===============================
      // SOCKET.IO
      // ===============================

      const io =
        req.app.get("io");

      if (io) {
        io.to(
          receiverId.toString()
        ).emit(
          "newMessage",
          populatedMessage
        );
      }

      res.status(201).json({
        success: true,
        message:
          populatedMessage,
      });

    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to send message",
      });
    }
  };


// =====================================
// EDIT MESSAGE
// =====================================

const editMessage =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const { messageId } =
        req.params;

      const { text } =
        req.body;

      if (
        !text ||
        text.trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Message cannot be empty",
        });
      }

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message not found",
        });
      }

      // Only sender can edit
      if (
        message.sender.toString() !==
        currentUserId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only edit your own message",
        });
      }

      // Don't edit deleted message
      if (message.deleted) {
        return res.status(400).json({
          success: false,
          message:
            "Deleted message cannot be edited",
        });
      }

      message.text =
        text.trim();

      message.edited =
        true;

      await message.save();

      const updatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name username avatar"
          )
          .populate(
            "receiver",
            "name username avatar"
          );

      // ===============================
      // SOCKET.IO
      // ===============================

      const io =
        req.app.get("io");

      if (io) {
        io.to(
          message.receiver.toString()
        ).emit(
          "messageUpdated",
          updatedMessage
        );

        io.to(
          currentUserId.toString()
        ).emit(
          "messageUpdated",
          updatedMessage
        );
      }

      res.status(200).json({
        success: true,
        message:
          updatedMessage,
      });

    } catch (error) {
      console.error(
        "EDIT MESSAGE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to edit message",
      });
    }
  };


// =====================================
// DELETE MESSAGE
// =====================================

const deleteMessage =
  async (req, res) => {
    try {
      const currentUserId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const { messageId } =
        req.params;

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            "Message not found",
        });
      }

      // Only sender can delete
      if (
        message.sender.toString() !==
        currentUserId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only delete your own message",
        });
      }

      // Soft delete
      message.text =
        "This message was deleted";

      message.deleted =
        true;

      message.edited =
        false;

      await message.save();

      const deletedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name username avatar"
          )
          .populate(
            "receiver",
            "name username avatar"
          );

      // ===============================
      // SOCKET.IO
      // ===============================

      const io =
        req.app.get("io");

      if (io) {
        io.to(
          message.receiver.toString()
        ).emit(
          "messageDeleted",
          deletedMessage
        );

        io.to(
          currentUserId.toString()
        ).emit(
          "messageDeleted",
          deletedMessage
        );
      }

      res.status(200).json({
        success: true,
        message:
          deletedMessage,
      });

    } catch (error) {
      console.error(
        "DELETE MESSAGE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete message",
      });
    }
  };


// =====================================
// GET MY CONVERSATIONS
// =====================================

const getMyConversations =
  async (req, res) => {
    try {
      const userId =
        req.user.id ||
        req.user.userId ||
        req.user._id;

      const conversations =
        await Conversation.find({
          participants: userId,
        })
          .populate(
            "participants",
            "name username avatar"
          )
          .populate({
            path: "lastMessage",
            populate: {
              path: "sender",
              select:
                "name username avatar",
            },
          })
          .sort({
            updatedAt: -1,
          });

      res.status(200).json({
        success: true,
        conversations,
      });

    } catch (error) {
      console.error(
        "GET CONVERSATIONS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load conversations",
      });
    }
  };


module.exports = {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  getMyConversations,
};
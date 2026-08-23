const express = require("express");

const router = express.Router();

const {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  getMyConversations,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// CONVERSATIONS
// ===============================

router.get(
  "/conversation/:userId",
  authMiddleware,
  getOrCreateConversation
);

router.get(
  "/conversations",
  authMiddleware,
  getMyConversations
);

// ===============================
// MESSAGES
// ===============================

router.get(
  "/messages/:conversationId",
  authMiddleware,
  getMessages
);

router.post(
  "/messages/:conversationId",
  authMiddleware,
  sendMessage
);

router.put(
  "/messages/:messageId",
  authMiddleware,
  editMessage
);

router.delete(
  "/messages/:messageId",
  authMiddleware,
  deleteMessage
);

module.exports = router;
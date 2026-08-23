import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
};

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  },
});

// =====================================
// GET OR CREATE CONVERSATION
// =====================================

export const getOrCreateConversation = async (userId) => {
  const response = await axios.get(
    `${API_URL}/api/chat/conversation/${userId}`,
    config()
  );

  return response.data;
};

// =====================================
// GET MESSAGES
// =====================================

export const getMessages = async (conversationId) => {
  const response = await axios.get(
    `${API_URL}/api/chat/messages/${conversationId}`,
    config()
  );

  return response.data;
};

// =====================================
// SEND MESSAGE
// =====================================

export const sendMessage = async (
  conversationId,
  text
) => {
  const response = await axios.post(
    `${API_URL}/api/chat/messages/${conversationId}`,
    {
      text,
    },
    config()
  );

  return response.data;
};

// =====================================
// EDIT MESSAGE
// =====================================

export const editMessage = async (
  messageId,
  text
) => {
  const response = await axios.put(
    `${API_URL}/api/chat/messages/${messageId}`,
    {
      text,
    },
    config()
  );

  return response.data;
};

// =====================================
// DELETE MESSAGE
// =====================================

export const deleteMessage = async (messageId) => {
  const response = await axios.delete(
    `${API_URL}/api/chat/messages/${messageId}`,
    config()
  );

  return response.data;
};

// =====================================
// GET MY CONVERSATIONS
// =====================================

export const getMyConversations = async () => {
  const response = await axios.get(
    `${API_URL}/api/chat/conversations`,
    config()
  );

  return response.data;
};
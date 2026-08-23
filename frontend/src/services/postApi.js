import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// =====================================
// AUTH CONFIG
// =====================================

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// =====================================
// GET ALL POSTS
// =====================================

export const getPosts = async () => {
  const response = await axios.get(
    `${API_URL}/posts`,
    getConfig()
  );

  return response.data;
};

// =====================================
// CREATE POST
// =====================================

export const createPost = async (postData) => {
  const response = await axios.post(
    `${API_URL}/posts`,
    postData,
    getConfig()
  );

  return response.data;
};

// =====================================
// LIKE / UNLIKE POST
// =====================================

export const toggleLike = async (postId) => {
  const response = await axios.put(
    `${API_URL}/posts/${postId}/like`,
    {},
    getConfig()
  );

  return response.data;
};

// =====================================
// ADD COMMENT
// =====================================

export const addComment = async (
  postId,
  text
) => {
  const response = await axios.post(
    `${API_URL}/posts/${postId}/comment`,
    {
      text,
    },
    getConfig()
  );

  return response.data;
};

// =====================================
// GET FOLLOWING FEED
// =====================================

export const getFollowingFeed = async () => {
  const response = await axios.get(
    `${API_URL}/posts/following`,
    getConfig()
  );

  return response.data;
};

// =====================================
// GET USER POSTS
// =====================================

export const getUserPosts = async (userId) => {
  const response = await axios.get(
    `${API_URL}/posts/user/${userId}`,
    getConfig()
  );

  return response.data;
};

// =====================================
// DELETE POST
// =====================================

export const deletePost = async (postId) => {
  const response = await axios.delete(
    `${API_URL}/posts/${postId}`,
    getConfig()
  );

  return response.data;
};
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// ================================
// GET PROFILE
// ================================

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await axios.get(
    `${API_URL}/api/users/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ================================
// UPDATE PROFILE
// ================================

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await axios.put(
    `${API_URL}/api/users/profile`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ================================
// SEARCH USERS
// ================================

export const searchUsers = async (query) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/users/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ================================
// GET USER BY ID
// ================================

export const getUserById = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ================================
// FOLLOW USER
// ================================

export const followUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/api/users/${userId}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ================================
// UNFOLLOW USER
// ================================

export const unfollowUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/api/users/${userId}/unfollow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
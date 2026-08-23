import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// =====================================
// REGISTER
// =====================================

export const registerUser = async (userData) => {
  const response = await API.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};

// =====================================
// LOGIN
// =====================================

export const loginUser = async (userData) => {
  const response = await API.post(
    "/api/auth/login",
    userData
  );

  return response.data;
};

// =====================================
// GET CURRENT USER
// =====================================

export const getCurrentUser = async (token) => {
  const response = await API.get(
    "/api/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default API;
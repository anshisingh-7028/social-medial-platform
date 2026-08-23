import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


// Register
export const registerUser = async (userData) => {
  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// Login
export const loginUser = async (userData) => {
  const response = await API.post(
    "/auth/login",
    userData
  );

  return response.data;
};


// Get current user
export const getCurrentUser = async (token) => {
  const response = await API.get(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export default API;
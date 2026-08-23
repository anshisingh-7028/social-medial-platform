import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import socket from "../services/socket";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authApi";


const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem("token")
    );

    // =====================================
// SOCKET.IO CONNECTION
// =====================================

useEffect(() => {

  const userId =
    user?._id || user?.id;

  // User login nahi hai
  if (!userId) {
    return;
  }

  // Connect socket
  socket.connect();

  // User ko uske private room me join karvao
  socket.emit(
    "join",
    userId
  );

  // Cleanup
  return () => {

    socket.disconnect();

  };

}, [user]);

  const [loading, setLoading] =
    useState(true);


  // Get current user
  useEffect(() => {

    const fetchUser = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const data =
          await getCurrentUser(token);

        setUser(data.user);

      } catch (error) {

        console.error(
          "User fetch error:",
          error
        );

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    fetchUser();

  }, [token]);


  // Register
  const register = async (
    userData
  ) => {

    const data =
      await registerUser(userData);

    return data;
  };


  // Login
  const login = async (
    userData
  ) => {

    const data =
      await loginUser(userData);

    localStorage.setItem(
      "token",
      data.token
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };


  // Logout
  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
  setUser(updatedUser);
};


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () =>
  useContext(AuthContext);
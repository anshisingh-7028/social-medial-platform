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

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  // =====================================
  // GET CURRENT USER
  // =====================================

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken =
        localStorage.getItem("token");

      // Token nahi hai
      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const data =
          await getCurrentUser(savedToken);

        console.log(
          "CURRENT USER RESPONSE:",
          data
        );

        // API response ke different possible formats
        const currentUser =
          data?.user ||
          data?.data?.user ||
          data?.data ||
          null;

        if (currentUser) {
          setUser(currentUser);
          setToken(savedToken);
        } else {
          throw new Error(
            "User data not found"
          );
        }
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
  }, []);

  // =====================================
  // SOCKET.IO CONNECTION
  // =====================================

  useEffect(() => {
    const userId =
      user?._id || user?.id;

    if (!userId) {
      return;
    }

    socket.connect();

    socket.emit(
      "join",
      userId.toString()
    );

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // =====================================
  // REGISTER
  // =====================================

  const register = async (userData) => {
    const data =
      await registerUser(userData);

    return data;
  };

  // =====================================
  // LOGIN
  // =====================================

  const login = async (userData) => {
    const data =
      await loginUser(userData);

    console.log(
      "LOGIN RESPONSE:",
      data
    );

    const newToken =
      data?.token ||
      data?.data?.token;

    const loggedInUser =
      data?.user ||
      data?.data?.user;

    if (!newToken) {
      throw new Error(
        "Token not received from server"
      );
    }

    // Save token
    localStorage.setItem(
      "token",
      newToken
    );

    setToken(newToken);

    // Set user immediately
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    return data;
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    setToken(null);
    setUser(null);
  };

  // =====================================
  // UPDATE USER
  // =====================================

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

export const useAuth = () => {
  return useContext(AuthContext);
};
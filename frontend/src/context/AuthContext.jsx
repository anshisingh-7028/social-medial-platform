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
  // CHECK EXISTING LOGIN
  // =====================================

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken =
        localStorage.getItem("token");

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
          "CURRENT USER:",
          data
        );

        if (data?.success && data?.user) {
          setUser(data.user);
          setToken(savedToken);
        } else {
          throw new Error(
            "Invalid user response"
          );
        }
      } catch (error) {
        console.error(
          "AUTH CHECK ERROR:",
          error
        );

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // =====================================
  // SOCKET
  // =====================================

  useEffect(() => {
    const userId =
      user?.id || user?._id;

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
    try {
      const data =
        await loginUser(userData);

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      if (!data?.token) {
        throw new Error(
          "Token not received"
        );
      }

      // Save token
      localStorage.setItem(
        "token",
        data.token
      );

      // Update React state
      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      throw error;
    }
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
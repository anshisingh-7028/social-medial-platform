import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    user,
    loading,
  } = useAuth();

  // User information load ho rahi hai
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // User login nahi hai
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User login hai
  return children;
};

export default ProtectedRoute;
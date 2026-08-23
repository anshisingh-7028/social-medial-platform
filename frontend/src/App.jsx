import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Explore from "./pages/Explore";
import Create from "./pages/Create";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================
            PUBLIC ROUTES
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================
            ROOT ROUTE
            Project start -> Login
        ================================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />


        {/* ================================
            HOME
        ================================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />


        {/* ================================
            MY PROFILE
        ================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ================================
            OTHER USER PROFILE
        ================================= */}

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />


        {/* ================================
            USER PROFILE - ALTERNATIVE
        ================================= */}

        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />


        {/* ================================
            EXPLORE
        ================================= */}

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />


        {/* ================================
            CREATE POST
        ================================= */}

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />


        {/* ================================
            NOTIFICATIONS
        ================================= */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />


        {/* ================================
            MESSAGES
        ================================= */}

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages/:userId"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />


        {/* ================================
            CHAT
        ================================= */}

        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />


        {/* ================================
            404
        ================================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
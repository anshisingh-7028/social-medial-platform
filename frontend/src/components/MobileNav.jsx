import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileNav = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    {
      name: "Home",
      icon: "🏠",
      path: "/",
    },
    {
      name: "Explore",
      icon: "🌎",
      path: "/explore",
    },
    {
      name: "Create",
      icon: "➕",
      path: "/create",
    },
    {
      name: "Messages",
      icon: "💬",
      path: "/messages",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },
  ];

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    try {
      if (logout) {
        await logout();
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      // Fallback
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-slate-200
        bg-white/95
        backdrop-blur-xl
        lg:hidden
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-md
          items-center
          justify-around
          px-1
        "
      >
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              min-w-12
              flex-col
              items-center
              justify-center
              gap-0.5
              text-[10px]
              font-semibold
              transition
              ${
                isActive
                  ? "text-purple-600"
                  : "text-slate-400"
              }
              `
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            min-w-12
            flex-col
            items-center
            justify-center
            gap-0.5
            text-[10px]
            font-semibold
            text-red-500
            transition
            hover:text-red-600
          "
        >
          <span className="text-lg">
            🚪
          </span>

          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
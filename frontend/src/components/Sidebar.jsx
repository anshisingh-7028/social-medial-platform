import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
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
      name: "Messages",
      icon: "💬",
      path: "/messages",
    },
    {
      name: "Notifications",
      icon: "🔔",
      path: "/notifications",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/profile",
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 space-y-5">

        {/* USER CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">

            <img
              src={
                user?.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(
                    user?.name || "User"
                  )
              }
              alt="avatar"
              className="h-12 w-12 rounded-full object-cover"
            />

            <div className="min-w-0">
              <h3 className="truncate font-bold text-slate-900">
                {user?.name || "User"}
              </h3>

              <p className="truncate text-sm text-slate-500">
                @{user?.username || "username"}
              </p>
            </div>

          </div>
        </div>

        {/* MENU */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="space-y-1">

            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center gap-4
                  rounded-xl px-4 py-3
                  text-sm font-semibold
                  transition
                  ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                  `
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                {item.name}
              </NavLink>
            ))}

          </div>
        </div>

        {/* CREATE POST */}
        <button
          type="button"
          onClick={() => navigate("/create")}
          className="
            w-full
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            px-4
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-purple-200
            transition
            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >
          + Create Post
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

import { useAuth } from "../context/AuthContext";

import {
  searchUsers,
  followUser,
  unfollowUser,
} from "../services/userApi";

const Explore = () => {
  const { user: currentUser } = useAuth();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] =
    useState(null);

  // =====================================
  // SEARCH USERS
  // =====================================

  const handleSearch = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchUsers(
        value.trim()
      );

      if (data?.success) {
        setUsers(data.users || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(
        "SEARCH USERS ERROR:",
        error
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FOLLOW / UNFOLLOW
  // =====================================

  const handleFollow = async (user) => {
    if (!user?._id) return;

    try {
      setFollowLoading(user._id);

      const currentFollowing =
        currentUser?.following || [];

      const isFollowing =
        currentFollowing.some(
          (id) =>
            (id?._id || id)?.toString() ===
            user._id.toString()
        );

      if (isFollowing) {
        const data =
          await unfollowUser(user._id);

        if (data?.success) {
          setUsers((prev) =>
            prev.map((item) =>
              item._id === user._id
                ? {
                    ...item,
                    isFollowing: false,
                  }
                : item
            )
          );
        }
      } else {
        const data =
          await followUser(user._id);

        if (data?.success) {
          setUsers((prev) =>
            prev.map((item) =>
              item._id === user._id
                ? {
                    ...item,
                    isFollowing: true,
                  }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error(
        "FOLLOW ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update follow"
      );
    } finally {
      setFollowLoading(null);
    }
  };

  // =====================================
  // INITIAL EXPLORE
  // =====================================

  useEffect(() => {
    handleSearch("");
  }, []);

  // =====================================
  // AVATAR
  // =====================================

  const getAvatar = (user) => {
    return (
      user?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}&background=7c3aed&color=fff&size=200`
    );
  };

  // =====================================
  // CHECK FOLLOWING
  // =====================================

  const isFollowing = (user) => {
    if (!currentUser?.following) {
      return false;
    }

    return currentUser.following.some(
      (id) =>
        (id?._id || id)?.toString() ===
        user?._id?.toString()
    );
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        pb-20
        lg:pb-0
      "
    >
      <Navbar />

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          gap-6
          px-4
          py-6
          sm:px-6
        "
      >
        <Sidebar />

        <main
          className="
            min-w-0
            flex-1
          "
        >
          {/* HEADER */}

          <div className="mb-6">
            <h1
              className="
                text-2xl
                font-extrabold
                text-slate-900
                sm:text-3xl
              "
            >
              Explore
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Discover people and connect
              with them.
            </p>
          </div>

          {/* SEARCH */}

          <div
            className="
              mb-6
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            <div className="relative">
              <span
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-lg
                "
              >
                🔍
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) =>
                  handleSearch(
                    e.target.value
                  )
                }
                placeholder="Search people..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-12
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-purple-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-purple-100
                "
              />
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div
              className="
                flex
                justify-center
                py-12
              "
            >
              <div
                className="
                  h-9
                  w-9
                  animate-spin
                  rounded-full
                  border-4
                  border-purple-200
                  border-t-purple-600
                "
              />
            </div>
          )}

          {/* RESULTS */}

          {!loading && query.trim() && (
            <>
              {users.length === 0 ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    py-16
                    text-center
                  "
                >
                  <div className="text-5xl">
                    🔍
                  </div>

                  <h2
                    className="
                      mt-4
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    No users found
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Try searching with another
                    name or username.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  {users.map((user) => {
                    const following =
                      isFollowing(user);

                    const isMe =
                      user._id?.toString() ===
                      currentUser?._id?.toString();

                    return (
                      <div
                        key={user._id}
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          p-4
                          shadow-sm
                          transition
                          hover:-translate-y-0.5
                          hover:shadow-md
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-4
                          "
                        >
                          <img
                            src={getAvatar(user)}
                            alt={
                              user.name ||
                              "User"
                            }
                            className="
                              h-14
                              w-14
                              shrink-0
                              rounded-full
                              object-cover
                              ring-2
                              ring-purple-100
                            "
                          />

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <h3
                              className="
                                truncate
                                font-bold
                                text-slate-900
                              "
                            >
                              {user.name ||
                                "User"}
                            </h3>

                            <p
                              className="
                                truncate
                                text-sm
                                text-slate-500
                              "
                            >
                              @
                              {user.username ||
                                "username"}
                            </p>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        <div
                          className="
                            mt-4
                            flex
                            gap-2
                          "
                        >
                          <Link
  to={`/user/${user._id}`}
  className="
    flex-1
    rounded-xl
    border
    border-slate-200
    px-3
    py-2.5
    text-center
    text-sm
    font-semibold
    text-slate-700
    transition
    hover:bg-slate-50
  "
>
  View Profile
</Link>

                          {!isMe && (
                            <button
                              type="button"
                              onClick={() =>
                                handleFollow(
                                  user
                                )
                              }
                              disabled={
                                followLoading ===
                                user._id
                              }
                              className={`
                                flex-1
                                rounded-xl
                                px-3
                                py-2.5
                                text-sm
                                font-bold
                                transition

                                ${
                                  following
                                    ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    : "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm hover:-translate-y-0.5"
                                }

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              `}
                            >
                              {followLoading ===
                              user._id
                                ? "..."
                                : following
                                ? "Following"
                                : "Follow"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* DEFAULT */}

          {!loading &&
            !query.trim() && (
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-16
                  text-center
                "
              >
                <div className="text-6xl">
                  🌎
                </div>

                <h2
                  className="
                    mt-5
                    text-xl
                    font-extrabold
                    text-slate-900
                  "
                >
                  Discover people
                </h2>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Search for people by their
                  name or username and start
                  connecting.
                </p>
              </div>
            )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default Explore;
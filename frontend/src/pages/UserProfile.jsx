import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import PostCard from "../components/PostCard";

import { useAuth } from "../context/AuthContext";

import {
  getUserById,
  followUser,
  unfollowUser,
} from "../services/userApi";

import { getUserPosts } from "../services/postApi";

const UserProfile = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { user: currentUser } = useAuth();

  // =====================================
  // USER
  // =====================================

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // =====================================
  // POSTS
  // =====================================

  const [posts, setPosts] = useState([]);

  const [loadingPosts, setLoadingPosts] =
    useState(true);

  // =====================================
  // FOLLOW
  // =====================================

  const [followLoading, setFollowLoading] =
    useState(false);

  // =====================================
  // GET USER PROFILE
  // =====================================

  const fetchUser = async () => {
    try {
      setLoading(true);
 const data = await getUserById(id);

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "GET USER PROFILE ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GET USER POSTS
  // =====================================

  const fetchUserPosts = async () => {
    if (!id) {
      setPosts([]);
      setLoadingPosts(false);
      return;
    }

    try {
      setLoadingPosts(true);

      const data =
        await getUserPosts(id);

      if (
        data?.success &&
        Array.isArray(data.posts)
      ) {
        setPosts(data.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error(
        "GET USER POSTS ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  // =====================================
  // LOAD PROFILE + POSTS
  // =====================================

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchUser();
    fetchUserPosts();
  }, [id]);

  // =====================================
  // CHECK FOLLOWING
  // =====================================

  const isFollowing =
    user?.followers?.some((follower) => {
      const followerId =
        follower?._id || follower;

      return (
        followerId?.toString() ===
        currentUser?._id?.toString()
      );
    }) || false;

  // =====================================
  // FOLLOW / UNFOLLOW
  // =====================================

  const handleFollow = async () => {
    if (!user?._id) {
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        await unfollowUser(user._id);
      } else {
        await followUser(user._id);
      }

      // Refresh user profile
      await fetchUser();

    } catch (error) {
      console.error(
        "FOLLOW ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // =====================================
  // OPEN CHAT
  // =====================================

  const handleMessage = () => {

    if (!user?._id) {
      alert("User ID not found");
      return;
    }

    navigate(`/chat/${user._id}`);
  };

  // =====================================
  // LOADING PROFILE
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">

            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-purple-200
                border-t-purple-600
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-slate-500
              "
            >
              Loading profile...
            </p>

          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  // =====================================
  // USER NOT FOUND
  // =====================================

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
            px-4
          "
        >
          <div className="text-center">

            <div className="text-6xl">
              😕
            </div>

            <h2
              className="
                mt-4
                text-xl
                font-bold
                text-slate-900
              "
            >
              User not found
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              This profile may have been removed.
            </p>

            <button
              onClick={() => navigate(-1)}
              className="
                mt-5
                rounded-xl
                bg-purple-600
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                hover:bg-purple-700
              "
            >
              Go Back
            </button>

          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  // =====================================
  // AVATAR
  // =====================================

  const avatar =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name || "User"
    )}&background=7c3aed&color=fff&size=200`;

  // =====================================
  // OWN PROFILE
  // =====================================

  const isOwnProfile =
    currentUser?._id?.toString() ===
    user?._id?.toString();

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

      {/* =====================================
          NAVBAR
      ===================================== */}

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

        {/* =====================================
            SIDEBAR
        ===================================== */}

        <Sidebar />

        {/* =====================================
            MAIN
        ===================================== */}

        <main className="min-w-0 flex-1">

          {/* =====================================
              PROFILE CARD
          ===================================== */}

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            {/* COVER */}

            <div
              className="
                h-40
                bg-gradient-to-r
                from-purple-600
                via-purple-500
                to-pink-500
                sm:h-56
              "
            />

            {/* PROFILE CONTENT */}

            <div
              className="
                px-5
                pb-7
                sm:px-8
              "
            >

              {/* AVATAR + ACTION BUTTONS */}

              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                "
              >

                {/* AVATAR */}

                <img
                  src={avatar}
                  alt={user.name || "User"}
                  className="
                    -mt-14
                    h-28
                    w-28
                    rounded-full
                    border-4
                    border-white
                    object-cover
                    shadow-xl
                    sm:-mt-16
                    sm:h-32
                    sm:w-32
                  "
                />

                {/* ACTION BUTTONS */}

                {!isOwnProfile && (
                  <div
                    className="
                      mt-4
                      flex
                      flex-col
                      gap-2
                      sm:flex-row
                    "
                  >

                    {/* FOLLOW */}

                    <button
                      type="button"
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`
                        rounded-xl
                        px-5
                        py-2.5
                        text-sm
                        font-bold
                        shadow-sm
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        ${
                          isFollowing
                            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:-translate-y-0.5"
                        }
                      `}
                    >
                      {followLoading
                        ? "..."
                        : isFollowing
                        ? "✓ Following"
                        : "+ Follow"}
                    </button>

                    {/* MESSAGE */}

                    <button
                      type="button"
                      onClick={handleMessage}
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        py-2.5
                        text-sm
                        font-bold
                        text-slate-700
                        shadow-sm
                        transition
                        hover:bg-slate-50
                        hover:text-purple-600
                      "
                    >
                      💬 Message
                    </button>

                  </div>
                )}

              </div>

              {/* =====================================
                  NAME
              ===================================== */}

              <div className="mt-4">

                <h1
                  className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                  "
                >
                  {user.name || "User"}
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  @{user.username || "username"}
                </p>

              </div>

              {/* =====================================
                  BIO
              ===================================== */}

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                {user.bio ||
                  "No bio available."}
              </p>

              {/* =====================================
                  STATS
              ===================================== */}

              <div
                className="
                  mt-6
                  flex
                  gap-8
                  sm:gap-10
                "
              >

                {/* POSTS */}

                <div>
                  <p
                    className="
                      text-xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    {posts.length}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Posts
                  </p>
                </div>

                {/* FOLLOWERS */}

                <div>
                  <p
                    className="
                      text-xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    {user.followers?.length || 0}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Followers
                  </p>
                </div>

                {/* FOLLOWING */}

                <div>
                  <p
                    className="
                      text-xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    {user.following?.length || 0}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Following
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* =====================================
              POSTS SECTION
          ===================================== */}

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              sm:p-6
            "
          >

            {/* HEADER */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-extrabold
                  text-slate-900
                "
              >
                Posts
              </h2>

              <span
                className="
                  rounded-full
                  bg-purple-100
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-purple-700
                "
              >
                {posts.length}
              </span>

            </div>

            {/* =====================================
                POSTS LOADING
            ===================================== */}

            {loadingPosts ? (

              <div
                className="
                  flex
                  min-h-60
                  flex-col
                  items-center
                  justify-center
                  text-center
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

                <p
                  className="
                    mt-3
                    text-sm
                    text-slate-500
                  "
                >
                  Loading posts...
                </p>

              </div>

            ) : posts.length === 0 ? (

              /* =====================================
                  NO POSTS
              ===================================== */

              <div
                className="
                  flex
                  min-h-60
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >

                <div className="text-5xl">
                  📸
                </div>

                <h3
                  className="
                    mt-4
                    font-bold
                    text-slate-800
                  "
                >
                  No posts yet
                </h3>

                <p
                  className="
                    mt-1
                    max-w-sm
                    text-sm
                    text-slate-500
                  "
                >
                  This user hasn't shared
                  any posts yet.
                </p>

              </div>

            ) : (

              /* =====================================
                  USER POSTS
              ===================================== */

              <div
                className="
                  mx-auto
                  max-w-2xl
                  space-y-5
                "
              >

                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                  />
                ))}

              </div>

            )}

          </div>

        </main>
      </div>

      {/* =====================================
          MOBILE NAV
      ===================================== */}

      <MobileNav />

    </div>
  );
};

export default UserProfile;
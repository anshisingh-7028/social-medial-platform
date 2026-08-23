import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import PostCard from "../components/PostCard";

import {
  getProfile,
  getUserById,
  updateProfile,
  followUser,
  unfollowUser,
} from "../services/userApi";

import { getUserPosts } from "../services/postApi";

const Profile = () => {
  const {
    user: currentUser,
    updateUser,
  } = useAuth();

  const { userId } = useParams();

  // =====================================
  // CHECK PROFILE OWNER
  // =====================================
const currentUserId =
  currentUser?._id?.toString() ||
  currentUser?.id?.toString();

const isOwnProfile =
  !userId ||
  userId.toString() === currentUserId;
  // =====================================
  // PROFILE USER
  // =====================================

  const [profileUser, setProfileUser] =
    useState(
      isOwnProfile
        ? currentUser
        : null
    );

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  // =====================================
  // POSTS
  // =====================================

  const [posts, setPosts] = useState([]);

  const [loadingPosts, setLoadingPosts] =
    useState(true);

  // =====================================
  // FOLLOW
  // =====================================

  const [isFollowing, setIsFollowing] =
    useState(false);

  const [followLoading, setFollowLoading] =
    useState(false);

  // =====================================
  // EDIT PROFILE
  // =====================================

  const [showEdit, setShowEdit] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // =====================================
  // FORM DATA
  // =====================================

  const [formData, setFormData] =
    useState({
      name: "",
      username: "",
      bio: "",
      avatar: "",
    });

  // =====================================
  // LOAD PROFILE
  // =====================================
useEffect(() => {
  const loadProfile = async () => {
    if (!currentUser) return;

    try {
      setLoadingProfile(true);

      if (isOwnProfile) {
        const data = await getProfile();

        if (data?.success && data?.user) {
          const loadedUser = data.user;

          setProfileUser(loadedUser);

          setFormData({
            name: loadedUser?.name || "",
            username: loadedUser?.username || "",
            bio: loadedUser?.bio || "",
            avatar: loadedUser?.avatar || "",
          });
        } else {
          setProfileUser(null);
        }

        return;
      }

      const data = await getUserById(userId);

      if (data?.success && data?.user) {
        const loadedUser = data.user;

        setProfileUser(loadedUser);

        const following =
          currentUser?.following || [];

        const followingStatus = following.some(
          (id) =>
            (id?._id || id).toString() ===
            loadedUser?._id?.toString()
        );

        setIsFollowing(followingStatus);
      } else {
        setProfileUser(null);
      }

    } catch (error) {
      console.error(
        "LOAD PROFILE ERROR:",
        error
      );

      console.error(
        "SERVER ERROR:",
        error.response?.data
      );

      setProfileUser(null);

    } finally {
      setLoadingProfile(false);
    }
  };

  loadProfile();

}, [
  userId,
  currentUser?._id,
  currentUser?.id,
]);

  // =====================================
  // LOAD USER POSTS
  // =====================================

  useEffect(() => {
    const loadUserPosts =
      async () => {
        if (!profileUser?._id) {
          setLoadingPosts(false);
          return;
        }

        try {
          setLoadingPosts(true);

          const data =
            await getUserPosts(
              profileUser._id
            );

          if (data?.success) {
            setPosts(
              data.posts || []
            );
          } else {
            setPosts([]);
          }
        } catch (error) {
          console.error(
            "PROFILE POSTS ERROR:",
            error
          );

          setPosts([]);
        } finally {
          setLoadingPosts(false);
        }
      };

    loadUserPosts();
  }, [profileUser?._id]);

  // =====================================
  // FOLLOW / UNFOLLOW
  // =====================================

  const handleFollow = async () => {
    if (
      !profileUser?._id ||
      isOwnProfile ||
      followLoading
    ) {
      return;
    }

    try {
      setFollowLoading(true);

      // ================================
      // UNFOLLOW
      // ================================

      if (isFollowing) {
        const data =
          await unfollowUser(
            profileUser._id
          );

        if (data?.success) {
          setIsFollowing(false);

          setProfileUser(
            (prev) => ({
              ...prev,

              followers:
                prev.followers?.filter(
                  (id) =>
                    (
                      id?._id || id
                    )?.toString() !==
                    currentUser?._id?.toString()
                ) || [],
            })
          );
        }
      }

      // ================================
      // FOLLOW
      // ================================

      else {
        const data =
          await followUser(
            profileUser._id
          );

        if (data?.success) {
          setIsFollowing(true);

          setProfileUser(
            (prev) => ({
              ...prev,

              followers: [
                ...(prev.followers ||
                  []),

                currentUser?._id,
              ],
            })
          );
        }
      }
    } catch (error) {
      console.error(
        "FOLLOW ERROR:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to update follow"
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // =====================================
  // OPEN EDIT PROFILE
  // =====================================

  const handleOpenEdit = () => {
    setFormData({
      name:
        profileUser?.name || "",

      username:
        profileUser?.username ||
        "",

      bio:
        profileUser?.bio || "",

      avatar:
        profileUser?.avatar || "",
    });

    setShowEdit(true);
  };

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleEditChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =====================================
  // UPDATE PROFILE
  // =====================================

  const handleUpdateProfile =
    async (e) => {
      e.preventDefault();

      if (
        !formData.name.trim()
      ) {
        alert(
          "Name is required"
        );
        return;
      }

      if (
        !formData.username.trim()
      ) {
        alert(
          "Username is required"
        );
        return;
      }

      try {
        setSaving(true);

        const data =
          await updateProfile(
            formData
          );

        if (data?.success) {
          setProfileUser(
            data.user
          );

          if (updateUser) {
            updateUser(
              data.user
            );
          }

          setShowEdit(false);

          alert(
            "Profile updated successfully! ✅"
          );
        } else {
          alert(
            data?.message ||
              "Profile update failed"
          );
        }
      } catch (error) {
        console.error(
          "PROFILE UPDATE ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
            "Profile update failed"
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================
  // AVATAR
  // =====================================

  const avatar =
    profileUser?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profileUser?.name ||
        "User"
    )}&background=7c3aed&color=fff&size=200`;

  // =====================================
  // LOADING PROFILE
  // =====================================

  if (loadingProfile) {
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
  // PROFILE NOT FOUND
  // =====================================

  if (!profileUser) {
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
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-10
              text-center
              shadow-sm
            "
          >
            <div className="text-5xl">
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
              Profile not found
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              This user profile
              does not exist.
            </p>
          </div>
        </div>

        <MobileNav />
      </div>
    );
  }

  // =====================================
  // MAIN
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
        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN */}

        <main
          className="
            min-w-0
            flex-1
          "
        >
          {/* =================================
              PROFILE CARD
          ================================= */}

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
              <div className="relative">

                {/* AVATAR */}

                <img
                  src={avatar}
                  alt={
                    profileUser.name ||
                    "User"
                  }
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

                <div
                  className="
                    absolute
                    right-0
                    top-4
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {/* OWN PROFILE */}

                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={
                        handleOpenEdit
                      }
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-slate-700
                        shadow-sm
                        transition
                        hover:bg-slate-50
                      "
                    >
                      ✏️ Edit Profile
                    </button>
                  )}

                  {/* OTHER USER */}

                  {!isOwnProfile && (
                    <>
                      {/* MESSAGE */}

                      <Link
                        to={`/messages/${profileUser._id}`}
                        className="
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-2.5
                          text-sm
                          font-bold
                          text-slate-700
                          shadow-sm
                          transition
                          hover:bg-slate-50
                        "
                      >
                        💬 Message
                      </Link>

                      {/* FOLLOW */}

                      <button
                        type="button"
                        onClick={
                          handleFollow
                        }
                        disabled={
                          followLoading
                        }
                        className={`
                          rounded-xl
                          px-5
                          py-2.5
                          text-sm
                          font-bold
                          transition
                          disabled:cursor-not-allowed
                          disabled:opacity-60

                          ${
                            isFollowing
                              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              : "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200 hover:-translate-y-0.5"
                          }
                        `}
                      >
                        {followLoading
                          ? "..."
                          : isFollowing
                          ? "Following"
                          : "Follow"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* NAME */}

              <div className="mt-4">
                <h1
                  className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                  "
                >
                  {profileUser.name ||
                    "User"}
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  @
                  {profileUser.username ||
                    "username"}
                </p>
              </div>

              {/* BIO */}

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                {profileUser.bio ||
                  "Hey there! I'm new to Socially 👋"}
              </p>

              {/* STATS */}

              <div
                className="
                  mt-6
                  grid
                  max-w-md
                  grid-cols-3
                  divide-x
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                "
              >
                {/* POSTS */}

                <div
                  className="
                    px-3
                    py-3
                    text-center
                  "
                >
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

                <div
                  className="
                    px-3
                    py-3
                    text-center
                  "
                >
                  <p
                    className="
                      text-xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    {
                      profileUser
                        .followers
                        ?.length || 0
                    }
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

                <div
                  className="
                    px-3
                    py-3
                    text-center
                  "
                >
                  <p
                    className="
                      text-xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    {
                      profileUser
                        .following
                        ?.length || 0
                    }
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

          {/* =================================
              POSTS
          ================================= */}

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              sm:p-6
            "
          >
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
                {isOwnProfile
                  ? "My Posts"
                  : `${profileUser.name}'s Posts`}
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

            {/* LOADING */}

            {loadingPosts ? (
              <div
                className="
                  flex
                  min-h-60
                  items-center
                  justify-center
                "
              >
                <div className="text-center">
                  <div
                    className="
                      mx-auto
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
              </div>
            ) : posts.length === 0 ? (
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
                    text-sm
                    text-slate-500
                  "
                >
                  {isOwnProfile
                    ? "Share your first moment with the world."
                    : "This user hasn't shared any posts yet."}
                </p>
              </div>
            ) : (
              <div
                className="
                  mx-auto
                  max-w-2xl
                  space-y-5
                "
              >
                {posts.map(
                  (post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =====================================
          EDIT PROFILE MODAL
      ===================================== */}

      {showEdit &&
        isOwnProfile && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/60
              px-4
              py-6
              backdrop-blur-sm
            "
          >
            <div
              className="
                max-h-[90vh]
                w-full
                max-w-lg
                overflow-y-auto
                rounded-3xl
                bg-white
                p-6
                shadow-2xl
                sm:p-8
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h2
                    className="
                      text-xl
                      font-extrabold
                      text-slate-900
                    "
                  >
                    Edit Profile
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    Update your profile
                    information
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowEdit(false)
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-100
                    text-slate-500
                    hover:bg-slate-200
                  "
                >
                  ✕
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleUpdateProfile
                }
                className="
                  mt-6
                  space-y-5
                "
              >
                {/* NAME */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleEditChange
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      text-sm
                      outline-none
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />
                </div>

                {/* USERNAME */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={
                      formData.username
                    }
                    onChange={
                      handleEditChange
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      text-sm
                      outline-none
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />
                </div>

                {/* BIO */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={
                      formData.bio
                    }
                    onChange={
                      handleEditChange
                    }
                    maxLength={160}
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      text-sm
                      outline-none
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                  <p
                    className="
                      mt-1
                      text-right
                      text-xs
                      text-slate-400
                    "
                  >
                    {
                      formData.bio
                        .length
                    }
                    /160
                  </p>
                </div>

                {/* AVATAR */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Profile Image URL
                  </label>

                  <input
                    type="url"
                    name="avatar"
                    value={
                      formData.avatar
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      text-sm
                      outline-none
                      focus:border-purple-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />
                </div>

                {/* BUTTONS */}

                <div
                  className="
                    flex
                    flex-col-reverse
                    gap-3
                    sm:flex-row
                    sm:justify-end
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowEdit(false)
                    }
                    className="
                      h-11
                      rounded-xl
                      border
                      border-slate-200
                      px-5
                      text-sm
                      font-bold
                      text-slate-600
                      hover:bg-slate-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="
                      h-11
                      rounded-xl
                      bg-gradient-to-r
                      from-purple-600
                      to-pink-500
                      px-6
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      shadow-purple-200
                      transition
                      hover:-translate-y-0.5
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* MOBILE NAV */}

      <MobileNav />
    </div>
  );
};

export default Profile;
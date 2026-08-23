import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

import { getPosts } from "../services/postApi";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================
  // LOAD POSTS
  // =====================================

  const loadPosts = async () => {
    try {
      setLoading(true);

      const data = await getPosts();

     

      if (data?.success) {
        setPosts(data.posts || []);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("LOAD POSTS ERROR:", error);

      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    loadPosts();
  }, []);

  // =====================================
  // CREATE POST
  // =====================================

  const handlePostCreated = (newPost) => {
   

    if (!newPost?._id) {
      return;
    }

    setPosts((prev) => {
      // Duplicate post avoid
      const alreadyExists = prev.some(
        (post) => post._id === newPost._id
      );

      if (alreadyExists) {
        return prev;
      }

      return [newPost, ...prev];
    });
  };

  // =====================================
  // DELETE POST
  // =====================================

  const handlePostDeleted = (postId) => {
   

    if (!postId) {
      return;
    }

    setPosts((prev) =>
      prev.filter(
        (post) =>
          post?._id?.toString() !==
          postId?.toString()
      )
    );
  };

  // =====================================
  // REFRESH
  // =====================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const data = await getPosts();

      if (data?.success) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error(
        "REFRESH POSTS ERROR:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
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

          <main className="min-w-0 flex-1">
            <div
              className="
                flex
                min-h-[70vh]
                items-center
                justify-center
              "
            >
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
                  Loading posts...
                </p>
              </div>
            </div>
          </main>
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
      {/* NAVBAR */}

      <Navbar />

      {/* MAIN LAYOUT */}

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

        {/* FEED */}

        <main
          className="
            min-w-0
            flex-1
          "
        >
          {/* PAGE HEADER */}

          <div
            className="
              mb-6
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <h1
                className="
                  text-2xl
                  font-extrabold
                  text-slate-900
                  sm:text-3xl
                "
              >
                Home
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                See what people are sharing
              </p>
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="
                shrink-0
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>
          </div>

          {/* CREATE POST */}

          <CreatePost
            onPostCreated={handlePostCreated}
          />

          {/* POSTS */}

          <div className="mt-6">
            {posts.length === 0 ? (
              // =========================
              // EMPTY STATE
              // =========================

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
                  📭
                </div>

                <h2
                  className="
                    mt-5
                    text-xl
                    font-extrabold
                    text-slate-900
                  "
                >
                  No posts yet
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
                  There are no posts to show
                  right now. Create the first
                  post and share something with
                  your followers.
                </p>
              </div>
            ) : (
              // =========================
              // POST LIST
              // =========================

              <div className="space-y-5">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDelete={handlePostDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE NAV */}

      <MobileNav />
    </div>
  );
};

export default Home;
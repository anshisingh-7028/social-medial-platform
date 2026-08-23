import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  toggleLike,
  addComment,
  deletePost,
} from "../services/postApi";

const PostCard = ({ post, onDelete }) => {
  const { user: currentUser } = useAuth();

  const [likesCount, setLikesCount] = useState(
    post?.likes?.length || 0
  );

  const [liked, setLiked] = useState(
    post?.likes?.some(
      (id) =>
        (id?._id || id)?.toString() ===
        currentUser?._id?.toString()
    ) || false
  );

  const [comments, setComments] = useState(
    post?.comments || []
  );

  const [commentText, setCommentText] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [likeLoading, setLikeLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // =====================================
  // AUTHOR
  // =====================================

  const author = post?.author;

  const authorId =
    author?._id || author;

  const isOwner =
    authorId?.toString() ===
    currentUser?._id?.toString();

  const avatar =
    author?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      author?.name || "User"
    )}&background=7c3aed&color=fff&size=200`;

  // =====================================
  // LIKE
  // =====================================

  const handleLike = async () => {
    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const data =
        await toggleLike(post._id);

      if (data?.success) {
        setLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error(
        "LIKE POST ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to like post"
      );
    } finally {
      setLikeLoading(false);
    }
  };

  // =====================================
  // COMMENT
  // =====================================

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const data =
        await addComment(
          post._id,
          commentText.trim()
        );

      if (data?.success) {
        setComments(
          data.post?.comments || comments
        );

        setCommentText("");
      }
    } catch (error) {
      console.error(
        "COMMENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setCommentLoading(false);
    }
  };

  // =====================================
  // DELETE POST
  // =====================================

  const handleDelete = async (e) => {
    // Important: prevent any parent form/event
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Prevent double click
    if (deleteLoading) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      const data =
        await deletePost(post._id);

      if (data?.success) {
        // Tell Home.jsx to remove this post
        if (typeof onDelete === "function") {
          onDelete(post._id);
        }
      } else {
        alert(
          data?.message ||
            "Failed to delete post"
        );
      }
    } catch (error) {
      console.error(
        "DELETE POST ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================
  // DATE
  // =====================================

  const postDate = post?.createdAt
    ? new Date(
        post.createdAt
      ).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  // =====================================
  // RENDER
  // =====================================

  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-4
          py-4
        "
      >

        <div className="flex items-center gap-3">

          <img
            src={avatar}
            alt={
              author?.name || "User"
            }
            className="
              h-11
              w-11
              rounded-full
              object-cover
              ring-2
              ring-purple-100
            "
          />

          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              {author?.name || "User"}
            </h3>

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              @{author?.username || "user"}
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-400
              "
            >
              {postDate}
            </p>

          </div>

        </div>

        {/* DELETE */}

        {isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="
              rounded-lg
              px-3
              py-2
              text-sm
              text-red-500
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            title="Delete post"
          >
            {deleteLoading
              ? "Deleting..."
              : "🗑️"}
          </button>
        )}

      </div>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      {post?.content && (
        <div className="px-4 pb-4">

          <p
            className="
              whitespace-pre-wrap
              break-words
              text-sm
              leading-6
              text-slate-700
            "
          >
            {post.content}
          </p>

        </div>
      )}

      {/* ================================= */}
      {/* IMAGE */}
      {/* ================================= */}

      {post?.image && (
        <div className="bg-slate-100">

          <img
            src={post.image}
            alt="Post"
            className="
              max-h-[600px]
              w-full
              object-cover
            "
          />

        </div>
      )}

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          gap-5
          border-t
          border-slate-100
          px-4
          py-3
        "
      >

        {/* LIKE */}

        <button
          type="button"
          onClick={handleLike}
          disabled={likeLoading}
          className={`
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            transition

            ${
              liked
                ? "text-red-500"
                : "text-slate-600 hover:text-red-500"
            }
          `}
        >
          <span className="text-lg">
            {liked ? "❤️" : "🤍"}
          </span>

          <span>
            {likesCount}
          </span>
        </button>

        {/* COMMENT COUNT */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-slate-600
          "
        >
          <span className="text-lg">
            💬
          </span>

          <span>
            {comments.length}
          </span>
        </div>

      </div>

      {/* ================================= */}
      {/* COMMENTS */}
      {/* ================================= */}

      {comments.length > 0 && (
        <div
          className="
            space-y-3
            border-t
            border-slate-100
            px-4
            py-3
          "
        >

          {comments.map(
            (comment, index) => {

              const commentUser =
                comment.user;

              const commentAvatar =
                commentUser?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  commentUser?.name ||
                    "User"
                )}&background=7c3aed&color=fff`;

              return (
                <div
                  key={
                    comment._id ||
                    index
                  }
                  className="
                    flex
                    gap-2
                  "
                >

                  <img
                    src={commentAvatar}
                    alt={
                      commentUser?.name ||
                      "User"
                    }
                    className="
                      h-8
                      w-8
                      rounded-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      min-w-0
                      rounded-xl
                      bg-slate-50
                      px-3
                      py-2
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-bold
                        text-slate-800
                      "
                    >
                      {commentUser?.name ||
                        "User"}
                    </p>

                    <p
                      className="
                        break-words
                        text-sm
                        text-slate-600
                      "
                    >
                      {comment.text}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* ================================= */}
      {/* COMMENT INPUT */}
      {/* ================================= */}

      <form
        onSubmit={handleComment}
        className="
          flex
          items-center
          gap-2
          border-t
          border-slate-100
          p-3
        "
      >

        <input
          type="text"
          value={commentText}
          onChange={(e) =>
            setCommentText(
              e.target.value
            )
          }
          placeholder="Write a comment..."
          className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-3
            py-2.5
            text-sm
            outline-none
            focus:border-purple-500
            focus:bg-white
            focus:ring-4
            focus:ring-purple-100
          "
        />

        <button
          type="submit"
          disabled={
            commentLoading ||
            !commentText.trim()
          }
          className="
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            px-4
            py-2.5
            text-sm
            font-bold
            text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {commentLoading
            ? "..."
            : "Post"}
        </button>

      </form>

    </article>
  );
};

export default PostCard;
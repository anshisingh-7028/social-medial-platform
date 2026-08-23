import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postApi";

const CreatePost = ({ onPostCreated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=7c3aed&color=fff&size=200`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image.trim()) {
      alert("Please write something or add an image.");
      return;
    }

    try {
      setLoading(true);

      const data = await createPost({
        content: content.trim(),
        image: image.trim(),
      });

      if (data?.success) {
        setContent("");
        setImage("");

        if (onPostCreated) {
          onPostCreated(data.post);
        }
      } else {
        alert(
          data?.message ||
            "Failed to create post"
        );
      }
    } catch (error) {
      console.error(
        "CREATE POST ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      {/* HEADER */}

      <div className="flex gap-3">

        <img
          src={avatar}
          alt={user?.name || "User"}
          className="
            h-11
            w-11
            shrink-0
            rounded-full
            object-cover
            ring-2
            ring-purple-100
          "
        />

        <div className="min-w-0 flex-1">

          <p className="text-sm font-bold text-slate-900">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-slate-500">
            Share something with your followers
          </p>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="mt-4"
      >

        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          placeholder="What's on your mind?"
          rows={4}
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-purple-500
            focus:bg-white
            focus:ring-4
            focus:ring-purple-100
          "
        />

        {/* IMAGE URL */}

        <div className="mt-3">

          <input
            type="url"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            placeholder="Paste image URL (optional)"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-3
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

        {/* IMAGE PREVIEW */}

        {image.trim() && (
          <div
            className="
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-slate-200
            "
          >
            <img
              src={image}
              alt="Preview"
              className="
                max-h-80
                w-full
                object-cover
              "
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}

        {/* BOTTOM */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-400
            "
          >
            <span>📝</span>
            <span>
              {content.length}/5000
            </span>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              (!content.trim() &&
                !image.trim())
            }
            className="
              rounded-xl
              bg-gradient-to-r
              from-purple-600
              to-pink-500
              px-6
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-purple-200
              transition
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading
              ? "Posting..."
              : "Create Post"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default CreatePost;
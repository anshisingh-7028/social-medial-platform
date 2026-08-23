import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

import { useAuth } from "../context/AuthContext";

import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
} from "../services/chatApi";

const Chat = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams();

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  // =====================================
  // LOAD CHAT
  // =====================================

  const loadChat = async () => {
    try {
      setLoading(true);

      if (!userId) {
        console.error(
          "User ID missing"
        );
        return;
      }

      // GET / CREATE CONVERSATION
      const conversationData =
        await getOrCreateConversation(
          userId
        );

      if (
        !conversationData?.success
      ) {
        console.error(
          "Conversation failed:",
          conversationData
        );

        return;
      }

      const currentConversation =
        conversationData.conversation;

      if (
        !currentConversation?._id
      ) {
        console.error(
          "Conversation ID missing"
        );

        return;
      }

      setConversation(
        currentConversation
      );

      // GET MESSAGES
      const messageData =
        await getMessages(
          currentConversation._id
        );

      setMessages(
        messageData?.messages || []
      );

    } catch (error) {
      console.error(
        "LOAD CHAT ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to load chat"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD CHAT ON PAGE OPEN
  // =====================================

  useEffect(() => {
    if (userId) {
      loadChat();
    }
  }, [userId]);

  // =====================================
  // SEND MESSAGE
  // =====================================

  const handleSend = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!text.trim()) {
      console.log(
        "Message is empty"
      );

      return;
    }

    if (!conversation?._id) {
      alert(
        "Conversation not ready. Please wait a moment."
      );

      return;
    }

    try {
      setSending(true);

      const messageText =
        text.trim();

      const data =
        await sendMessage(
          conversation._id,
          messageText
        );

      if (
        data?.success &&
        data?.message
      ) {
        setMessages(
          (prev) => [
            ...prev,
            data.message,
          ]
        );

        setText("");
      } else {
        console.error(
          "Message send failed:",
          data
        );

        alert(
          data?.message ||
            "Message send failed"
        );
      }

    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Message send failed"
      );

    } finally {
      setSending(false);
    }
  };

  // =====================================
  // EDIT MESSAGE
  // =====================================

  const handleEdit = async (
    message
  ) => {
    if (
      !message ||
      message.deleted
    ) {
      return;
    }

    const newText =
      window.prompt(
        "Edit message:",
        message.text
      );

    if (
      newText === null ||
      !newText.trim()
    ) {
      return;
    }

    try {
      const data =
        await editMessage(
          message._id,
          newText.trim()
        );

      if (
        data?.success &&
        data?.message
      ) {
        setMessages(
          (prev) =>
            prev.map(
              (item) =>
                item._id ===
                message._id
                  ? data.message
                  : item
            )
        );
      } else {
        alert(
          data?.message ||
            "Message edit failed"
        );
      }

    } catch (error) {
      console.error(
        "EDIT MESSAGE ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Message edit failed"
      );
    }
  };

  // =====================================
  // DELETE MESSAGE
  // =====================================

  const handleDelete = async (
    messageId
  ) => {
    if (!messageId) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this message?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const data =
        await deleteMessage(
          messageId
        );

      if (
        data?.success &&
        data?.message
      ) {
        setMessages(
          (prev) =>
            prev.map(
              (item) =>
                item._id ===
                messageId
                  ? data.message
                  : item
            )
        );
      } else {
        alert(
          data?.message ||
            "Message delete failed"
        );
      }

    } catch (error) {
      console.error(
        "DELETE MESSAGE ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Message delete failed"
      );
    }
  };

  // =====================================
  // CHAT USER
  // =====================================

  const chatUser =
    conversation?.participants?.find(
      (person) =>
        person?._id?.toString() !==
        currentUser?._id?.toString()
    );

  // =====================================
  // AVATAR
  // =====================================

  const avatar =
    chatUser?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      chatUser?.name || "User"
    )}&background=7c3aed&color=fff&size=200`;

  // =====================================
  // LOADING
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

            <p className="mt-4 text-sm text-slate-500">
              Loading chat...
            </p>

          </div>

        </div>

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

      {/* ================= NAVBAR ================= */}

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

        {/* ================= SIDEBAR ================= */}

        <Sidebar />

        {/* ================= CHAT ================= */}

        <main className="min-w-0 flex-1">

          <div
            className="
              flex
              h-[calc(100vh-120px)]
              flex-col
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            {/* ================================= */}
            {/* CHAT HEADER */}
            {/* ================================= */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-slate-200
                px-4
                py-4
                sm:px-6
              "
            >

              {/* AVATAR */}

              <img
                src={avatar}
                alt={
                  chatUser?.name ||
                  "User"
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

              {/* USER INFO */}

              <div className="min-w-0">

                <h2
                  className="
                    truncate
                    text-sm
                    font-extrabold
                    text-slate-900
                    sm:text-base
                  "
                >
                  {chatUser?.name ||
                    "User"}
                </h2>

                <p
                  className="
                    truncate
                    text-xs
                    text-slate-500
                  "
                >
                  @
                  {chatUser?.username ||
                    "username"}
                </p>

              </div>

            </div>

            {/* ================================= */}
            {/* MESSAGES */}
            {/* ================================= */}

            <div
              className="
                flex-1
                space-y-3
                overflow-y-auto
                bg-slate-50
                p-4
                sm:p-6
              "
            >

              {messages.length === 0 ? (

                /* ================= EMPTY CHAT ================= */

                <div
                  className="
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >

                  <div className="text-5xl">
                    💬
                  </div>

                  <h3
                    className="
                      mt-4
                      font-bold
                      text-slate-800
                    "
                  >
                    Start a conversation
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Send your first message.
                  </p>

                </div>

              ) : (

                /* ================= MESSAGE LIST ================= */

                messages.map(
                  (message) => {

                    const senderId =
                      message.sender?._id ||
                      message.sender;

                    const isMine =
                      senderId
                        ?.toString() ===
                      currentUser?._id
                        ?.toString();

                    return (
                      <div
                        key={
                          message._id
                        }
                        className={`flex ${
                          isMine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        <div
                          className="
                            group
                            relative
                            max-w-[80%]
                            sm:max-w-[65%]
                          "
                        >

                          {/* ================= MESSAGE BUBBLE ================= */}

                          <div
                            className={`
                              rounded-2xl
                              px-4
                              py-3
                              text-sm
                              shadow-sm

                              ${
                                isMine
                                  ? "rounded-br-md bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                                  : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                              }

                              ${
                                message.deleted
                                  ? "opacity-70"
                                  : ""
                              }
                            `}
                          >

                            {/* MESSAGE TEXT */}

                            <p
                              className={`
                                break-words
                                ${
                                  message.deleted
                                    ? "italic"
                                    : ""
                                }
                              `}
                            >
                              {message.text}
                            </p>

                            {/* TIME + EDITED */}

                            <div
                              className="
                                mt-1
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <p
                                className={`
                                  text-[10px]

                                  ${
                                    isMine
                                      ? "text-white/70"
                                      : "text-slate-400"
                                  }
                                `}
                              >
                                {message.createdAt
                                  ? new Date(
                                      message.createdAt
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )
                                  : ""}
                              </p>

                              {/* EDITED */}

                              {message.edited &&
                                !message.deleted && (
                                  <span
                                    className={`
                                      text-[10px]

                                      ${
                                        isMine
                                          ? "text-white/70"
                                          : "text-slate-400"
                                      }
                                    `}
                                  >
                                    edited
                                  </span>
                                )}

                            </div>

                          </div>

                          {/* ================================= */}
                          {/* EDIT / DELETE OPTIONS */}
                          {/* ================================= */}

                          {isMine &&
                            !message.deleted && (

                              <div
                                className="
                                  absolute
                                  -top-10
                                  right-0
                                  hidden
                                  items-center
                                  gap-1
                                  rounded-lg
                                  border
                                  border-slate-200
                                  bg-white
                                  p-1
                                  shadow-lg
                                  group-hover:flex
                                "
                              >

                                {/* EDIT */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      message
                                    )
                                  }
                                  className="
                                    rounded-md
                                    px-2
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                    hover:bg-slate-100
                                  "
                                >
                                  ✏️ Edit
                                </button>

                                {/* DELETE */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      message._id
                                    )
                                  }
                                  className="
                                    rounded-md
                                    px-2
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-red-500
                                    hover:bg-red-50
                                  "
                                >
                                  🗑️ Delete
                                </button>

                              </div>

                            )}

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

            {/* ================================= */}
            {/* MESSAGE INPUT */}
            {/* ================================= */}

            <form
              onSubmit={handleSend}
              className="
                flex
                items-center
                gap-2
                border-t
                border-slate-200
                bg-white
                p-3
                sm:p-4
              "
            >

              {/* INPUT */}

              <input
                type="text"
                value={text}
                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }
                placeholder="Write a message..."
                className="
                  h-11
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  text-sm
                  outline-none
                  transition
                  focus:border-purple-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

              {/* SEND */}

              <button
                type="submit"
                disabled={
                  sending ||
                  !text.trim() ||
                  !conversation?._id
                }
                className="
                  h-11
                  shrink-0
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-500
                  px-5
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
                {sending
                  ? "Sending..."
                  : "Send"}
              </button>

            </form>

          </div>

        </main>

      </div>

      {/* ================= MOBILE NAV ================= */}

      <MobileNav />

    </div>
  );
};

export default Chat;
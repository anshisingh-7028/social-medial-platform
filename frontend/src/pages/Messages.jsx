import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

import {
  getMyConversations,
} from "../services/chatApi";

import { useAuth } from "../context/AuthContext";


const Messages = () => {

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const [conversations, setConversations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================
  // LOAD CONVERSATIONS
  // =====================================

  const loadConversations =
    async () => {

      try {

        setLoading(true);

        const data =
          await getMyConversations();


        setConversations(
          data.conversations || []
        );

      } catch (error) {

        console.error(
          "CONVERSATIONS ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadConversations();

  }, []);


  // =====================================
  // GET OTHER USER
  // =====================================

  const getOtherUser =
    (conversation) => {

      return conversation.participants?.find(
        (participant) =>
          participant._id !==
          user?._id
      );

    };


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
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            {/* HEADER */}

            <div
              className="
                border-b
                border-slate-200
                p-5
                sm:p-6
              "
            >

              <h1
                className="
                  text-2xl
                  font-extrabold
                  text-slate-900
                "
              >
                Messages
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Your conversations
              </p>

            </div>


            {/* LIST */}

            {loading ? (

              <div
                className="
                  flex
                  min-h-96
                  items-center
                  justify-center
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

            ) : conversations.length === 0 ? (

              <div
                className="
                  flex
                  min-h-96
                  flex-col
                  items-center
                  justify-center
                  px-6
                  text-center
                "
              >

                <div className="text-6xl">
                  💬
                </div>

                <h2
                  className="
                    mt-4
                    text-lg
                    font-bold
                    text-slate-800
                  "
                >
                  No messages yet
                </h2>

                <p
                  className="
                    mt-2
                    max-w-sm
                    text-sm
                    text-slate-500
                  "
                >
                  Start a conversation
                  with someone from their
                  profile.
                </p>

              </div>

            ) : (

              <div>

                {conversations.map(
                  (conversation) => {

                    const otherUser =
                      getOtherUser(
                        conversation
                      );

                    if (!otherUser) {
                      return null;
                    }


                    return (
                      <button
                        key={
                          conversation._id
                        }
                        type="button"
                        onClick={() =>
                          navigate(
                            `/chat/${otherUser._id}`
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-4
                          border-b
                          border-slate-100
                          p-4
                          text-left
                          transition
                          hover:bg-slate-50
                        "
                      >

                        {/* AVATAR */}

                        <img
                          src={
                            otherUser.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              otherUser.name ||
                                "User"
                            )}&background=7c3aed&color=fff`
                          }
                          alt={
                            otherUser.name
                          }
                          className="
                            h-12
                            w-12
                            flex-shrink-0
                            rounded-full
                            object-cover
                          "
                        />


                        {/* CONTENT */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >

                            <h3
                              className="
                                truncate
                                font-bold
                                text-slate-900
                              "
                            >
                              {otherUser.name}
                            </h3>

                          </div>


                          <p
                            className="
                              mt-1
                              truncate
                              text-sm
                              text-slate-500
                            "
                          >
                            {conversation
                              .lastMessage
                              ?.text ||
                              "Start chatting"}
                          </p>

                        </div>


                        <span className="text-slate-400">
                          ›
                        </span>

                      </button>
                    );

                  }
                )}

              </div>

            )}

          </div>

        </main>

      </div>


      <MobileNav />

    </div>
  );
};


export default Messages;
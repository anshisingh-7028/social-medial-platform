import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import UserSearch from "./UserSearch";
import socket from "../services/socket";

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notificationApi";

const Navbar = () => {

  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  // =====================================
  // NOTIFICATION STATES
  // =====================================

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

    // =====================================
// REAL-TIME NOTIFICATION
// =====================================

useEffect(() => {

  const handleNewNotification =
    (notification) => {

      setNotifications(
        (prev) => [
          notification,
          ...prev,
        ]
      );

    };


  socket.on(
    "newNotification",
    handleNewNotification
  );


  return () => {

    socket.off(
      "newNotification",
      handleNewNotification
    );

  };

}, []);


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  // =====================================
  // AVATAR
  // =====================================

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User"
    )}&background=7c3aed&color=fff`;


  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================

  const loadNotifications = async () => {

    try {

      setLoadingNotifications(true);

      const data =
        await getNotifications();

      setNotifications(
        data.notifications || []
      );

    } catch (error) {

      console.error(
        "NAVBAR NOTIFICATION ERROR:",
        error
      );

    } finally {

      setLoadingNotifications(false);

    }

  };


  // =====================================
  // LOAD WHEN USER LOGIN
  // =====================================

  useEffect(() => {

    if (user) {
      loadNotifications();
    }

  }, [user]);


  // =====================================
  // UNREAD COUNT
  // =====================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


  // =====================================
  // MARK AS READ
  // =====================================

  const handleMarkAsRead =
    async (notificationId) => {

      try {

        await markNotificationAsRead(
          notificationId
        );

        setNotifications(
          (prev) =>
            prev.map(
              (notification) =>
                notification._id ===
                notificationId
                  ? {
                      ...notification,
                      read: true,
                    }
                  : notification
            )
        );

      } catch (error) {

        console.error(
          "MARK READ ERROR:",
          error
        );

      }

    };


  // =====================================
  // DELETE NOTIFICATION
  // =====================================

  const handleDelete =
    async (
      notificationId
    ) => {

      try {

        await deleteNotification(
          notificationId
        );

        setNotifications(
          (prev) =>
            prev.filter(
              (notification) =>
                notification._id !==
                notificationId
            )
        );

      } catch (error) {

        console.error(
          "DELETE NOTIFICATION ERROR:",
          error
        );

      }

    };


  // =====================================
  // NOTIFICATION MESSAGE
  // =====================================

  const getNotificationMessage =
    (notification) => {

      const sender =
        notification.sender?.name ||
        notification.sender?.username ||
        "Someone";


      if (
        notification.type ===
        "like"
      ) {

        return (
          <>
            <span className="font-bold">
              {sender}
            </span>{" "}
            liked your post ❤️
          </>
        );

      }


      if (
        notification.type ===
        "comment"
      ) {

        return (
          <>
            <span className="font-bold">
              {sender}
            </span>{" "}
            commented on your post 💬
          </>
        );

      }


      if (
        notification.type ===
        "follow"
      ) {

        return (
          <>
            <span className="font-bold">
              {sender}
            </span>{" "}
            started following you 👤
          </>
        );

      }


      return (
        <>
          <span className="font-bold">
            {sender}
          </span>{" "}
          sent you a notification
        </>
      );

    };


  // =====================================
  // RETURN
  // =====================================

  return (

    <nav
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-200
        bg-white/90
        backdrop-blur-xl
      "
    >

      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
        "
      >

        {/* ================================= */}
        {/* LOGO */}
        {/* ================================= */}

        <Link
          to="/"
          className="
            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-purple-600
              to-pink-500
              text-xl
              font-extrabold
              text-white
              shadow-lg
            "
          >
            S
          </div>

          <span
            className="
              hidden
              text-xl
              font-extrabold
              text-slate-900
              sm:block
            "
          >
            Socially
          </span>

        </Link>


        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}

        <div
          className="
            hidden
            w-full
            max-w-md
            md:block
          "
        >

          <UserSearch />

        </div>


        {/* ================================= */}
        {/* RIGHT */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

            {/* Messages */}

<button
  type="button"
  onClick={() => navigate("/messages")}
  className="
    relative
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    text-lg
    transition
    hover:bg-slate-100
  "
  title="Messages"
>
  💬
</button>

          {/* ================================= */}
          {/* NOTIFICATION */}
          {/* ================================= */}

          <div
            className="
              relative
              hidden
              sm:block
            "
          >

            <button
              type="button"
              onClick={() =>
                setShowNotifications(
                  (prev) => !prev
                )
              }
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-xl
                transition
                hover:bg-slate-100
              "
            >

              🔔


              {/* UNREAD BADGE */}

              {unreadCount > 0 && (

                <span
                  className="
                    absolute
                    -right-0.5
                    -top-0.5
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    ring-2
                    ring-white
                  "
                >

                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}

                </span>

              )}

            </button>

            {/* Messages */}




            {/* ================================= */}
            {/* DROPDOWN */}
            {/* ================================= */}

            {showNotifications && (

              <div
                className="
                  absolute
                  right-0
                  top-12
                  z-[100]
                  w-[350px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-2xl
                "
              >

                {/* HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-4
                    py-4
                  "
                >

                  <div>

                    <h3
                      className="
                        text-base
                        font-extrabold
                        text-slate-900
                      "
                    >
                      Notifications
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                      "
                    >
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "You're all caught up"}
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(
                        false
                      );
                      navigate(
                        "/notifications"
                      );
                    }}
                    className="
                      text-xs
                      font-bold
                      text-purple-600
                      hover:text-purple-700
                    "
                  >
                    View all
                  </button>

                </div>


                {/* CONTENT */}

                <div
                  className="
                    max-h-[380px]
                    overflow-y-auto
                  "
                >

                  {loadingNotifications ? (

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        px-4
                        py-10
                      "
                    >

                      <div
                        className="
                          h-7
                          w-7
                          animate-spin
                          rounded-full
                          border-4
                          border-purple-200
                          border-t-purple-600
                        "
                      />

                    </div>

                  ) : notifications.length === 0 ? (

                    <div
                      className="
                        px-5
                        py-10
                        text-center
                      "
                    >

                      <div
                        className="
                          text-4xl
                        "
                      >
                        🔔
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-bold
                          text-slate-700
                        "
                      >
                        No notifications
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-400
                        "
                      >
                        You're all caught up!
                      </p>

                    </div>

                  ) : (

                    notifications
                      .slice(0, 8)
                      .map(
                        (
                          notification
                        ) => (

                          <div
                            key={
                              notification._id
                            }
                            className={`
                              group
                              flex
                              gap-3
                              border-b
                              border-slate-100
                              px-4
                              py-3
                              transition
                              hover:bg-slate-50
                              ${
                                !notification.read
                                  ? "bg-purple-50/50"
                                  : ""
                              }
                            `}
                          >

                            {/* AVATAR */}

                            <img
                              src={
                                notification
                                  .sender
                                  ?.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  notification
                                    .sender
                                    ?.name ||
                                    "User"
                                )}&background=7c3aed&color=fff`
                              }
                              alt="sender"
                              className="
                                h-10
                                w-10
                                shrink-0
                                rounded-full
                                object-cover
                              "
                            />


                            {/* MESSAGE */}

                            <button
                              type="button"
                              onClick={() =>
                                !notification.read &&
                                handleMarkAsRead(
                                  notification._id
                                )
                              }
                              className="
                                min-w-0
                                flex-1
                                text-left
                              "
                            >

                              <p
                                className="
                                  text-sm
                                  leading-5
                                  text-slate-700
                                "
                              >
                                {getNotificationMessage(
                                  notification
                                )}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[11px]
                                  text-slate-400
                                "
                              >
                                {notification.createdAt
                                  ? new Date(
                                      notification.createdAt
                                    ).toLocaleString()
                                  : "Recently"}
                              </p>

                            </button>


                            {/* UNREAD DOT */}

                            {!notification.read && (

                              <span
                                className="
                                  mt-2
                                  h-2
                                  w-2
                                  shrink-0
                                  rounded-full
                                  bg-purple-600
                                "
                              />

                            )}


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  notification._id
                                )
                              }
                              className="
                                hidden
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                                group-hover:flex
                              "
                              title="Delete notification"
                            >
                              🗑️
                            </button>

                          </div>

                        )
                      )

                  )}

                </div>


                {/* FOOTER */}

                {notifications.length > 0 && (

                  <div
                    className="
                      border-t
                      border-slate-100
                      p-3
                    "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifications(
                          false
                        );
                        navigate(
                          "/notifications"
                        );
                      }}
                      className="
                        w-full
                        rounded-xl
                        bg-slate-50
                        py-2.5
                        text-sm
                        font-bold
                        text-purple-600
                        transition
                        hover:bg-purple-50
                      "
                    >
                      View all notifications
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>


          {/* ================================= */}
          {/* PROFILE */}
          {/* ================================= */}

          <Link
            to="/profile"
            className="
              flex
              items-center
              gap-2
              rounded-full
              p-1
              hover:bg-slate-100
            "
          >

            <img
              src={avatar}
              alt="profile"
              className="
                h-9
                w-9
                rounded-full
                object-cover
                ring-2
                ring-purple-100
              "
            />

            <span
              className="
                hidden
                text-sm
                font-semibold
                text-slate-700
                lg:block
              "
            >
              {user?.name}
            </span>

          </Link>


          {/* ================================= */}
          {/* LOGOUT */}
          {/* ================================= */}

          <button
            onClick={handleLogout}
            className="
              hidden
              rounded-lg
              px-3
              py-2
              text-sm
              font-semibold
              text-red-500
              hover:bg-red-50
              sm:block
            "
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;
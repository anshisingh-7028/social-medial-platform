import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationApi";


const Notifications = () => {

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);


  // =====================================
  // LOAD NOTIFICATIONS
  // =====================================

  const loadNotifications =
    async () => {

      try {

        setLoading(true);

        const data =
          await getNotifications();

        setNotifications(
          data.notifications || []
        );

      } catch (error) {

        console.error(
          "NOTIFICATIONS ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadNotifications();

  }, []);


  // =====================================
  // MARK ONE READ
  // =====================================

  const handleNotificationClick =
    async (notification) => {

      if (notification.read) {
        return;
      }

      try {

        await markNotificationAsRead(
          notification._id
        );

        setNotifications(
          (prev) =>
            prev.map((item) =>
              item._id ===
              notification._id
                ? {
                    ...item,
                    read: true,
                  }
                : item
            )
        );

      } catch (error) {

        console.error(
          "MARK READ ERROR:",
          error
        );

      }
    };

    const handleDeleteNotification =
  async (notificationId) => {

    try {

      await deleteNotification(
        notificationId
      );

      setNotifications(
        (prev) =>
          prev.filter(
            (item) =>
              item._id !== notificationId
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
  // MARK ALL READ
  // =====================================

  const handleMarkAllRead =
    async () => {

      try {

        await markAllNotificationsAsRead();

        setNotifications(
          (prev) =>
            prev.map((item) => ({
              ...item,
              read: true,
            }))
        );

      } catch (error) {

        console.error(
          "MARK ALL READ ERROR:",
          error
        );

      }
    };


  // =====================================
  // NOTIFICATION TEXT
  // =====================================

  const getNotificationText =
    (notification) => {

      const name =
        notification.sender?.name ||
        notification.sender?.username ||
        "Someone";


      if (
        notification.type ===
        "like"
      ) {
        return (
          <>
            <strong>{name}</strong>{" "}
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
            <strong>{name}</strong>{" "}
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
            <strong>{name}</strong>{" "}
            started following you 👤
          </>
        );
      }


      return (
        <>
          <strong>{name}</strong>{" "}
          interacted with you
        </>
      );
    };


  // =====================================
  // ICON
  // =====================================

  const getIcon = (type) => {

    if (type === "like") {
      return "❤️";
    }

    if (type === "comment") {
      return "💬";
    }

    if (type === "follow") {
      return "👤";
    }

    return "🔔";
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


        <main
          className="
            min-w-0
            flex-1
          "
        >

          {/* HEADER */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-7
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <h1
                  className="
                    text-2xl
                    font-extrabold
                    text-slate-900
                  "
                >
                  Notifications 🔔
                </h1>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Stay updated with your
                  social activity.
                </p>

              </div>


              {notifications.some(
                (item) =>
                  !item.read
              ) && (

                <button
                  onClick={
                    handleMarkAllRead
                  }
                  className="
                    rounded-xl
                    bg-purple-600
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-purple-700
                  "
                >
                  Mark all as read
                </button>

              )}

            </div>


            {/* CONTENT */}

            <div className="mt-6">

              {loading ? (

                <div
                  className="
                    flex
                    min-h-60
                    flex-col
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

                  <p
                    className="
                      mt-3
                      text-sm
                      text-slate-500
                    "
                  >
                    Loading notifications...
                  </p>

                </div>

              ) : notifications.length ===
                0 ? (

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
                    🔔
                  </div>

                  <h3
                    className="
                      mt-4
                      font-bold
                      text-slate-800
                    "
                  >
                    No notifications
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    You're all caught up!
                  </p>

                </div>

              ) : (

                <div
                  className="
                    divide-y
                    divide-slate-100
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-100
                  "
                >

                  {notifications.map(
                    (notification) => (

                      <div
                        key={
                          notification._id
                        }
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`
                          flex
                          cursor-pointer
                          items-start
                          gap-3
                          p-4
                          transition
                          hover:bg-slate-50
                          sm:gap-4
                          sm:p-5
                          ${
                            !notification.read
                              ? "bg-purple-50/60"
                              : "bg-white"
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
                          alt=""
                          className="
                            h-11
                            w-11
                            shrink-0
                            rounded-full
                            object-cover
                          "
                        />


                        {/* ICON */}

                        <div
                          className="
                            -ml-7
                            mt-7
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-xs
                            shadow
                          "
                        >
                          {getIcon(
                            notification.type
                          )}
                        </div>


                        {/* TEXT */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              text-sm
                              leading-6
                              text-slate-700
                            "
                          >
                            {getNotificationText(
                              notification
                            )}
                          </p>


                          {notification.type ===
                            "comment" &&
                            notification.comment && (

                            <p
                              className="
                                mt-1
                                truncate
                                text-xs
                                text-slate-500
                              "
                            >
                              "{notification.comment}"
                            </p>

                          )}


                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                        <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();

    handleDeleteNotification(
      notification._id
    );
  }}
  className="
    flex
    h-9
    w-9
    shrink-0
    items-center
    justify-center
    rounded-full
    text-slate-400
    transition
    hover:bg-red-50
    hover:text-red-500
  "
  title="Delete notification"
>
  🗑️
</button>


                        {/* UNREAD DOT */}

                        {!notification.read && (

                          <span
                            className="
                              mt-2
                              h-2.5
                              w-2.5
                              shrink-0
                              rounded-full
                              bg-purple-600
                            "
                          />

                        )}

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </main>

      </div>


      <MobileNav />

    </div>
  );
};


export default Notifications;
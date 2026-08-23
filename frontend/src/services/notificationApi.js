import axios from "axios";

const API_URL =
  "http://localhost:5000/api";


// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/notifications`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };


// ==========================================
// MARK ONE AS READ
// ==========================================

export const markNotificationAsRead =
  async (notificationId) => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };


// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

  export const deleteNotification =
  async (notificationId) => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
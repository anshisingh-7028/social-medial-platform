import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/notifications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ==========================================
// MARK ONE AS READ
// ==========================================

export const markNotificationAsRead = async (
  notificationId
) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/api/notifications/read-all`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification = async (
  notificationId
) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/api/notifications/${notificationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
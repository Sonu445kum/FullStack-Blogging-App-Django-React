import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationSocket = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const reconnectInterval = useRef(null);

  // ✅ WebSocket Connection Setup
  useEffect(() => {
    if (!userId) return;

    const connectSocket = () => {
      socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${userId}/`);

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
        if (reconnectInterval.current) clearInterval(reconnectInterval.current);
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.data) {
            setNotifications((prev) => [data.data, ...prev.slice(0, 9)]); // keep max 10
          }
        } catch (err) {
          console.error("❌ Invalid WebSocket data:", err);
        }
      };

      socketRef.current.onclose = () => {
        console.log("⚠️ WebSocket closed, retrying...");
        reconnectInterval.current = setTimeout(connectSocket, 3000); // retry after 3s
      };

      socketRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        socketRef.current.close();
      };
    };

    connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (reconnectInterval.current) clearTimeout(reconnectInterval.current);
    };
  }, [userId]);

  // ✅ Optional: Play sound when new notification arrives
  useEffect(() => {
    if (notifications.length > 0) {
      const audio = new Audio("/notification.mp3"); // add a notification.mp3 in /public
      audio.play().catch(() => {}); // ignore autoplay errors
    }
  }, [notifications.length]);

  return (
    <div className="fixed top-5 right-5 z-50 w-80 sm:w-96">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-4 max-h-[400px] overflow-y-auto">
        <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
          🔔 Notifications
        </h3>

        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.p
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 text-sm"
            >
              No notifications yet
            </motion.p>
          ) : (
            notifications.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md"
              >
                <p className="font-semibold text-purple-700">{n.title}</p>
                <p className="text-sm text-gray-700">{n.message}</p>
                {n.blog_id && (
                  <p className="text-xs text-gray-400 mt-1">Blog ID: {n.blog_id}</p>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationSocket;

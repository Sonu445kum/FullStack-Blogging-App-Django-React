import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);
  const dropdownRef = useRef(null);
  const reconnectTimeout = useRef(null);

  // ✅ Connect WebSocket
  useEffect(() => {
    if (!userId) return;

    const connectSocket = () => {
      socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${userId}/`);

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.data) {
            setNotifications((prev) => [data.data, ...prev.slice(0, 9)]);

            // Optional sound
            const audio = new Audio("/notification.mp3");
            audio.play().catch(() => {});
          }
        } catch (err) {
          console.error("❌ WebSocket parse error:", err);
        }
      };

      socketRef.current.onclose = () => {
        console.log("⚠️ WebSocket closed, reconnecting...");
        reconnectTimeout.current = setTimeout(connectSocket, 3000);
      };

      socketRef.current.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        socketRef.current.close();
      };
    };

    connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [userId]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Icon */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative focus:outline-none"
      >
        <Bell className="w-6 h-6 text-gray-700 hover:text-purple-600 transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🔽 Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-lg">🔔 Notifications</h3>
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-purple-600 hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="font-semibold text-purple-700">{n.title}</p>
                    <p className="text-sm text-gray-700">{n.message}</p>
                    {n.blog_id && (
                      <p className="text-xs text-gray-400 mt-1">Blog ID: {n.blog_id}</p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;

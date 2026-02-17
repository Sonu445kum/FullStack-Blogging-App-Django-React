



// Add the Paginations
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAdminNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteAdminNotificationMutation,
} from "../../api/apiSlice";
import { Loader2, CheckCircle, Trash2, Bell, RotateCcw } from "lucide-react";
import Paginations from "../../components/Paginations"; // ✅ Pagination Component

const NotificationsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch notifications with pagination
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useGetAdminNotificationsQuery({ page: currentPage });

  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotification] = useDeleteAdminNotificationMutation();
  const [loadingId, setLoadingId] = useState(null);

  // ✅ Extract results and pagination info
  const notifications = notificationsData?.results || [];
  const totalPages = notificationsData?.total_pages || 1;

  const handleMarkRead = async (id) => {
    try {
      setLoadingId(id);
      await markRead(id).unwrap();
      toast.success("✅ Notification marked as read");
      refetch();
    } catch {
      toast.error("❌ Failed to mark as read");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteNotification(id).unwrap();
      toast.success("🗑️ Notification deleted");
      refetch();
    } catch {
      toast.error("❌ Failed to delete notification");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    refetch();
    toast.info("🔄 Notifications refreshed");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 font-semibold">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading notifications...
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center mt-20 font-medium">
        Failed to fetch notifications.
      </div>
    );

  if (!notifications.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Bell className="w-10 h-10 mb-2 text-gray-400" />
        <p>No notifications found.</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🔔 Notifications Management
        </h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RotateCcw className="w-5 h-5" /> Refresh
        </button>
      </div>

      {/* ✅ Table Section */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map((note) => (
              <tr
                key={note.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{note.id}</td>
                <td className="py-3 px-4">{note.message}</td>
                <td className="py-3 px-4">{note.user?.username || "—"}</td>
                <td className="py-3 px-4">
                  {note.is_read ? (
                    <span className="text-green-600 font-semibold">Read</span>
                  ) : (
                    <span className="text-orange-600 font-semibold">Unread</span>
                  )}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {!note.is_read && (
                    <button
                      onClick={() => handleMarkRead(note.id)}
                      disabled={loadingId === note.id}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition disabled:opacity-50"
                    >
                      {loadingId === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={loadingId === note.id}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition disabled:opacity-50"
                  >
                    {loadingId === note.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="mt-6 flex justify-center">
        <Paginations
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default NotificationsManagement;

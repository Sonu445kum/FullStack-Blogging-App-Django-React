import React, { useState } from "react";
import { toast } from "react-toastify";

const DeleteUserModal = ({ close, users, deleteUser, refetch }) => {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(selectedUserId).unwrap();
      toast.success("User deleted successfully");
      refetch();
      close();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Delete User</h2>

        <select
          className="border rounded px-3 py-2 w-full mb-3"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={close}>
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;

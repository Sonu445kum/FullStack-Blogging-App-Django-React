import React, { useState } from "react";
import { toast } from "react-toastify";

const UpdateUserRoleModal = ({ close, users, updateUserRole, refetch }) => {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || null);
  const [role, setRole] = useState(users[0]?.role || "Reader");

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = users.find((u) => u.id === userId);
    setRole(user.role);
  };

  const handleUpdateRole = async () => {
    try {
      await updateUserRole({ userId: selectedUserId, role }).unwrap();
      toast.success("Role updated successfully");
      refetch();
      close();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update User Role</h2>

        <select
          className="border rounded px-3 py-2 w-full mb-3"
          value={selectedUserId}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.role})
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 w-full mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Author">Author</option>
          <option value="Reader">Reader</option>
        </select>

        <div className="flex justify-end gap-3">
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={close}>
            Cancel
          </button>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600" onClick={handleUpdateRole}>
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;

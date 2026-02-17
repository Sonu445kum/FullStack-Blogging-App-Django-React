import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAddUserMutation, useGetUsersQuery } from "../../../api/apiSlice";

const AddUserModal = ({ close }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "admin", // default value
  });

  const { refetch } = useGetUsersQuery();
  const [addUser, { isLoading }] = useAddUserMutation();

  const handleAddUser = async () => {
    const { username, email, role } = formData;
    if (!username || !email || !role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addUser({ username, email, role }).unwrap();
      toast.success("User added successfully ✅");
      refetch();
      close();
    } catch (err) {
      toast.error(err?.data?.role ? err.data.role[0] : "Failed to add user ❌");
    }
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Add New User</h2>

        <input
          type="text"
          placeholder="Username"
          className="border rounded px-3 py-2 w-full mb-3"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2 w-full mb-3"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <select
          value={formData.role}
          className="border rounded px-3 py-2 w-full mb-3"
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="author">Author</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleAddUser}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;

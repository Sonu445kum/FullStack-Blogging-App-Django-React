// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useUpdateUserMutation } from "../../../api/apiSlice";

// const EditUserModal = ({ close, selectedUser, refetch }) => {
//   const [formData, setFormData] = useState({ username: "", email: "", role: "" });
//   const [updateUser] = useUpdateUserMutation();

//   useEffect(() => {
//     if (selectedUser) {
//       setFormData({
//         username: selectedUser.username,
//         email: selectedUser.email,
//         role: selectedUser.role,
//       });
//     }
//   }, [selectedUser]);

//   const handleUpdate = async () => {
//     if (!formData.username || !formData.email || !formData.role) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       await updateUser({ userId: selectedUser.id, data: formData }).unwrap();
//       toast.success("User updated successfully ✅");
//       refetch();
//       close();
//     } catch {
//       toast.error("Failed to update user ❌");
//     }
//   };

//   return (
//     <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
//       <div className="bg-white p-6 rounded-xl w-96 shadow-lg border border-gray-300">
//         <h2 className="text-2xl font-bold mb-4">Edit User</h2>

//         <input
//           type="text"
//           placeholder="Username"
//           className="border rounded px-3 py-2 w-full mb-3"
//           value={formData.username}
//           onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="border rounded px-3 py-2 w-full mb-3"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />

//         <select
//           value={formData.role}
//           className="border rounded px-3 py-2 w-full mb-3"
//           onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//         >
//           <option value="Admin">Admin</option>
//           <option value="Editor">Editor</option>
//           <option value="Author">Author</option>
//           <option value="Reader">Reader</option>
//         </select>

//         <div className="flex justify-end gap-3">
//           <button
//             className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//             onClick={close}
//           >
//             Cancel
//           </button>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             onClick={handleUpdate}
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditUserModal;

// new logic her
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../../../api/apiSlice";

const EditUserModal = ({ close, selectedUser, refetch }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "admin",
  });

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role.toLowerCase(), // lowercase to match backend
      });
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    const { username, email, role } = formData;
    if (!username || !email || !role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await updateUser({
        userId: selectedUser.id,
        data: { username, email, role },
      }).unwrap();

      toast.success("User updated successfully ✅");
      refetch();
      close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user ❌");
    }
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>

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
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
        >
          {/* Backend allowed roles */}
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="author">Author</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={close}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
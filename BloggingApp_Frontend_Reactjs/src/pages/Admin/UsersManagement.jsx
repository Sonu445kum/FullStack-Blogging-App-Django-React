
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   useGetUsersQuery,
//   useDeleteUserMutation,
//   useUpdateUserRoleMutation,
// } from "../../api/apiSlice";
// import EditUserModal from "./Users/EditUserModal";
// import AddUserModal from "./Users/AddUserModal";

// const UsersManagement = () => {
//   const { data, isLoading, refetch } = useGetUsersQuery();
//   const users = data || [];
//   const [deleteUser] = useDeleteUserMutation();
//   const [updateUserRole] = useUpdateUserRoleMutation();
//   const [loadingUserId, setLoadingUserId] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
//         Loading users...
//       </div>
//     );

//   // 🧹 Delete user
//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await deleteUser(userId).unwrap();
//       toast.success("User deleted successfully ✅");
//       refetch();
//     } catch (error) {
//       toast.error("Failed to delete user ❌");
//     }
//   };

//   // 🔁 Change user role
//   const handleRoleChange = async (userId, newRole) => {
//     try {
//       setLoadingUserId(userId);
//       await updateUserRole({ userId, role: newRole }).unwrap();
//       toast.success("Role updated successfully ✅");
//       refetch();
//     } catch (err) {
//       console.error("Error updating role:", err);
//       toast.error("Failed to update role ❌");
//     } finally {
//       setLoadingUserId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200 relative">
//       <h1 className="text-4xl font-bold mb-6 text-gray-800">
//         Users Management
//       </h1>

//       <div className="flex gap-4 mb-6">
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//           onClick={() => setShowAddModal(true)}
//         >
//           ➕ Add User
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
//           <thead className="bg-indigo-500 text-white">
//             <tr>
//               <th className="py-3 px-6 text-left">ID</th>
//               <th className="py-3 px-6 text-left">Username</th>
//               <th className="py-3 px-6 text-left">Email</th>
//               <th className="py-3 px-6 text-left">Role</th>
//               <th className="py-3 px-6 text-left">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user) => (
//               <tr
//                 key={user.id}
//                 className="border-b hover:bg-gray-50 transition-colors duration-200"
//               >
//                 <td className="py-3 px-6 font-medium text-gray-700">{user.id}</td>
//                 <td className="py-3 px-6 font-medium text-gray-800">{user.username}</td>
//                 <td className="py-3 px-6 text-gray-600">{user.email}</td>

//                 {/* ✅ Show current role */}
//                 <td className="py-3 px-6 font-semibold text-gray-700 capitalize">
//                   {user.role}
//                 </td>

//                 {/* ✅ Actions column */}
//                 <td className="py-3 px-6">
//                   <div className="flex flex-col gap-3">
//                     {/* Dropdown for changing role */}
//                     <select
//                       className={`border rounded px-3 py-1 ${
//                         loadingUserId === user.id
//                           ? "bg-gray-200 cursor-not-allowed"
//                           : "bg-white"
//                       } transition-colors duration-200`}
//                       value={user.role}
//                       onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                       disabled={loadingUserId === user.id}
//                     >
//                       <option value="Admin">Admin</option>
//                       <option value="Author">Author</option>
//                       <option value="Reader">Reader</option>
//                     </select>

//                     {/* Edit + Delete buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
//                         onClick={() => setSelectedUser(user)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                         onClick={() => handleDelete(user.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* 🧩 Edit User Modal */}
//       {selectedUser && (
//         <EditUserModal
//           close={() => setSelectedUser(null)}
//           selectedUser={selectedUser}
//           refetch={refetch}
//         />
//       )}

//       {/* ➕ Add User Modal */}
//       {showAddModal && <AddUserModal close={() => setShowAddModal(false)} />}
//     </div>
//   );
// };

// export default UsersManagement;



import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../../api/apiSlice";
import EditUserModal from "./Users/EditUserModal";
import AddUserModal from "./Users/AddUserModal";
import Paginations from "../../components/Paginations"; // ✅ Added import

const UsersManagement = () => {
  const { data, isLoading, refetch } = useGetUsersQuery();
  const users = data || [];

  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // har page pe 5 users dikhne chahiye

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading users...
      </div>
    );

  // ✅ Pagination logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // 🧹 Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully ✅");
      refetch();
    } catch (error) {
      toast.error("Failed to delete user ❌");
    }
  };

  // 🔁 Change user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoadingUserId(userId);
      await updateUserRole({ userId, role: newRole }).unwrap();
      toast.success("Role updated successfully ✅");
      refetch();
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Failed to update role ❌");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200 relative">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Users Management
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 font-medium text-gray-700">
                  {user.id}
                </td>
                <td className="py-3 px-6 font-medium text-gray-800">
                  {user.username}
                </td>
                <td className="py-3 px-6 text-gray-600">{user.email}</td>

                {/* ✅ Show current role */}
                <td className="py-3 px-6 font-semibold text-gray-700 capitalize">
                  {user.role}
                </td>

                {/* ✅ Actions column */}
                <td className="py-3 px-6">
                  <div className="flex flex-col gap-3">
                    {/* Dropdown for changing role */}
                    <select
                      className={`border rounded px-3 py-1 ${
                        loadingUserId === user.id
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-white"
                      } transition-colors duration-200`}
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      disabled={loadingUserId === user.id}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Author">Author</option>
                    </select>

                    {/* Edit + Delete buttons */}
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => setSelectedUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination added here */}
      <Paginations
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 🧩 Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          close={() => setSelectedUser(null)}
          selectedUser={selectedUser}
          refetch={refetch}
        />
      )}

      {/* ➕ Add User Modal */}
      {showAddModal && <AddUserModal close={() => setShowAddModal(false)} />}
    </div>
  );
};

export default UsersManagement;








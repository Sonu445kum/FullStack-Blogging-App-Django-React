// // src/pages/Admin/CategoriesManagement.jsx
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   useGetCategoriesQuery,
//   useCreateCategoryMutation,
//   useDeleteCategoryMutation,
// } from "../../api/apiSlice";

// const CategoriesManagement = () => {
//   // Fetch categories (transformed to always be an array)
//   const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery();
//   const [createCategory] = useCreateCategoryMutation();
//   const [deleteCategory] = useDeleteCategoryMutation();

//   const [newCategory, setNewCategory] = useState("");
//   const [adding, setAdding] = useState(false);
//   const [loadingId, setLoadingId] = useState(null);

//   // Add category handler
//   const handleAdd = async () => {
//     if (!newCategory.trim()) return toast.error("Category name required");

//     try {
//       setAdding(true);
//       await createCategory({ name: newCategory }).unwrap();
//       toast.success("Category added successfully");
//       setNewCategory("");
//       refetch();
//     } catch {
//       toast.error("Failed to add category");
//     } finally {
//       setAdding(false);
//     }
//   };

//   // Delete category handler
//   const handleDelete = async (id) => {
//     try {
//       setLoadingId(id);
//       await deleteCategory(id).unwrap();
//       toast.success("Category deleted successfully");
//       refetch();
//     } catch {
//       toast.error("Failed to delete category");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   if (isLoading) return <p className="text-gray-500">Loading categories...</p>;
//   if (isError) return <p className="text-red-500">Failed to load categories</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Categories Management</h1>

//       {/* Add Category */}
//       <div className="flex gap-3 mb-6">
//         <input
//           type="text"
//           className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//           placeholder="New category name"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//         />
//         <button
//           onClick={handleAdd}
//           disabled={adding}
//           className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition ${
//             adding ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {adding ? "Adding..." : "Add"}
//         </button>
//       </div>

//       {/* Categories Table */}
//       <div className="overflow-x-auto shadow rounded-lg bg-white">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">ID</th>
//               <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Name</th>
//               <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {categories.map((cat) => (
//               <tr key={cat.id} className="hover:bg-gray-50 transition">
//                 <td className="py-3 px-6">{cat.id}</td>
//                 <td className="py-3 px-6">{cat.name}</td>
//                 <td className="py-3 px-6">
//                   <button
//                     onClick={() => handleDelete(cat.id)}
//                     disabled={loadingId === cat.id}
//                     className={`px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50`}
//                   >
//                     {loadingId === cat.id ? "Deleting..." : "Delete"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {categories.length === 0 && (
//               <tr>
//                 <td colSpan={3} className="py-4 text-center text-gray-500">
//                   No categories found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CategoriesManagement;

// new logic here bro 
// src/pages/Admin/CategoriesManagement.jsx
import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateDeleteCategoryMutation,
  useDeleteCategoryMutation,
} from "../../api/apiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";


const CategoriesManagement = () => {
  const { data: categories = [], isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateDeleteCategory] = useUpdateDeleteCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 10 default category options
  const defaultOptions = [
    "Technology",
    "Business",
    "Health",
    "Education",
    "Sports",
    "Entertainment",
    "Travel",
    "Food",
    "Lifestyle",
    "Science",
  ];

  // ------------------------
  // CREATE / UPDATE CATEGORY
  // ------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return toast.error("Category name required!");

    try {
      if (selectedCategory) {
        // Update category
        await updateDeleteCategory({
          id: selectedCategory.id,
          data: { name: categoryName },
          method: "PUT",
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        await createCategory({ name: categoryName }).unwrap();
        toast.success("Category added successfully!");
      }
      setCategoryName("");
      setSelectedCategory(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  // ------------------------
  // DELETE CATEGORY
  // ------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete category!");
    }
  };

  // ------------------------
  // EDIT CATEGORY
  // ------------------------
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">🗂️ Categories Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <PlusCircle size={20} />
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
          >
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Select or Enter Category Name
              </label>

              {/* Dropdown with default options */}
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="">-- Select from popular categories --</option>
                {defaultOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Or manually type */}
              <input
                type="text"
                placeholder="Or type new category name..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                {selectedCategory ? "Update Category" : "Create Category"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedCategory(null);
                  setCategoryName("");
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        {isLoading ? (
          <p className="p-4 text-gray-600">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-gray-600">No categories found.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Category Name</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{category.name}</td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;



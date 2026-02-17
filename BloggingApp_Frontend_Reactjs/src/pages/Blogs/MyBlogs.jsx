// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   useGetMyBlogsQuery,
//   useUpdateMyBlogMutation,
//   useDeleteMyBlogMutation,
// } from "../../api/apiSlice";

// const MyBlogs = () => {
//   const token = localStorage.getItem("token");

//   // 🟢 Fetch My Blogs
//   const {
//     data: blogs = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useGetMyBlogsQuery(token);

//   const [updateBlog] = useUpdateMyBlogMutation();
//   const [deleteBlog] = useDeleteMyBlogMutation();

//   const [editingBlog, setEditingBlog] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     category: "",
//     tags: "",
//     image: null,
//     is_published: false,
//   });
//   const [previewImage, setPreviewImage] = useState(null);

//   // 🟣 Category Dropdown Options
//   const categoryOptions = [
//     "Technology",
//     "Health",
//     "Travel",
//     "Education",
//     "Food",
//     "Finance",
//     "Fashion",
//     "Sports",
//     "Lifestyle",
//     "Entertainment",
//   ];

//   // 🟢 Handle Edit Click
//   const handleEditClick = (blog) => {
//     setEditingBlog(blog.id);
//     setFormData({
//       title: blog.title || "",
//       content: blog.content || "",
//       category: blog.category?.name || "", // handle category
//       tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
//       image: null,
//       is_published: blog.status === "published",
//     });
//     setPreviewImage(blog.featured_image || null);
//   };

//   // 🟡 Handle Input Change
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "checkbox") {
//       setFormData({ ...formData, [name]: checked });
//     } else if (type === "file") {
//       const file = files[0];
//       setFormData({ ...formData, image: file });
//       setPreviewImage(file ? URL.createObjectURL(file) : null);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // 🟢 Handle Update Blog
//   const handleUpdate = async (blogId) => {
//     try {
//       const form = new FormData();
//       form.append("title", formData.title);
//       form.append("content", formData.content);

//       // ✅ Pass category name correctly
//       if (formData.category) {
//         form.append("category_name", formData.category);
//       }

//       form.append("tags", formData.tags);
//       form.append("status", formData.is_published ? "published" : "draft");

//       if (formData.image) {
//         form.append("featured_image", formData.image);
//       }

//       await updateBlog({ id: blogId, data: form, token }).unwrap();

//       toast.success("✅ Blog updated successfully!");
//       setEditingBlog(null);
//       setFormData({
//         title: "",
//         content: "",
//         category: "",
//         tags: "",
//         image: null,
//         is_published: false,
//       });
//       setPreviewImage(null);
//       refetch();
//     } catch (error) {
//       console.error("Update Error:", error);
//       toast.error("❌ Failed to update blog");
//     }
//   };

//   // 🔴 Handle Delete
//   const handleDelete = async (blogId) => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await deleteBlog({ id: blogId, token }).unwrap();
//       toast.success("🗑️ Blog deleted successfully!");
//       refetch();
//     } catch (error) {
//       toast.error("❌ Failed to delete blog");
//     }
//   };

//   // 🔙 Cancel Edit
//   const handleCancel = () => {
//     setEditingBlog(null);
//     setFormData({
//       title: "",
//       content: "",
//       category: "",
//       tags: "",
//       image: null,
//       is_published: false,
//     });
//     setPreviewImage(null);
//   };

//   if (isLoading)
//     return <div className="text-center text-gray-500 py-10">Loading your blogs...</div>;

//   if (isError)
//     return <div className="text-center text-red-500 py-10">Failed to fetch blogs 😢</div>;

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
//         📝 My Blogs ({blogs.length})
//       </h1>

//       {blogs.length === 0 ? (
//         <div className="text-gray-400 text-center">
//           You haven't created any blogs yet.
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           <AnimatePresence>
//             {blogs.map((blog) => (
//               <motion.div
//                 key={blog.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="p-5 rounded-xl bg-gray-800 shadow-md border border-gray-700"
//               >
//                 {editingBlog === blog.id ? (
//                   <div className="space-y-3">
//                     {/* Title */}
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleChange}
//                       className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
//                       placeholder="Blog Title"
//                       required
//                     />

//                     {/* Content */}
//                     <textarea
//                       name="content"
//                       value={formData.content}
//                       onChange={handleChange}
//                       rows="4"
//                       className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
//                       placeholder="Blog Content"
//                       required
//                     ></textarea>

//                     {/* Category Dropdown */}
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleChange}
//                       className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
//                     >
//                       <option value="">Select Category</option>
//                       {categoryOptions.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>

//                     {/* Tags */}
//                     <input
//                       type="text"
//                       name="tags"
//                       value={formData.tags}
//                       onChange={handleChange}
//                       className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
//                       placeholder="Tags (comma separated)"
//                     />

//                     {/* Preview Image */}
//                     {previewImage && (
//                       <img
//                         src={previewImage}
//                         alt="Preview"
//                         className="rounded-md mb-3 max-h-60 object-cover border border-gray-700"
//                       />
//                     )}

//                     {/* Upload Image */}
//                     <div className="flex items-center space-x-3">
//                       <label className="text-gray-300">Upload New Image:</label>
//                       <input
//                         type="file"
//                         name="image"
//                         accept="image/*"
//                         onChange={handleChange}
//                         className="text-gray-300"
//                       />
//                     </div>

//                     {/* Publish Toggle */}
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         name="is_published"
//                         checked={formData.is_published}
//                         onChange={handleChange}
//                       />
//                       <span className="text-gray-300">Publish Now</span>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex gap-3 mt-3">
//                       <button
//                         onClick={() => handleUpdate(blog.id)}
//                         className="bg-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-600"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={handleCancel}
//                         className="bg-gray-600 px-4 py-2 rounded-md text-white hover:bg-gray-700"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <h2 className="text-xl font-semibold text-yellow-400 mb-2">
//                       {blog.title}
//                     </h2>
//                     <p className="text-gray-300 mb-3">{blog.content}</p>

//                     {blog.featured_image && (
//                       <img
//                         src={blog.featured_image}
//                         alt={blog.title}
//                         className="rounded-md mb-3 max-h-60 object-cover border border-gray-700"
//                       />
//                     )}

//                     <p className="text-sm text-gray-400 mb-2">
//                       Category:{" "}
//                       <span className="text-blue-400">
//                         {blog.category?.name || "Uncategorized"}
//                       </span>
//                     </p>

//                     <p className="text-sm text-gray-400 mb-3">
//                       Status:{" "}
//                       <span
//                         className={
//                           blog.status === "published"
//                             ? "text-green-400"
//                             : "text-red-400"
//                         }
//                       >
//                         {blog.status}
//                       </span>
//                     </p>

//                     {/* Buttons */}
//                     <div className="flex gap-4">
//                       <button
//                         onClick={() => handleEditClick(blog)}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(blog.id)}
//                         className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBlogs;


import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetMyBlogsQuery,
  useUpdateMyBlogMutation,
  useDeleteMyBlogMutation,
} from "../../api/apiSlice";

const MyBlogs = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🟢 Fetch My Blogs
  const {
    data: blogs = [],
    isLoading,
    isError,
    refetch,
  } = useGetMyBlogsQuery(token);

  const [updateBlog] = useUpdateMyBlogMutation();
  const [deleteBlog] = useDeleteMyBlogMutation();

  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    image: null,
    is_published: false,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const categoryOptions = [
    "Technology",
    "Health",
    "Travel",
    "Education",
    "Food",
    "Finance",
    "Fashion",
    "Sports",
    "Lifestyle",
    "Entertainment",
  ];

  const handleEditClick = (blog) => {
    setEditingBlog(blog.id);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      category: blog.category?.name || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      image: null,
      is_published: blog.status === "published",
    });
    setPreviewImage(blog.featured_image || null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🟢 Handle Update Blog
  const handleUpdate = async (blogId) => {
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("content", formData.content);

      if (formData.category) {
        form.append("category_name", formData.category);
      }

      form.append("tags", formData.tags);
      form.append("status", formData.is_published ? "published" : "draft");

      if (formData.image) {
        form.append("featured_image", formData.image);
      }

      const res = await updateBlog({ id: blogId, data: form, token }).unwrap();

      if (res) {
        toast.success("✅ Blog updated successfully!");
        setEditingBlog(null);
        setFormData({
          title: "",
          content: "",
          category: "",
          tags: "",
          image: null,
          is_published: false,
        });
        setPreviewImage(null);

        await refetch();
        setTimeout(() => {
          navigate("/blogs");
        }, 500);
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("❌ Failed to update blog");
    }
  };

  // 🔴 Handle Delete
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog({ id: blogId, token }).unwrap();
      toast.success("🗑️ Blog deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("❌ Failed to delete blog");
    }
  };

  const handleCancel = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: "",
      image: null,
      is_published: false,
    });
    setPreviewImage(null);
  };

  if (isLoading)
    return <div className="text-center text-gray-500 py-10">Loading your blogs...</div>;

  if (isError)
    return <div className="text-center text-red-500 py-10">Failed to fetch blogs 😢</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        📝 My Blogs ({blogs.length})
      </h1>

      {blogs.length === 0 ? (
        <div className="text-gray-400 text-center">
          You haven't created any blogs yet.
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-5 rounded-xl bg-gray-800 shadow-md border border-gray-700"
              >
                {editingBlog === blog.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                      placeholder="Blog Title"
                      required
                    />

                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                      placeholder="Blog Content"
                      required
                    ></textarea>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                      placeholder="Tags (comma separated)"
                    />

                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="rounded-md mb-3 max-h-60 object-cover border border-gray-700"
                      />
                    )}

                    <div className="flex items-center space-x-3">
                      <label className="text-gray-300">Upload New Image:</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="text-gray-300"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                      />
                      <span className="text-gray-300">Publish Now</span>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleUpdate(blog.id)}
                        className="bg-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-600"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 px-4 py-2 rounded-md text-white hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-300 mb-3">{blog.content}</p>

                    {blog.featured_image && (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="rounded-md mb-3 max-h-60 object-cover border border-gray-700"
                      />
                    )}

                    <p className="text-sm text-gray-400 mb-2">
                      Category:{" "}
                      <span className="text-blue-400">
                        {blog.category?.name || "Uncategorized"}
                      </span>
                    </p>

                    <p className="text-sm text-gray-400 mb-3">
                      Status:{" "}
                      <span
                        className={
                          blog.status === "published"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {blog.status}
                      </span>
                    </p>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEditClick(blog)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;


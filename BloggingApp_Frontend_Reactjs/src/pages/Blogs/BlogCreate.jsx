// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useCreateBlogMutation, useUploadBlogMediaMutation } from "../../api/apiSlice";

// const BlogCreate = () => {
//   const navigate = useNavigate();
//   const [createBlog, { isLoading }] = useCreateBlogMutation();
//   const [uploadMedia] = useUploadBlogMediaMutation();

//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     category: "",
//     tags: "",
//     status: "draft",
//   });

//   const [file, setFile] = useState(null);

//   // Handle text input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle file input
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Submit blog
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all required fields
//     if (!formData.title || !formData.content || !formData.category || !formData.tags || !formData.status || !file) {
//       toast.error("All fields (title, content, category, tags, status, image) are required!");
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("content", formData.content);
//       data.append("category", formData.category);
//       data.append("status", formData.status);
//       formData.tags.split(",").forEach((tag) => data.append("tags", tag.trim()));
//       data.append("file", file);

//       // Create blog
//       const response = await createBlog(data).unwrap();

//       // Safe blog ID extraction
//       const blogId = response?.id || response?.data?.id;

//       toast.success("📝 Blog created successfully!");

//       // Upload image if needed
//       if (file && blogId) {
//         const mediaData = new FormData();
//         mediaData.append("blog_id", blogId);
//         mediaData.append("files", file);
//         await uploadMedia(mediaData).unwrap();
//         toast.success("📸 Image uploaded successfully!");
//       }

//       // Redirect: best UX → Blog Detail page
//       if (blogId) {
//         navigate(`/blogs/${blogId}`);
//       } else {
//         navigate("/blogs"); // fallback
//       }
//     } catch (err) {
//       console.error("Error creating blog:", err);
//       toast.error("Failed to create blog");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-12 bg-white shadow-lg p-8 rounded-2xl">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">✍️ Create a New Blog</h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Title */}
//         <div>
//           <label className="block text-gray-700 mb-2">Title *</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Enter your blog title"
//             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         {/* Content */}
//         <div>
//           <label className="block text-gray-700 mb-2">Content *</label>
//           <textarea
//             name="content"
//             value={formData.content}
//             onChange={handleChange}
//             rows={6}
//             placeholder="Write your blog content..."
//             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           ></textarea>
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block text-gray-700 mb-2">Category ID *</label>
//           <input
//             type="number"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             placeholder="Enter category ID"
//             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         {/* Tags */}
//         <div>
//           <label className="block text-gray-700 mb-2">Tags (comma-separated) *</label>
//           <input
//             type="text"
//             name="tags"
//             value={formData.tags}
//             onChange={handleChange}
//             placeholder="e.g. nature,travel,peace"
//             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-gray-700 mb-2">Status *</label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           >
//             <option value="">Select status</option>
//             <option value="draft">Draft</option>
//             <option value="published">Published</option>
//           </select>
//         </div>

//         {/* Image Upload */}
//         <div>
//           <label className="block text-gray-700 mb-2">Upload Image *</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
//             required
//           />
//           {file && (
//             <p className="text-sm text-gray-500 mt-1">
//               Selected file: <span className="font-medium">{file.name}</span>
//             </p>
//           )}
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all ${
//             isLoading ? "opacity-60 cursor-not-allowed" : ""
//           }`}
//         >
//           {isLoading ? "Creating..." : "Create Blog"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BlogCreate;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useCreateBlogMutation,
  useUploadBlogMediaMutation,
  useGetCategoriesQuery,
} from "../../api/apiSlice";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [uploadMedia] = useUploadBlogMediaMutation();

  // ✅ Fetch categories
  const {
    data: categories = [],
    isLoading: catLoading,
    isError: catError,
  } = useGetCategoriesQuery();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
  });

  const [file, setFile] = useState(null);

  // 🔹 Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔹 Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.tags ||
      !formData.status ||
      !file
    ) {
      toast.error("All fields (title, content, category, tags, status, image) are required!");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("status", formData.status);
      formData.tags.split(",").forEach((tag) => data.append("tags", tag.trim()));
      data.append("file", file);

      const response = await createBlog(data).unwrap();

      const blogId = response?.id || response?.data?.id;
      toast.success("📝 Blog created successfully!");

      if (file && blogId) {
        const mediaData = new FormData();
        mediaData.append("blog_id", blogId);
        mediaData.append("files", file);
        await uploadMedia(mediaData).unwrap();
        toast.success("📸 Image uploaded successfully!");
      }

      if (blogId) {
        navigate(`/blogs/${blogId}`);
      } else {
        navigate("/blogs");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      toast.error("Failed to create blog");
    }
  };

  // 🔹 Handle category loading errors
  if (catError) {
    toast.error("Failed to load categories");
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-lg p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        ✍️ Create a New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your blog title"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 mb-2">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            placeholder="Write your blog content..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        {/* 🔹 Category Dropdown */}
        <div>
          <label className="block text-gray-700 mb-2">Select Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Choose a category --</option>

            {/* Show top 10 categories */}
            {catLoading ? (
              <option disabled>Loading categories...</option>
            ) : categories.slice(0, 10).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 mb-2">Tags (comma-separated) *</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. nature,travel,peace"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 mb-2">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2">Upload Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
            required
          />
          {file && (
            <p className="text-sm text-gray-500 mt-1">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all ${
            isLoading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogCreate;


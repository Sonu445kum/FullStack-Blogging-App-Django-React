import React, { useState } from "react";
import { useCreateBlogMutation, useUploadBlogMediaMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";

const AddBlogModal = ({ onClose }) => {
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [uploadBlogMedia] = useUploadBlogMediaMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft",
  });

  const [file, setFile] = useState(null);

  const categories = [
    "Technology", "Health", "Travel", "Education", "Sports",
    "Lifestyle", "Finance", "Entertainment", "Food", "Fashion",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🧩 STEP 1: Create Blog
      const blogRes = await createBlog({
        title: formData.title,
        content: formData.content,
        category_name: formData.category,
        status: formData.status,
      }).unwrap();

      const blogId = blogRes.id;
      toast.success(" Blog created successfully!");

      // 🧩 STEP 2: Upload Image if selected
      if (file && blogId) {
        const uploadData = new FormData();
        uploadData.append("blog_id", blogId);
        uploadData.append("file", file);

        await uploadBlogMedia(uploadData).unwrap();
        toast.success("🖼️ Image uploaded successfully!");
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create blog!");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-[500px] border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-center">Create New Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <textarea
            name="content"
            placeholder="Write blog content..."
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className="border p-2 w-full rounded"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full rounded"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : "Add Blog"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="text-gray-600 mt-3 text-center w-full hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddBlogModal;

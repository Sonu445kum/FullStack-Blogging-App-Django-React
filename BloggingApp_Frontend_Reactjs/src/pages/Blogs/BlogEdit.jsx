import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
} from "../../api/apiSlice";
import Loader from "../../components/Loader";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing blog
  const { data: blog, isLoading, isError } = useGetBlogQuery(id);

  // Mutation for updating blog
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [tags, setTags] = useState("");

  // Populate form when blog data is fetched
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setStatus(blog.status || "");
      setTags(blog.tags?.join(", ") || "");
    }
  }, [blog]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !status || !tags) {
      return toast.error("All fields are required!");
    }

    try {
      await updateBlog({
        id,
        data: { title, content, status, tags: tags.split(",") },
      }).unwrap();

      toast.success("Blog updated successfully!");
      navigate(`/blogs/${id}`); // redirect to blog detail page
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog!");
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error loading blog.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded"
            rows={6}
          ></textarea>
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isUpdating ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;

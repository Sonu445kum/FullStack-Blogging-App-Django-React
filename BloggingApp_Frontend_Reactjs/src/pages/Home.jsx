import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetBlogsQuery } from "../api/apiSlice";
import Loader from "../components/Loader";

const Home = () => {
  const { data: blogs, isLoading } = useGetBlogsQuery();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (isLoading) return <Loader />;

  const publishedBlogs = blogs?.filter((blog) => blog.status === "published");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-6 font-bold">All Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {publishedBlogs && publishedBlogs.length > 0 ? (
          publishedBlogs.map((blog) => (
            <div
              key={blog.id}
              className="border rounded shadow hover:shadow-lg cursor-pointer overflow-hidden transform hover:-translate-y-1"
            >
              <img
                src={
                  blog.media && blog.media.length > 0
                    ? blog.media[0].file
                    : "https://via.placeholder.com/400x200"
                }
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-2">{blog.content.slice(0, 100)}...</p>
                <button
                  onClick={() => {
                    if (!token) {
                      navigate("/auth/login", { state: { redirect: `/blogs/${blog.id}` } });
                    } else {
                      navigate(`/blogs/${blog.id}`);
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Read More
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useGetBlogsQuery } from "../../api/apiSlice";
import Loader from "../../components/Loader";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BlogSearch = () => {
  const query = useQuery().get("query") || "";
  const { data: blogs = [], isLoading, isError } = useGetBlogsQuery();
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    if (blogs.length > 0 && query) {
      const matched = blogs.filter(blog =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBlogs(matched);
    } else setFilteredBlogs([]);
  }, [blogs, query]);

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center mt-10 text-red-500">Error fetching blogs.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Search Results for "{query}"</h2>
      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No items found in Blog.</p>
      ) : (
        <div className="grid gap-6">
          {filteredBlogs.map(blog => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="block p-4 border rounded-lg shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
            >
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 truncate">{blog.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogSearch;

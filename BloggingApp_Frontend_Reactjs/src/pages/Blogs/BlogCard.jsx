// Put this above your BlogList component (in same file) or in a new file BlogCard.jsx
import React, { useState } from "react";

const BlogCard = ({ blog, navigate, handleReaction, backendHost }) => {
  const [broken, setBroken] = useState(false);

  const imageUrl =
    blog.media?.length > 0
      ? blog.media[0].file
      : blog.featured_image
      ? blog.featured_image.startsWith("http")
        ? blog.featured_image
        : `${backendHost}${blog.featured_image}`
      : null;

  // Helpful console log for debugging
  console.log("BLOG IMAGE URL:", imageUrl, "for blog id:", blog.id);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col">
      {imageUrl && !broken ? (
        <img
          src={imageUrl}
          alt={blog.title || "Blog Image"}
          className="h-52 w-full object-cover rounded-t-xl"
          onError={(e) => {
            console.warn("Image load failed for:", imageUrl, e);
            setBroken(true);
          }}
        />
      ) : (
        <div className="h-52 w-full bg-gray-200 flex items-center justify-center text-gray-500">
          {broken ? (
            <div>
              <div className="text-sm">Image failed to load</div>
              <div className="text-xs break-all">{String(imageUrl)}</div>
            </div>
          ) : (
            "No Image"
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
          {blog.title}
        </h3>
        {/* ... rest of card (author, reactions, read more) */}
        <button onClick={() => navigate(`/blogs/${blog.id}`)} className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 w-full">
          Read More
        </button>
      </div>
    </div>
  );
};

export default BlogCard;

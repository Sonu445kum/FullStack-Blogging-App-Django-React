// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetBlogQuery,
//   useAddCommentMutation,
//   useToggleReactionMutation,
//   useDeleteBlogMutation, // new mutation
// } from "../../api/apiSlice";
// import Loader from "../../components/Loader";

// const BlogDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data: blog, isLoading, isError, refetch } = useGetBlogQuery(id);
//   const [newComment, setNewComment] = useState("");
//   const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
//   const [toggleReaction, { isLoading: reacting }] = useToggleReactionMutation();
//   const [deleteBlog] = useDeleteBlogMutation();

//   const token = localStorage.getItem("token");
//   const isLoggedIn = !!token;

//   if (isLoading) return <Loader />;
//   if (isError) return <p className="text-center mt-10 text-red-500">Error fetching blog.</p>;
//   if (!blog) return <p className="text-center mt-10 text-gray-600">Blog not found.</p>;

//   const {
//     title,
//     content,
//     author,
//     views,
//     total_reactions,
//     total_comments,
//     media,
//     tags,
//     created_at,
//     comments,
//   } = blog;

//   // Add Comment
//   const handleAddComment = async () => {
//     if (!newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment({ blogId: id, content: newComment }).unwrap();
//       toast.success("Comment added successfully!");
//       setNewComment("");
//       refetch();
//     } catch (err) {
//       toast.error("Failed to add comment");
//     }
//   };

//   // Reactions
//   const handleReaction = async (reactionType) => {
//   try {
//     await toggleReaction({ blogId: id, reactionType }).unwrap();
//     toast.success(`${reactionType} reaction updated!`);
//     refetch();
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to react to blog");
//   }
// };


//   // Navigate to Create Blog
//   const handleNavigateToCreate = () => {
//     if (!isLoggedIn) {
//       toast.error("You must be logged in to create a blog!");
//       navigate("/login");
//       return;
//     }
//     navigate("/blogs/create");
//   };

//   // Delete Blog
// const handleDeleteBlog = async () => {
//   if (!window.confirm("Are you sure you want to delete this blog?")) return;

//   try {
//     await deleteBlog(id).unwrap(); // pass only id
//     toast.success("Blog deleted successfully!");
//     navigate("/blogs");
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to delete blog");
//   }
// };

//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl relative">
//       {/* Buttons: Create / Edit / Delete */}
//       <div className="flex justify-start gap-3 mb-4">
//         {isLoggedIn && (
//           <button
//             onClick={handleNavigateToCreate}
//             className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition flex items-center gap-1"
//           >
//             ✍️ Create New
//           </button>
//         )}
//         {isLoggedIn && (
//           <button
//             onClick={() => navigate(`/blogs/edit/${id}`)}
//             className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex items-center gap-1"
//           >
//             ✏️ Edit
//           </button>
//         )}
//         {isLoggedIn && (
//           <button
//             onClick={handleDeleteBlog}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
//           >
//             🗑️ Delete
//           </button>
//         )}
//       </div>

//       {/* Title */}
//       <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>

//       {/* Author Info */}
//       <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
//         <span>By {author?.username || "Unknown Author"}</span>
//         <span>{new Date(created_at).toLocaleDateString()}</span>
//         <span>👁️ {views || 0} Views</span>
//       </div>

//       {/* Tags */}
//       {tags?.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           {tags.map((tag, index) => (
//             <span
//               key={index}
//               className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* Media */}
//       {media?.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           {media.map((item) => (
//             <img
//               key={item.id}
//               src={item.file}
//               alt={`Media ${item.id}`}
//               className="rounded-lg object-cover w-full h-60 hover:scale-105 transition-transform duration-300"
//             />
//           ))}
//         </div>
//       )}

//       {/* Content */}
//       <div className="prose prose-lg mb-6 text-gray-800">{content}</div>

//       {/* Reactions */}
//       <div className="flex flex-wrap gap-4 mb-6 items-center">
//         {["like", "love", "laugh", "angry"].map((reaction) => (
//           <button
//             key={reaction}
//             onClick={() => handleReaction(reaction)}
//             disabled={reacting}
//             className={`flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 transition ${
//               reacting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {reaction === "like"
//               ? `👍 ${total_reactions || 0}`
//               : reaction === "love"
//               ? "❤️"
//               : reaction === "laugh"
//               ? "😂"
//               : "😡"}{" "}
//             {reaction.charAt(0).toUpperCase() + reaction.slice(1)}
//           </button>
//         ))}

//         <span>💬 {total_comments || 0} Comments</span>
//       </div>

//       {/* Add Comment */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2 text-gray-800">Add a Comment</h3>
//         <textarea
//           rows={3}
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Write your comment..."
//         />
//         <button
//           onClick={handleAddComment}
//           disabled={addingComment}
//           className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//         >
//           {addingComment ? "Posting..." : "Post Comment"}
//         </button>
//       </div>

//       {/* Comments */}
//       {comments?.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-3 text-gray-900">Comments</h3>
//           <div className="space-y-4">
//             {comments.map((comment) => (
//               <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
//                 <p className="text-gray-700">
//                   <span className="font-semibold">{comment.user.username}</span>: {comment.content}
//                 </p>
//                 <p className="text-gray-400 text-xs mt-1">
//                   {new Date(comment.created_at).toLocaleString()}
//                 </p>

//                 {/* Replies */}
//                 {comment.replies?.length > 0 && (
//                   <div className="ml-4 mt-2 space-y-2">
//                     {comment.replies.map((reply) => (
//                       <div key={reply.id} className="border-l-2 border-gray-300 pl-2">
//                         <p className="text-gray-700">
//                           <span className="font-semibold">{reply.user.username}</span>: {reply.content}
//                         </p>
//                         <p className="text-gray-400 text-xs mt-1">
//                           {new Date(reply.created_at).toLocaleString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogDetail;



// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetBlogQuery,
//   useAddCommentMutation,
//   useToggleReactionMutation,
//   useDeleteBlogMutation,
// } from "../../api/apiSlice";
// import Loader from "../../components/Loader";
// import { UserContext } from "../../context/UserContext"; // ✅ Added

// const BlogDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext); // ✅ Get user from context

//   // ✅ Fetch blog data
//   const {
//     data: blog,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetBlogQuery(id);

//   const [newComment, setNewComment] = useState("");
//   const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
//   const [toggleReaction, { isLoading: reacting }] = useToggleReactionMutation();
//   const [deleteBlog] = useDeleteBlogMutation();

//   // ✅ Token & Auth Check
//   const token = localStorage.getItem("token");
//   const isLoggedIn = !!token;

//   // ✅ Local reaction state
//   const [userReaction, setUserReaction] = useState(null);
//   const [reactionCounts, setReactionCounts] = useState({
//     like: 0,
//     love: 0,
//     laugh: 0,
//     angry: 0,
//   });

//   // ✅ Initialize counts + user reaction
//   useEffect(() => {
//     if (blog?.reactions) {
//       const counts = { like: 0, love: 0, laugh: 0, angry: 0 };

//       blog.reactions.forEach((r) => {
//         counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
//       });

//       setReactionCounts(counts);

//       const myReaction = blog.reactions.find(
//         (r) => r.user?.id === user?.id
//       );
//       setUserReaction(myReaction?.reaction_type || null);
//     }
//   }, [blog, user?.id]);

//   if (isLoading) return <Loader />;
//   if (isError)
//     return (
//       <p className="text-center mt-10 text-red-500">
//         Error fetching blog.
//       </p>
//     );
//   if (!blog)
//     return (
//       <p className="text-center mt-10 text-gray-600">
//         Blog not found.
//       </p>
//     );

//   const { title, content, author, views, tags, created_at, comments, media } =
//     blog;

//   // ✅ Add Comment
//   const handleAddComment = async () => {
//     if (!newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment({ blogId: id, content: newComment }).unwrap();
//       toast.success("Comment added successfully!");
//       setNewComment("");
//       refetch();
//     } catch (err) {
//       toast.error("Failed to add comment");
//     }
//   };

//   // ✅ Handle Reaction
//   const handleReaction = async (reactionType) => {
//     if (!isLoggedIn) {
//       toast.error("Login required to react!");
//       return;
//     }

//     const prevReaction = userReaction;

//     // 🔄 Optimistic UI Update
//     setUserReaction((prev) => (prev === reactionType ? null : reactionType));
//     setReactionCounts((prevCounts) => {
//       const updated = { ...prevCounts };
//       if (prevReaction) updated[prevReaction]--;
//       if (prevReaction !== reactionType && reactionType)
//         updated[reactionType]++;
//       return updated;
//     });

//     try {
//       await toggleReaction({ blogId: id, reactionType }).unwrap();
//       refetch();
//     } catch (err) {
//       toast.error("Failed to react");
//       setUserReaction(prevReaction); // rollback
//     }
//   };

//   // ✅ Delete Blog
//   const handleDeleteBlog = async () => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await deleteBlog(id).unwrap();
//       toast.success("Blog deleted successfully!");
//       navigate("/blogs");
//     } catch (err) {
//       toast.error("Failed to delete blog");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl relative">
//       {/* ✅ Buttons: Create / Edit / Delete */}
//       <div className="flex justify-start gap-3 mb-4">
//         {isLoggedIn && (
//           <>
//             {/* <button
//               onClick={() => navigate("/blogs/create")}
//               className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition flex items-center gap-1"
//             >
//               ✍️ Create New
//             </button> */}
//             <button
//               onClick={() => navigate(`/blogs/edit/${id}`)}
//               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex items-center gap-1"
//             >
//               ✏️ Edit
//             </button>
//             <button
//               onClick={handleDeleteBlog}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
//             >
//               🗑️ Delete
//             </button>
//           </>
//         )}
//       </div>

//       {/* ✅ Title */}
//       <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>

//       {/* ✅ Author Info */}
//       <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
//         <span>By {author?.username || "Unknown Author"}</span>
//         <span>{new Date(created_at).toLocaleDateString()}</span>
//         <span>👁️ {views || 0} Views</span>
//       </div>

//       {/* ✅ Tags */}
//       {tags?.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           {tags.map((tag, index) => (
//             <span
//               key={index}
//               className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* ✅ Media */}
//       {media?.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           {media.map((item) => (
//             <img
//               key={item.id}
//               src={item.file}
//               alt={`Media ${item.id}`}
//               className="rounded-lg object-cover w-full h-60 hover:scale-105 transition-transform duration-300"
//             />
//           ))}
//         </div>
//       )}

//       {/* ✅ Content */}
//       <div className="prose prose-lg mb-6 text-gray-800">{content}</div>

//       {/* ✅ Reactions */}
//       <div className="flex flex-wrap gap-3 mb-6 items-center">
//         {[
//           { type: "like", emoji: "👍" },
//           { type: "love", emoji: "❤️" },
//           { type: "laugh", emoji: "😂" },
//           { type: "angry", emoji: "😡" },
//         ].map(({ type, emoji }) => (
//           <button
//             key={type}
//             onClick={() => handleReaction(type)}
//             disabled={reacting}
//             className={`flex items-center gap-1 px-3 py-2 rounded-full transition border ${
//               userReaction === type
//                 ? "bg-indigo-600 text-white border-indigo-600 scale-105"
//                 : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
//             }`}
//           >
//             <span className="text-lg">{emoji}</span>
//             <span className="font-medium">
//               {reactionCounts[type] > 0 ? reactionCounts[type] : 0}
//             </span>
//           </button>
//         ))}

//         <span className="ml-2 text-gray-500">
//           💬 {comments?.length || 0} Comments
//         </span>
//       </div>

//       {/* ✅ Add Comment */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2 text-gray-800">
//           Add a Comment
//         </h3>
//         <textarea
//           rows={3}
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Write your comment..."
//         />
//         <button
//           onClick={handleAddComment}
//           disabled={addingComment}
//           className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//         >
//           {addingComment ? "Posting..." : "Post Comment"}
//         </button>
//       </div>

//       {/* ✅ Comments Section */}
//       {comments?.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-3 text-gray-900">
//             Comments
//           </h3>
//           <div className="space-y-4">
//             {comments.map((comment) => (
//               <div
//                 key={comment.id}
//                 className="border rounded-lg p-3 bg-gray-50"
//               >
//                 <p className="text-gray-700">
//                   <span className="font-semibold">
//                     {comment.user.username}
//                   </span>
//                   : {comment.content}
//                 </p>
//                 <p className="text-gray-400 text-xs mt-1">
//                   {new Date(comment.created_at).toLocaleString()}
//                 </p>

//                 {/* ✅ Replies */}
//                 {comment.replies?.length > 0 && (
//                   <div className="ml-4 mt-2 space-y-2">
//                     {comment.replies.map((reply) => (
//                       <div
//                         key={reply.id}
//                         className="border-l-2 border-gray-300 pl-2"
//                       >
//                         <p className="text-gray-700">
//                           <span className="font-semibold">
//                             {reply.user.username}
//                           </span>
//                           : {reply.content}
//                         </p>
//                         <p className="text-gray-400 text-xs mt-1">
//                           {new Date(reply.created_at).toLocaleString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogDetail;


// // new Logic for live updations reactions and emoji
// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetBlogQuery,
//   useAddCommentMutation,
//   useToggleReactionMutation,
//   useDeleteBlogMutation,
// } from "../../api/apiSlice";
// import Loader from "../../components/Loader";
// import { UserContext } from "../../context/UserContext";

// const BlogDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);

//   // ✅ API hooks
//   const {
//     data: blog,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetBlogQuery(id);

//   const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
//   const [toggleReaction, { isLoading: reacting }] = useToggleReactionMutation();
//   const [deleteBlog] = useDeleteBlogMutation();

//   // ✅ Local state
//   const [newComment, setNewComment] = useState("");
//   const [userReaction, setUserReaction] = useState(null);
//   const [reactionCounts, setReactionCounts] = useState({
//     like: 0,
//     love: 0,
//     laugh: 0,
//     angry: 0,
//   });

//   const token = localStorage.getItem("token");
//   const isLoggedIn = !!token;

//   // ✅ Initialize reactions when blog loads
//   useEffect(() => {
//     if (blog) {
//       setUserReaction(blog.user_reaction || null);
//       setReactionCounts(blog.reaction_summary || {
//         like: 0,
//         love: 0,
//         laugh: 0,
//         angry: 0,
//       });
//     }
//   }, [blog]);

//   // ✅ Loader / Error
//   if (isLoading) return <Loader />;
//   if (isError)
//     return (
//       <p className="text-center mt-10 text-red-500">
//         Error fetching blog.
//       </p>
//     );
//   if (!blog)
//     return (
//       <p className="text-center mt-10 text-gray-600">
//         Blog not found.
//       </p>
//     );

//   const {
//     title,
//     content,
//     author,
//     views,
//     tags,
//     created_at,
//     comments,
//     media,
//   } = blog;

//   // ✅ Add Comment
//   const handleAddComment = async () => {
//     if (!newComment.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }
//     try {
//       await addComment({ blogId: id, content: newComment }).unwrap();
//       toast.success("Comment added successfully!");
//       setNewComment("");
//       refetch();
//     } catch (err) {
//       toast.error("Failed to add comment");
//     }
//   };

//   // ✅ Handle Reaction
//   const handleReaction = async (reactionType) => {
//     if (!isLoggedIn) {
//       toast.error("Login required to react!");
//       return;
//     }

//     const prevReaction = userReaction;

//     // 🔄 Optimistic UI update
//     setUserReaction((prev) => (prev === reactionType ? null : reactionType));
//     setReactionCounts((prevCounts) => {
//       const updated = { ...prevCounts };
//       if (prevReaction) updated[prevReaction]--;
//       if (prevReaction !== reactionType && reactionType)
//         updated[reactionType]++;
//       return updated;
//     });

//     try {
//       await toggleReaction({ blogId: id, reactionType }).unwrap();
//       refetch();
//     } catch (err) {
//       toast.error("Failed to react");
//       setUserReaction(prevReaction); // rollback
//     }
//   };

//   // ✅ Delete Blog
//   const handleDeleteBlog = async () => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await deleteBlog(id).unwrap();
//       toast.success("Blog deleted successfully!");
//       navigate("/blogs");
//     } catch (err) {
//       toast.error("Failed to delete blog");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl relative">
//       {/* ✅ Edit/Delete Buttons */}
//       <div className="flex justify-start gap-3 mb-4">
//         {isLoggedIn && (
//           <>
//             <button
//               onClick={() => navigate(`/blogs/edit/${id}`)}
//               className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex items-center gap-1"
//             >
//               ✏️ Edit
//             </button>
//             <button
//               onClick={handleDeleteBlog}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
//             >
//               🗑️ Delete
//             </button>
//           </>
//         )}
//       </div>

//       {/* ✅ Title */}
//       <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>

//       {/* ✅ Author / Date / Views */}
//       <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
//         <span>By {author?.username || "Unknown Author"}</span>
//         <span>{new Date(created_at).toLocaleDateString()}</span>
//         <span>👁️ {views || 0} Views</span>
//       </div>

//       {/* ✅ Tags */}
//       {tags?.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           {tags.map((tag, index) => (
//             <span
//               key={index}
//               className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* ✅ Media */}
//       {media?.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           {media.map((item) => (
//             <img
//               key={item.id}
//               src={item.file}
//               alt={`Media ${item.id}`}
//               className="rounded-lg object-cover w-full h-60 hover:scale-105 transition-transform duration-300"
//             />
//           ))}
//         </div>
//       )}

//       {/* ✅ Content */}
//       <div className="prose prose-lg mb-6 text-gray-800">{content}</div>

//       {/* ✅ Reactions (Persistent) */}
//       <div className="flex flex-wrap gap-3 mb-6 items-center">
//         {[
//           { type: "like", emoji: "👍" },
//           { type: "love", emoji: "❤️" },
//           { type: "laugh", emoji: "😂" },
//           { type: "angry", emoji: "😡" },
//         ].map(({ type, emoji }) => (
//           <button
//             key={type}
//             onClick={() => handleReaction(type)}
//             disabled={reacting}
//             className={`flex items-center gap-1 px-3 py-2 rounded-full transition border ${
//               userReaction === type
//                 ? "bg-indigo-600 text-white border-indigo-600 scale-105"
//                 : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
//             }`}
//           >
//             <span className="text-lg">{emoji}</span>
//             <span className="font-medium">
//               {reactionCounts[type] || 0}
//             </span>
//           </button>
//         ))}

//         <span className="ml-2 text-gray-500">
//           💬 {comments?.length || 0} Comments
//         </span>
//       </div>

//       {/* ✅ Add Comment */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2 text-gray-800">
//           Add a Comment
//         </h3>
//         <textarea
//           rows={3}
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           className="w-full border border-gray-300 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           placeholder="Write your comment..."
//         />
//         <button
//           onClick={handleAddComment}
//           disabled={addingComment}
//           className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//         >
//           {addingComment ? "Posting..." : "Post Comment"}
//         </button>
//       </div>

//       {/* ✅ Comments */}
//       {comments?.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-3 text-gray-900">
//             Comments
//           </h3>
//           <div className="space-y-4">
//             {comments.map((comment) => (
//               <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
//                 <p className="text-gray-700">
//                   <span className="font-semibold">
//                     {comment.user.username}
//                   </span>
//                   : {comment.content}
//                 </p>
//                 <p className="text-gray-400 text-xs mt-1">
//                   {new Date(comment.created_at).toLocaleString()}
//                 </p>

//                 {/* ✅ Replies */}
//                 {comment.replies?.length > 0 && (
//                   <div className="ml-4 mt-2 space-y-2">
//                     {comment.replies.map((reply) => (
//                       <div
//                         key={reply.id}
//                         className="border-l-2 border-gray-300 pl-2"
//                       >
//                         <p className="text-gray-700">
//                           <span className="font-semibold">
//                             {reply.user.username}
//                           </span>
//                           : {reply.content}
//                         </p>
//                         <p className="text-gray-400 text-xs mt-1">
//                           {new Date(reply.created_at).toLocaleString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogDetail;









// Add the websocket
// ✅ BlogDetail.jsx — with WebSocket Live Reactions & Comments
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   useGetBlogQuery,
//   useAddCommentMutation,
//   useToggleReactionMutation,
//   useDeleteBlogMutation,
// } from "../../api/apiSlice";
// import Loader from "../../components/Loader";
// import { UserContext } from "../../context/UserContext";

// const BlogDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(UserContext);
//   const ws = useRef(null);
//   const reconnectTimer = useRef(null);

//   // ✅ API hooks
//   const { data: blog, isLoading, isError, refetch } = useGetBlogQuery(id);
//   const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
//   const [toggleReaction, { isLoading: reacting }] = useToggleReactionMutation();
//   const [deleteBlog] = useDeleteBlogMutation();

//   // ✅ Local state
//   const [newComment, setNewComment] = useState("");
//   const [userReaction, setUserReaction] = useState(null);
//   const [reactionCounts, setReactionCounts] = useState({
//     like: 0,
//     love: 0,
//     laugh: 0,
//     angry: 0,
//   });
//   const [comments, setComments] = useState([]);

//   const token = localStorage.getItem("token");
//   const isLoggedIn = !!token;

//   // ✅ Initialize blog data
//   useEffect(() => {
//     if (blog) {
//       setUserReaction(blog.user_reaction || null);
//       setReactionCounts(
//         blog.reaction_summary || { like: 0, love: 0, laugh: 0, angry: 0 }
//       );
//       setComments(blog.comments || []);
//     }
//   }, [blog]);

//   // =====================================================
//   // 🔥 WebSocket: Real-time Reactions & Comments
//   // =====================================================
//   const connectWebSocket = () => {
//     const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
//     const socketUrl = `${wsProtocol}://127.0.0.1:8000/ws/blogs/${id}/`;

//     ws.current = new WebSocket(socketUrl);

//     ws.current.onopen = () => {
//       console.log("✅ WebSocket connected to blog:", id);
//       if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
//     };

//     ws.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("📨 WebSocket message:", data);

//       if (data.type === "reaction_update") {
//         setReactionCounts(data.reaction_summary || {});
//       } else if (data.type === "comment_update") {
//         setComments(data.comments || []);
//       }
//     };

//     ws.current.onerror = (err) => {
//       console.error("❌ WebSocket error:", err);
//     };

//     ws.current.onclose = (e) => {
//       console.warn("🔴 WebSocket closed:", e.reason || "No reason");
//       reconnectTimer.current = setTimeout(connectWebSocket, 3000);
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       if (ws.current) ws.current.close();
//       if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
//     };
//   }, [id]);

//   // =====================================================
//   // ✍️ Add Comment
//   // =====================================================
//   const handleAddComment = async () => {
//     if (!newComment.trim()) return toast.error("Comment cannot be empty");
//     try {
//       await addComment({ blogId: id, content: newComment }).unwrap();
//       setNewComment("");
//       toast.success("Comment added!");
//       refetch();

//       // ✅ Notify WebSocket
//       if (ws.current?.readyState === WebSocket.OPEN) {
//         ws.current.send(
//           JSON.stringify({
//             type: "new_comment",
//             blog_id: id,
//             user: user?.username,
//             content: newComment,
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Comment error:", error);
//       toast.error("Failed to add comment");
//     }
//   };

//   // =====================================================
//   // 💖 Handle Reaction
//   // =====================================================
//   const handleReaction = async (reactionType) => {
//     if (!isLoggedIn) return toast.error("Login required to react!");

//     const prevReaction = userReaction;
//     const newReaction = prevReaction === reactionType ? null : reactionType;

//     // ⚡ Optimistic UI
//     setUserReaction(newReaction);
//     setReactionCounts((prev) => {
//       const updated = { ...prev };
//       if (prevReaction) updated[prevReaction] = Math.max(0, updated[prevReaction] - 1);
//       if (newReaction) updated[newReaction] = (updated[newReaction] || 0) + 1;
//       return updated;
//     });

//     try {
//       await toggleReaction({ blogId: id, reactionType }).unwrap();

//       // ✅ Send via WebSocket
//       if (ws.current?.readyState === WebSocket.OPEN) {
//         ws.current.send(
//           JSON.stringify({
//             type: "reaction_update",
//             blog_id: id,
//             user: user?.username,
//             reaction_type: newReaction,
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Reaction error:", error);
//       toast.error("Failed to react");
//       setUserReaction(prevReaction);
//     }
//   };

//   // =====================================================
//   // 🗑️ Delete Blog
//   // =====================================================
//   const handleDeleteBlog = async () => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await deleteBlog(id).unwrap();
//       toast.success("Blog deleted successfully!");
//       navigate("/blogs");
//     } catch {
//       toast.error("Failed to delete blog");
//     }
//   };

//   // =====================================================
//   // 🧠 Render
//   // =====================================================
//   if (isLoading)
//     return (
//       <div className="flex justify-center mt-20">
//         <Loader />
//       </div>
//     );
//   if (isError)
//     return <p className="text-center mt-10 text-red-500">Error fetching blog.</p>;
//   if (!blog)
//     return <p className="text-center mt-10 text-gray-600">Blog not found.</p>;

//   const { title, content, author, views, tags, created_at, media } = blog;

//   return (
//     <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl">
//       {/* 🧭 Edit/Delete */}
//       {isLoggedIn && (
//         <div className="flex gap-3 mb-4">
//           <button
//             onClick={() => navigate(`/blogs/edit/${id}`)}
//             className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//           >
//             ✏️ Edit
//           </button>
//           <button
//             onClick={handleDeleteBlog}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             🗑️ Delete
//           </button>
//         </div>
//       )}

//       {/* 🧾 Blog Info */}
//       <h1 className="text-3xl font-bold mb-3">{title}</h1>
//       <div className="text-sm text-gray-500 mb-4 flex justify-between">
//         <span>By {author?.username || "Unknown"}</span>
//         <span>{new Date(created_at).toLocaleDateString()}</span>
//         <span>👁️ {views || 0} Views</span>
//       </div>

//       {/* 🏷️ Tags */}
//       {tags?.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-3">
//           {tags.map((tag, i) => (
//             <span
//               key={i}
//               className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* 🖼️ Media */}
//       {media?.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           {media.map((item) => (
//             <img
//               key={item.id}
//               src={
//                 item.file.startsWith("http")
//                   ? item.file
//                   : `http://127.0.0.1:8000${item.file}`
//               }
//               alt="media"
//               className="rounded-lg object-cover w-full h-60 hover:scale-105 transition-transform"
//             />
//           ))}
//         </div>
//       )}

//       {/* 📝 Content */}
//       <div
//         className="prose prose-lg text-gray-800 mb-6"
//         dangerouslySetInnerHTML={{ __html: content }}
//       />

//       {/* 💬 Reactions */}
//       <div className="flex flex-wrap gap-3 mb-6 items-center">
//         {[
//           { type: "like", emoji: "👍" },
//           { type: "love", emoji: "❤️" },
//           { type: "laugh", emoji: "😂" },
//           { type: "angry", emoji: "😡" },
//         ].map(({ type, emoji }) => (
//           <button
//             key={type}
//             onClick={() => handleReaction(type)}
//             disabled={reacting}
//             className={`flex items-center gap-1 px-3 py-2 rounded-full border transition ${
//               userReaction === type
//                 ? "bg-indigo-600 text-white border-indigo-600 scale-105"
//                 : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
//             }`}
//           >
//             <span className="text-lg">{emoji}</span>
//             <span>{reactionCounts[type] || 0}</span>
//           </button>
//         ))}
//         <span className="ml-2 text-gray-500">💬 {comments.length} Comments</span>
//       </div>

//       {/* ✍️ Add Comment */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2">Add a Comment</h3>
//         <textarea
//           rows={3}
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Write your comment..."
//           className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-indigo-500"
//         />
//         <button
//           onClick={handleAddComment}
//           disabled={addingComment}
//           className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
//         >
//           {addingComment ? "Posting..." : "Post Comment"}
//         </button>
//       </div>

//       {/* 💭 Comments Section */}
//       {comments.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold mb-3">Comments</h3>
//           <div className="space-y-4">
//             {comments.map((comment) => (
//               <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
//                 <p className="text-gray-700">
//                   <strong>{comment.user.username}</strong>: {comment.content}
//                 </p>
//                 <p className="text-gray-400 text-xs mt-1">
//                   {new Date(comment.created_at).toLocaleString()}
//                 </p>

//                 {comment.replies?.length > 0 && (
//                   <div className="ml-4 mt-2 space-y-2">
//                     {comment.replies.map((reply) => (
//                       <div
//                         key={reply.id}
//                         className="border-l-2 border-gray-300 pl-2"
//                       >
//                         <p className="text-gray-700">
//                           <strong>{reply.user.username}</strong>:{" "}
//                           {reply.content}
//                         </p>
//                         <p className="text-gray-400 text-xs mt-1">
//                           {new Date(reply.created_at).toLocaleString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogDetail;


// Add the new Notifications for the live 
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetBlogQuery,
  useAddCommentMutation,
  useToggleReactionMutation,
  useDeleteBlogMutation,
} from "../../api/apiSlice";
import Loader from "../../components/Loader";
import { UserContext } from "../../context/UserContext";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // 🧠 API hooks
  const { data: blog, isLoading, isError } = useGetBlogQuery(id);
  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();
  const [toggleReaction, { isLoading: reacting }] = useToggleReactionMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  // 💾 Local state
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReaction, setUserReaction] = useState(null);

  // 🔒 Auth check
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // 💬 WebSocket refs
  const ws = useRef(null);
  const reconnectTimer = useRef(null);

  // 🧩 Initialize blog data
  useEffect(() => {
    if (blog) {
      setComments(blog.comments || []);
      setReactionCounts(blog.reaction_summary || {});
      setUserReaction(blog.user_reaction || null);
    }
  }, [blog]);

  // ==========================================================
  // ⚡ WebSocket Connection
  // ==========================================================
  const connectWebSocket = () => {
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socketUrl = `${wsProtocol}://127.0.0.1:8000/ws/blogs/${id}/`;

    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected:", socketUrl);
      toast.info("Live updates connected ✅", { autoClose: 1500 });
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Incoming WS:", data);

      switch (data.type) {
        case "reaction_update":
          setReactionCounts(data.reaction_summary || {});
          break;

        case "comment_update":
          setComments(data.comments || []);
          break;

        case "notification":
          toast.info(`🔔 ${data.message}`);
          break;

        default:
          console.log("⚙️ Unhandled WebSocket message:", data);
      }
    };

    ws.current.onclose = () => {
      console.warn("🔴 WS disconnected. Retrying...");
      reconnectTimer.current = setTimeout(connectWebSocket, 3000);
    };

    ws.current.onerror = (err) => {
      console.error("❌ WebSocket Error:", err);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [id]);

  // ==========================================================
  // ✍️ Add Comment
  // ==========================================================
  const handleAddComment = async () => {
    if (!isLoggedIn) return toast.error("Login required to comment!");
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    try {
      await addComment({ blogId: id, content: newComment }).unwrap();
      setNewComment("");

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "comment_update",
            blog_id: id,
            user: user?.username,
            content: newComment,
          })
        );
      }

      toast.success("💬 Comment added!");
    } catch (error) {
      console.error("❌ Comment error:", error);
      toast.error("Failed to post comment");
    }
  };

  // ==========================================================
  // 💖 Toggle Reaction
  // ==========================================================
  const handleReaction = async (reactionType) => {
    if (!isLoggedIn) return toast.error("Login required to react!");

    const prevReaction = userReaction;
    const newReaction = prevReaction === reactionType ? null : reactionType;

    // ⚡ Optimistic UI
    setUserReaction(newReaction);
    setReactionCounts((prev) => {
      const updated = { ...prev };
      if (prevReaction) updated[prevReaction] = Math.max(0, updated[prevReaction] - 1);
      if (newReaction) updated[newReaction] = (updated[newReaction] || 0) + 1;
      return updated;
    });

    try {
      await toggleReaction({ blogId: id, reactionType }).unwrap();

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "reaction_update",
            blog_id: id,
            user: user?.username,
            reaction_type: newReaction,
          })
        );
      }
    } catch (error) {
      console.error("Reaction error:", error);
      toast.error("Failed to react");
      setUserReaction(prevReaction);
    }
  };

  // ==========================================================
  // 🗑️ Delete Blog
  // ==========================================================
  const handleDeleteBlog = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted!");
      navigate("/blogs");
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  // ==========================================================
  // 🧠 Render Section
  // ==========================================================
  if (isLoading)
    return (
      <div className="flex justify-center mt-20">
        <Loader />
      </div>
    );

  if (isError)
    return <p className="text-center text-red-500 mt-10">Error fetching blog.</p>;

  if (!blog)
    return <p className="text-center mt-10 text-gray-600">Blog not found.</p>;

  const { title, content, author, views, tags, created_at, media } = blog;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl">
      {/* ✏️ Edit/Delete */}
      {isLoggedIn && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => navigate(`/blogs/edit/${id}`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDeleteBlog}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* 🧾 Blog Info */}
      <h1 className="text-3xl font-bold mb-3">{title}</h1>
      <div className="text-sm text-gray-500 mb-4 flex justify-between">
        <span>By {author?.username || "Unknown"}</span>
        <span>{new Date(created_at).toLocaleDateString()}</span>
        <span>👁️ {views || 0} Views</span>
      </div>

      {/* 🏷️ Tags */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 🖼️ Media */}
      {media?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {media.map((item) => (
            <img
              key={item.id}
              src={
                item.file.startsWith("http")
                  ? item.file
                  : `http://127.0.0.1:8000${item.file}`
              }
              alt="media"
              className="rounded-lg object-cover w-full h-60 hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      {/* 📝 Content */}
      <div
        className="prose prose-lg text-gray-800 mb-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* 💖 Reactions */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {[
          { type: "like", emoji: "👍" },
          { type: "love", emoji: "❤️" },
          { type: "laugh", emoji: "😂" },
          { type: "angry", emoji: "😡" },
        ].map(({ type, emoji }) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={reacting}
            className={`flex items-center gap-1 px-3 py-2 rounded-full border transition ${
              userReaction === type
                ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
            }`}
          >
            <span className="text-lg">{emoji}</span>
            <span>{reactionCounts[type] || 0}</span>
          </button>
        ))}
        <span className="ml-2 text-gray-500">💬 {comments.length} Comments</span>
      </div>

      {/* ✍️ Add Comment */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add a Comment</h3>
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddComment}
          disabled={addingComment}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          {addingComment ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* 💭 Comments */}
      {comments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Comments</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                <p className="text-gray-700">
                  <strong>{comment.user.username}</strong>: {comment.content}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>

                {comment.replies?.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="border-l-2 border-gray-300 pl-2"
                      >
                        <p className="text-gray-700">
                          <strong>{reply.user.username}</strong>:{" "}
                          {reply.content}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;













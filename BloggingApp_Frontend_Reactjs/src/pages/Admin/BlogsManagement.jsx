
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   useGetAdminBlogsQuery,
//   useCreateBlogMutation,
//   useUpdateBlogMutation,
//   useDeleteBlogMutation,
//   useAddToBlogMutation,
//   useUploadBlogMediaMutation,
//   useApproveBlogMutation,
//   useFlagBlogMutation,
// } from "../../api/apiSlice";
// import Paginations from "../../components/Paginations";

// const BlogsManagement = () => {
//   // ✅ State Management
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

//   // 🕓 Debounce search (user stops typing → trigger API)
//   useEffect(() => {
//     const delay = setTimeout(() => setDebouncedSearch(searchQuery), 500);
//     return () => clearTimeout(delay);
//   }, [searchQuery]);

//   // ✅ Fetch Admin Blogs
//   const {
//     data: blogsData,
//     isLoading,
//     refetch,
//     isFetching,
//   } = useGetAdminBlogsQuery({
//     page: currentPage,
//     status: statusFilter,
//     search: debouncedSearch,
//   });

//   const blogs = blogsData?.results || [];
//   const totalPages = blogsData?.total_pages || 1;

//   // ✅ Mutations
//   const [createBlog] = useCreateBlogMutation();
//   const [updateBlog] = useUpdateBlogMutation();
//   const [deleteBlog] = useDeleteBlogMutation();
//   const [addToBlog] = useAddToBlogMutation();
//   const [uploadBlogMedia] = useUploadBlogMediaMutation();
//   const [approveBlog] = useApproveBlogMutation();
//   const [flagBlog] = useFlagBlogMutation();

//   // ✅ UI States
//   const [loadingBlogId, setLoadingBlogId] = useState(null);
//   const [activeModal, setActiveModal] = useState(null);
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [extraContent, setExtraContent] = useState("");
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     category: "",
//     tags: [],
//     media: null,
//   });

//   const categoryOptions = [
//     "Technology",
//     "Lifestyle",
//     "Business",
//     "Health",
//     "Education",
//     "Entertainment",
//     "Travel",
//     "Food",
//     "Finance",
//     "Sports",
//   ];

//   // ✅ Reset form after success
//   const resetForm = () => {
//     setFormData({ title: "", content: "", category: "", tags: [], media: null });
//     setPreviewImage(null);
//     setSelectedBlog(null);
//     setExtraContent("");
//   };

//   // ✅ Handle Refresh
//   const handleRefresh = () => {
//     setSearchQuery("");
//     setStatusFilter("");
//     setCurrentPage(1);
//     refetch();
//     toast.info("Blog list refreshed");
//   };

//   // ✅ Add Blog
//   const handleAddBlog = async () => {
//     if (!formData.title || !formData.content || !formData.category) {
//       toast.error("Please fill all required fields!");
//       return;
//     }

//     try {
//       const createdBlog = await createBlog({
//         title: formData.title,
//         content: formData.content,
//         category_name: formData.category,
//         tags: formData.tags,
//       }).unwrap();

//       const blogId = createdBlog.id ?? createdBlog.blog?.id;
//       if (formData.media) {
//         const mediaForm = new FormData();
//         mediaForm.append("file", formData.media);
//         mediaForm.append("blog_id", blogId);
//         await uploadBlogMedia(mediaForm).unwrap();
//       }

//       toast.success("Blog added successfully!");
//       handleRefresh();
//       setActiveModal(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add blog");
//     }
//   };

//   // ✏️ Edit Blog
//   const handleEditBlog = async () => {
//     try {
//       const blogId = selectedBlog?.id;
//       if (!blogId) return toast.error("Blog ID missing");

//       await updateBlog({
//         id: blogId,
//         data: {
//           title: formData.title,
//           content: formData.content,
//           category_name: formData.category,
//           tags: formData.tags,
//         },
//       }).unwrap();

//       if (formData.media) {
//         const mediaForm = new FormData();
//         mediaForm.append("file", formData.media);
//         mediaForm.append("blog_id", blogId);
//         await uploadBlogMedia(mediaForm).unwrap();
//       }

//       toast.success("Blog updated successfully!");
//       handleRefresh();
//       setActiveModal(null);
//     } catch {
//       toast.error("Failed to update blog");
//     }
//   };

//   // ➕ Add Extra Content
//   const handleAddToBlog = async () => {
//     if (!extraContent.trim()) {
//       toast.error("Enter content to add!");
//       return;
//     }
//     try {
//       await addToBlog({ blogId: selectedBlog.id, content: extraContent }).unwrap();
//       toast.success("Added new content!");
//       handleRefresh();
//       setActiveModal(null);
//     } catch {
//       toast.error("Failed to add content");
//     }
//   };

//   // 🗑️ Delete Blog
//   const handleDeleteBlog = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await deleteBlog(id).unwrap();
//       toast.success("Blog deleted!");
//       handleRefresh();
//     } catch {
//       toast.error("Failed to delete blog");
//     }
//   };

//   // ✅ Approve Blog
//   const handleApprove = async (blogId) => {
//     try {
//       setLoadingBlogId(blogId);
//       await approveBlog(blogId).unwrap();
//       toast.success("Blog approved!");
//       handleRefresh();
//     } catch {
//       toast.error("Failed to approve blog");
//     } finally {
//       setLoadingBlogId(null);
//     }
//   };

//   // 🚩 Flag Blog
//   const handleFlag = async (blogId) => {
//     try {
//       setLoadingBlogId(blogId);
//       await flagBlog(blogId).unwrap();
//       toast.success("Blog flagged!");
//       handleRefresh();
//     } catch {
//       toast.error("Failed to flag blog");
//     } finally {
//       setLoadingBlogId(null);
//     }
//   };

//   // 🧩 Modal Layout
//   const Modal = ({ title, children, onClose }) => (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
//         {children}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
//         >
//           ✖
//         </button>
//       </div>
//     </div>
//   );

//   if (isLoading || isFetching)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-700 text-xl font-semibold">
//         Loading blogs...
//       </div>
//     );

//   return (
//     <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
//       <div className="flex flex-wrap justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold text-gray-800">Blogs Management</h1>

//         {/* 🔍 Filters */}
//         <div className="flex flex-wrap gap-3">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border rounded-lg px-3 py-2"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border rounded-lg px-3 py-2"
//           >
//             <option value="">All</option>
//             <option value="published">Published</option>
//             <option value="draft">Draft</option>
//             <option value="pending">Pending</option>
//           </select>
//           <button
//             onClick={handleRefresh}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* 🧾 Blog Table */}
//       <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
//         <table className="min-w-full">
//           <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
//             <tr>
//               <th className="py-3 px-6 text-left">ID</th>
//               <th className="py-3 px-6 text-left">Title</th>
//               <th className="py-3 px-6 text-left">Category</th>
//               <th className="py-3 px-6 text-left">Author</th>
//               <th className="py-3 px-6 text-left">Status</th>
//               <th className="py-3 px-6 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {blogs.length > 0 ? (
//               blogs.map((blog) => (
//                 <tr key={blog.id} className="border-b hover:bg-gray-50">
//                   <td className="py-3 px-6">{blog.id}</td>
//                   <td className="py-3 px-6 font-semibold">{blog.title}</td>
//                   <td className="py-3 px-6">{blog.category?.name || "—"}</td>
//                   <td className="py-3 px-6">{blog.author?.username || "—"}</td>
//                   <td
//                     className={`py-3 px-6 capitalize font-semibold ${
//                       blog.status === "published"
//                         ? "text-green-600"
//                         : blog.status === "draft"
//                         ? "text-yellow-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {blog.status || "pending"}
//                   </td>
//                   <td className="py-3 px-6 flex flex-wrap gap-2">
//                     <button
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                       onClick={() => handleApprove(blog.id)}
//                       disabled={loadingBlogId === blog.id}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                       onClick={() => {
//                         setSelectedBlog(blog);
//                         setFormData({
//                           title: blog.title,
//                           content: blog.content,
//                           category: blog.category?.name || "",
//                           tags: blog.tags || [],
//                           media: null,
//                         });
//                         setActiveModal("edit");
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                       onClick={() => handleDeleteBlog(blog.id)}
//                     >
//                       Delete
//                     </button>
//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                       onClick={() => {
//                         setSelectedBlog(blog);
//                         setActiveModal("addToBlog");
//                       }}
//                     >
//                       Add Content
//                     </button>
//                     <button
//                       className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
//                       onClick={() => handleFlag(blog.id)}
//                     >
//                       Flag
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500 font-medium">
//                   No blogs found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ Pagination */}
//       <div className="mt-6 flex justify-center">
//         <Paginations
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default BlogsManagement;




import React, { useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAdminBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAddToBlogMutation,
  useUploadBlogMediaMutation,
  useApproveBlogMutation,
  useFlagBlogMutation,
} from "../../api/apiSlice";
import Paginations from "../../components/Paginations";

const BlogsManagement = () => {
  // ✅ State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ Fetch Admin Blogs (no search now)
  const {
    data: blogsData,
    isLoading,
    refetch,
    isFetching,
  } = useGetAdminBlogsQuery({
    page: currentPage,
    status: statusFilter,
  });

  const blogs = blogsData?.results || [];
  const totalPages = blogsData?.total_pages || 1;

  // ✅ Mutations
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [addToBlog] = useAddToBlogMutation();
  const [uploadBlogMedia] = useUploadBlogMediaMutation();
  const [approveBlog] = useApproveBlogMutation();
  const [flagBlog] = useFlagBlogMutation();

  // ✅ UI States
  const [loadingBlogId, setLoadingBlogId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [extraContent, setExtraContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
    media: null,
  });

  const categoryOptions = [
    "Technology",
    "Lifestyle",
    "Business",
    "Health",
    "Education",
    "Entertainment",
    "Travel",
    "Food",
    "Finance",
    "Sports",
  ];

  // ✅ Reset form after success
  const resetForm = () => {
    setFormData({ title: "", content: "", category: "", tags: [], media: null });
    setPreviewImage(null);
    setSelectedBlog(null);
    setExtraContent("");
  };

  

  // ✅ Add Blog
  const handleAddBlog = async () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const createdBlog = await createBlog({
        title: formData.title,
        content: formData.content,
        category_name: formData.category,
        tags: formData.tags,
      }).unwrap();

      const blogId = createdBlog.id ?? createdBlog.blog?.id;
      if (formData.media) {
        const mediaForm = new FormData();
        mediaForm.append("file", formData.media);
        mediaForm.append("blog_id", blogId);
        await uploadBlogMedia(mediaForm).unwrap();
      }

      toast.success("Blog added successfully!");
      handleRefresh();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add blog");
    }
  };

  // ✏️ Edit Blog
  const handleEditBlog = async () => {
    try {
      const blogId = selectedBlog?.id;
      if (!blogId) return toast.error("Blog ID missing");

      await updateBlog({
        id: blogId,
        data: {
          title: formData.title,
          content: formData.content,
          category_name: formData.category,
          tags: formData.tags,
        },
      }).unwrap();

      if (formData.media) {
        const mediaForm = new FormData();
        mediaForm.append("file", formData.media);
        mediaForm.append("blog_id", blogId);
        await uploadBlogMedia(mediaForm).unwrap();
      }

      toast.success("Blog updated successfully!");
      handleRefresh();
      setActiveModal(null);
    } catch {
      toast.error("Failed to update blog");
    }
  };

  // ➕ Add Extra Content
  const handleAddToBlog = async () => {
    if (!extraContent.trim()) {
      toast.error("Enter content to add!");
      return;
    }
    try {
      await addToBlog({ blogId: selectedBlog.id, content: extraContent }).unwrap();
      toast.success("Added new content!");
      handleRefresh();
      setActiveModal(null);
    } catch {
      toast.error("Failed to add content");
    }
  };

  // 🗑️ Delete Blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted!");
      handleRefresh();
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  // ✅ Approve Blog
  const handleApprove = async (blogId) => {
    try {
      setLoadingBlogId(blogId);
      await approveBlog(blogId).unwrap();
      toast.success("Blog approved!");
      handleRefresh();
    } catch {
      toast.error("Failed to approve blog");
    } finally {
      setLoadingBlogId(null);
    }
  };

  // 🚩 Flag Blog
  const handleFlag = async (blogId) => {
    try {
      setLoadingBlogId(blogId);
      await flagBlog(blogId).unwrap();
      toast.success("Blog flagged!");
      handleRefresh();
    } catch {
      toast.error("Failed to flag blog");
    } finally {
      setLoadingBlogId(null);
    }
  };

  // 🧩 Modal Layout
  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✖
        </button>
      </div>
    </div>
  );

  if (isLoading || isFetching)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl font-semibold">
        Loading blogs...
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="flex flex-wrap justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Blogs Management</h1>

        {/* 🔍 Filters (only status + refresh) */}
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

         
        </div>
      </div>

      {/* 🧾 Blog Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{blog.id}</td>
                  <td className="py-3 px-6 font-semibold">{blog.title}</td>
                  <td className="py-3 px-6">{blog.category?.name || "—"}</td>
                  <td className="py-3 px-6">{blog.author?.username || "—"}</td>
                  <td
                    className={`py-3 px-6 capitalize font-semibold ${
                      blog.status === "published"
                        ? "text-green-600"
                        : blog.status === "draft"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {blog.status || "pending"}
                  </td>
                  <td className="py-3 px-6 flex flex-wrap gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleApprove(blog.id)}
                      disabled={loadingBlogId === blog.id}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => {
                        setSelectedBlog(blog);
                        setFormData({
                          title: blog.title,
                          content: blog.content,
                          category: blog.category?.name || "",
                          tags: blog.tags || [],
                          media: null,
                        });
                        setActiveModal("edit");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedBlog(blog);
                        setActiveModal("addToBlog");
                      }}
                    >
                      Add Content
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      onClick={() => handleFlag(blog.id)}
                    >
                      Flag
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 font-medium">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="mt-6 flex justify-center">
        <Paginations
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BlogsManagement;


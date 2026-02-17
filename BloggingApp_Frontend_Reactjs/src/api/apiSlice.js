// src/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ==========================
   🌐 BASE URL CONFIG
========================== */
const rawUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // fallback

// Ensure exactly ONE slash between base and "api"
const BASE_URL = rawUrl.replace(/\/+$/, "") + "/api";

/* ==========================
   ⚡ RTK QUERY API SLICE
========================== */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // handle cookies & CSRF if backend uses
    prepareHeaders: (headers) => {
      try {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", "application/json");
        return headers;
      } catch (err) {
        console.error("❌ Error preparing headers:", err);
        return headers;
      }
    },
  }),
  tagTypes: [
    "Blog",
    "User",
    "Category",
    "Comment",
    "Notification",
    "Profile",
    "Stats",
  ],
  endpoints: (builder) => ({
    /* ==========================
       🔐 AUTHENTICATION ENDPOINTS
    ========================== */
    login: builder.mutation({
      query: (data) => ({
        url: "auth/login/",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "auth/request-password-reset/",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: ({ uid, token }) => ({
        url: "auth/verify-email/",
        method: "POST",
        body: { uid, token },
        headers: { "Content-Type": "application/json" },
      }),
    }),

    // Optional: If you prefer GET
    verifyEmailGet: builder.query({
      query: ({ uid, token }) =>
        `auth/verify-email/?uid=${encodeURIComponent(
          uid
        )}&token=${encodeURIComponent(token)}`,
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password/",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "auth/change-password/",
        method: "POST",
        body: data,
      }),
    }),
    currentUser: builder.query({
      query: () => "auth/current-user/",
      providesTags: ["User"],
    }),

    /* ==========================
       🧑‍💻 PROFILE ENDPOINTS
    ========================== */
    getProfile: builder.query({
      query: () => "profile/",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "profile/update/",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    getStats: builder.query({ query: () => "stats/", providesTags: ["Stats"] }),
//     getStats: builder.query({
//   query: () => "/api/admin/stats/",
//   providesTags: ["Stats"],
// }),


    /* ==========================
       📝 BLOGS CRUD ENDPOINTS
    ========================== */
    // getBlogs: builder.query({ query: () => "blogs/", providesTags: ["Blog"] }),
    // getBlogs: builder.query({
    //   query: ({
    //     page = 1,
    //     category = "",
    //     search = "",
    //     tag = "",
    //     author = "",
    //   }) => {
    //     let url = `blogs/?page=${page}`;

    //     if (category && category.toLowerCase() !== "all") {
    //       url += `&category=${category}`;
    //     }
    //     if (search) {
    //       url += `&search=${search}`;
    //     }
    //     if (tag) {
    //       url += `&tag=${tag}`;
    //     }
    //     if (author) {
    //       url += `&author=${author}`;
    //     }

    //     return url;
    //   },
    //   providesTags: ["Blog"],
    // }),

    getBlogs: builder.query({
      query: ({
        page = 1,
        category = "",
        search = "",
        tag = "",
        author = "",
      }) => {
        let url = `blogs/?page=${page}`;

        if (category && category.toLowerCase() !== "all") {
          url += `&category=${category}`;
        }
        if (search) {
          url += `&search=${search}`;
        }
        if (tag) {
          url += `&tag=${tag}`;
        }
        if (author) {
          url += `&author=${author}`;
        }

        return url;
      },
      providesTags: ["Blog"],

      // 🧩 Added WebSocket live updates (real-time reactions/comments)
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Wait until cache is ready
        await cacheDataLoaded;

        // ✅ Connect to WebSocket server
  const WS_BASE = import.meta.env.VITE_API_URL.replace("https", "wss");
  const ws = new WebSocket(`${WS_BASE}/ws/reactions/`);

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // 🎯 Handle Reaction Updates
          if (data.type === "reaction_update") {
            updateCachedData((draft) => {
              const blog = draft.results?.find((b) => b.id === data.blog_id);
              if (blog) {
                blog.reaction_summary = data.reaction_summary;
              }
            });
          }

          // 💬 Handle Comment Updates
          if (data.type === "comment_update") {
            updateCachedData((draft) => {
              const blog = draft.results?.find((b) => b.id === data.blog_id);
              if (blog) {
                blog.latest_comments = data.comments;
              }
            });
          }
        };

        ws.onopen = () => console.log("✅ WebSocket connected for blogs list");
        ws.onclose = () =>
          console.log("❌ WebSocket disconnected for blogs list");

        // ❌ Close socket when cache entry is removed
        await cacheEntryRemoved;
        ws.close();
      },
    }),

    // myBlogs
    getMyBlogs: builder.query({
      query: (token) => ({
        url: "blogs/myblogs/",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Blog"],
    }),

    updateMyBlog: builder.mutation({
      query: ({ id, data, token }) => ({
        url: `blogs/myblogs/${id}/update/`,
        method: "PUT",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteMyBlog: builder.mutation({
      query: ({ id, token }) => ({
        url: `blogs/myblogs/${id}/delete/`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Blog"],
    }),

    getAllBlogs: builder.query({
      query: () => `/blogs/`,
      providesTags: ["Blogs"],
    }),
    getBlog: builder.query({
      query: (id) => `blogs/${id}/`,
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "blogs/create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    getAdminBlogs: builder.query({
      query: ({ page = 1, status = "" }) => {
        let url = `/admin/blogs/?page=${page}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ["Blogs"],
    }),

    getAllBlogsAdmin: builder.query({
      query: ({ search = "", category = "", status = "", page = 1 }) => {
        let queryString = `admin/blogs/?page=${page}`;
        if (search) queryString += `&search=${search}`;
        if (category) queryString += `&category=${category}`;
        if (status) queryString += `&status=${status}`;
        return queryString;
      },
      providesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `admin/blogs/${id}/update/`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({ url: `admin/blogs/${id}/delete/`, method: "DELETE" }),
      invalidatesTags: ["Blog"],
    }),
    addToBlog: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `blogs/${blogId}/add-to-blog/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Blog"],
    }),

    /* ==========================
       📸 BLOG MEDIA UPLOAD
    ========================== */
    uploadBlogMedia: builder.mutation({
      query: (formData) => ({
        url: "blogs/media/upload/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // blogs active tranding
    getBlogsPerCategory: builder.query({
      query: () => "blogs/category-stats/",
    }),
    getMostActiveUsers: builder.query({
      query: () => "users/most-active/",
    }),
    getTrendingBlogs: builder.query({
      query: () => "blogs/trending/",
    }),

    /* ==========================
       🏷️ CATEGORIES
    ========================== */
    getCategories: builder.query({
      query: () => "categories/",
      providesTags: ["Category"],
      // Transform response so it always returns an array
      transformResponse: (response) => {
        // If your API returns { results: [...] } or { categories: [...] }
        if (response.results) return response.results;
        if (response.categories) return response.categories;
        // fallback: if API returns array directly
        if (Array.isArray(response)) return response;
        // otherwise return empty array
        return [];
      },
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "categories/create/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateDeleteCategory: builder.mutation({
      query: ({ id, data, method }) => ({
        url: `categories/${id}/update-delete/`,
        method,
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `categories/${categoryId}/update-delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    /* ==========================
       😍 REACTIONS
    ========================== */
    toggleReaction: builder.mutation({
      query: ({ blogId, reactionType }) => ({
        url: `blogs/${blogId}/reactions/toggle/`,
        method: "POST",
        body: { reaction_type: reactionType }, // ✅ matches backend expectation
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Blog"],
    }),

    getAllReactions: builder.query({ query: () => "admin/reactions/" }),
    deleteReaction: builder.mutation({
      query: (id) => ({
        url: `admin/reactions/${id}/`,
        method: "DELETE",
      }),
    }),

    /* ==========================
       💬 COMMENTS
    ========================== */
    getComments: builder.query({
      query: ({ blogId }) => `blogs/${blogId}/comments/`,
      providesTags: ["Comment"],
    }),
    addComment: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `blogs/${blogId}/comments/add/`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Comment", "Blog"],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({ url: `comments/${id}/delete/`, method: "DELETE" }),
      invalidatesTags: ["Comment", "Blog"],
    }),
    approveComment: builder.mutation({
      query: (commentId) => ({
        url: `comments/${commentId}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    // admin comments
    getAllComments: builder.query({
      query: ({ page = 1, pageSize = 10, search = "", sort = "" } = {}) => {
        let url = `/admin/comments/?page=${page}&page_size=${pageSize}`;

        if (search) url += `&search=${search}`;
        if (sort) url += `&sort=${sort}`;

        return url;
      },
      providesTags: ["Comments"],
    }),
    /* 🔴 Delete comment (for user or admin) */
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),

    /* 🟡 Approve comment (Admin only) */
    approveComment: builder.mutation({
      query: (id) => ({
        url: `/admin/comments/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Comments"],
    }),

    /* ==========================
       🔔 NOTIFICATIONS
    ========================== */
    getNotifications: builder.query({
      query: () => "user/notifications/",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/mark-read/`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: "notifications/mark-all-read/", method: "POST" }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({ url: `notifications/${id}/delete/`, method: "DELETE" }),
      invalidatesTags: ["Notification"],
    }),

    /* ==========================
       🔔 NOTIFICATIONS (Admin)
    =========================== */
    getAdminNotifications: builder.query({
      query: ({ page = 1 }) => `/admin/notifications/?page=${page}`,
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/mark-read/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteAdminNotification: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/`, // remove /delete/ here
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    getAllReactions: builder.query({
      query: ({ page = 1 }) => `/api/admin/reactions/?page=${page}`,
      providesTags: ["Reactions"],
    }),
    // Delete a reaction
    deleteReaction: builder.mutation({
      query: (id) => ({
        url: `/api/admin/reactions/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reactions"],
    }),

    /* ==========================
       🏛️ ADMIN DASHBOARD
    ========================== */
    // 1️ Get all users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"], // automatically re-fetch after mutation
    }),

    // 2️ Update user (role, email, username)
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/update-role/`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
    // 3️ Create new user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/users/create",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"], // refresh users list after creation
    }),

    // Add new user
    addUser: builder.mutation({
      query: (user) => ({
        url: "users/add/",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    // delete user
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `api/users/${userId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // update user
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `users/${userId}/update/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    getDashboardStats: builder.query({
      query: () => "admin/dashboard/",
      providesTags: ["Stats"],
    }),
    getUsers: builder.query({
      query: () => "admin/users/",
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => `admin/users/${id}/`,
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `admin/users/${userId}/update-role/`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    getDashboardStats: builder.query({
      query: () => "/api/admin/dashboard-stats/",
    }),

    getAllComments: builder.query({
      query: () => "admin/comments/",
      providesTags: ["Comment"],
    }),
    getAllNotifications: builder.query({
      query: () => "admin/notifications/",
      providesTags: ["Notification"],
    }),
    mostActiveUsers: builder.query({
      query: () => "admin/most-active-users/",
      providesTags: ["User"],
    }),
    getTrendingBlogs: builder.query({
      query: () => "admin/trending-blogs/",
      providesTags: ["Blog"],
    }),
    approveBlog: builder.mutation({
      query: (blogId) => ({ url: `blogs/${blogId}/approve/`, method: "POST" }),
      invalidatesTags: ["Blog"],
    }),
    flagBlog: builder.mutation({
      query: (blogId) => ({ url: `blogs/${blogId}/flag/`, method: "POST" }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

/* ==========================
    EXPORT HOOKS
========================= */
export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useVerifyEmailGetQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useCurrentUserQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetStatsQuery,
  useGetBlogsQuery,
  useGetMyBlogsQuery,
  useUpdateMyBlogMutation,
  useDeleteMyBlogMutation,
  useGetAllBlogsQuery,
  useGetAdminBlogsQuery,
  useGetBlogQuery,
  useAddToBlogMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadBlogMediaMutation,
  useToggleReactionMutation,
  useGetAllReactionsQuery,
  useDeleteReactionMutation,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateDeleteCategoryMutation,
  useDeleteCategoryMutation,
  useApproveCommentMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useGetAllCommentsQuery,
  useDeleteCommentMutation,
  useGetNotificationsQuery,
  useGetAllNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useGetAdminNotificationsQuery,
  useDeleteAdminNotificationMutation,
  useGetDashboardStatsQuery,
  useMostActiveUsersQuery,
  useGetTrendingBlogsQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserRoleMutation,
  useApproveBlogMutation,
  useFlagBlogMutation,
  useGetBlogsPerCategoryQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useAddUserMutation,
} = apiSlice;

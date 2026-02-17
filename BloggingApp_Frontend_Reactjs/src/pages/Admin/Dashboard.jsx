


// import React from "react";
// import {
//   useGetDashboardStatsQuery,
//   useMostActiveUsersQuery,
//   useGetTrendingBlogsQuery,
// } from "../../api/apiSlice";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { motion } from "framer-motion";

// const Dashboard = () => {
//   const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
//   const { data: activeUsers, isLoading: usersLoading } = useMostActiveUsersQuery();
//   const { data: trendingBlogs, isLoading: blogsLoading } = useGetTrendingBlogsQuery();

//   if (statsLoading || usersLoading || blogsLoading)
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
//         Loading dashboard...
//       </div>
//     );

//   const safeTrendingBlogs = trendingBlogs || [];

//   /* 🔹 Fix: Proper Category Detection */
// const blogsPerCategory = safeTrendingBlogs.reduce((acc, blog) => {
//   const categoryName =
//     blog?.category?.name?.trim() && blog.category.name !== "Uncategorized"
//       ? blog.category.name
//       : "No Category";
//   acc[categoryName] = (acc[categoryName] || 0) + 1;
//   return acc;
// }, {});

// const categoryChartData = Object.entries(blogsPerCategory).map(([name, count]) => ({
//   name,
//   count,
// }));


//   /* 🔹 Overall Stats */
//   const overviewData = [
//     { name: "Users", value: stats?.users ?? 0 },
//     { name: "Blogs", value: stats?.blogs ?? 0 },
//     { name: "Comments", value: stats?.comments ?? 0 },
//     { name: "Reactions", value: stats?.reactions ?? 0 },
//     { name: "Categories", value: stats?.categories ?? 0 },
//     { name: "Notifications", value: stats?.notifications ?? 0 },
//   ];

//   /* 🔹 Category % Distribution for Pie */
//   const totalBlogs = categoryChartData.reduce((sum, cat) => sum + cat.count, 0);
//   const categoryPercentageData = categoryChartData.map((cat) => ({
//     name: cat.name,
//     value: ((cat.count / totalBlogs) * 100).toFixed(2),
//   }));

//   /* 🔹 Simulated Growth Over Time (Line Chart) */
//   const growthData = [
//     { month: "Jan", blogs: 20 },
//     { month: "Feb", blogs: 45 },
//     { month: "Mar", blogs: 60 },
//     { month: "Apr", blogs: 80 },
//     { month: "May", blogs: 120 },
//     { month: "Jun", blogs: stats?.blogs ?? 150 },
//   ];

//   const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

//   return (
//     <div className="min-h-screen flex flex-col p-8 space-y-10 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
//       <motion.h1
//         className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         Admin Dashboard
//       </motion.h1>

//       {/* 🔸 Stats Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//         {overviewData.map((stat, i) => (
//           <motion.div
//             key={stat.name}
//             className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <h2 className="text-lg font-semibold">{stat.name}</h2>
//             <p className="text-3xl font-bold mt-2">{stat.value}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* 🔹 Overall Stats Chart */}
//       <motion.div
//         className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
//           Overview Analytics
//         </h2>
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={overviewData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </motion.div>

//       {/* 🔹 Blogs per Category */}
//       <motion.div
//         className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
//           Blogs per Category
//         </h2>
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={categoryChartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </motion.div>

      
//       {/* 🔹 Growth Trend (Line Chart) */}
//       <motion.div
//         className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
//           Blog Growth Over Time
//         </h2>
//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={growthData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="blogs" stroke="#10B981" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import {
  useGetDashboardStatsQuery,
  useMostActiveUsersQuery,
  useGetTrendingBlogsQuery,
} from "../../api/apiSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: activeUsers, isLoading: usersLoading } = useMostActiveUsersQuery();
  const { data: trendingBlogs, isLoading: blogsLoading } = useGetTrendingBlogsQuery();

  if (statsLoading || usersLoading || blogsLoading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 font-semibold text-xl">
        Loading dashboard...
      </div>
    );

  const safeTrendingBlogs = trendingBlogs || [];

  /* 🔹 Category Calculation */
  const blogsPerCategory = safeTrendingBlogs.reduce((acc, blog) => {
    const categoryName =
      blog?.category?.name?.trim() && blog.category.name !== "Uncategorized"
        ? blog.category.name
        : "No Category";
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(blogsPerCategory).map(([name, count]) => ({
    name,
    count,
  }));

  /* 🔹 Handle both dashboard/stats or stats/ */
  const unifiedStats = {
    users: stats?.users ?? stats?.total_users ?? 0,
    blogs: stats?.blogs ?? stats?.total_blogs ?? 0,
    comments: stats?.comments ?? stats?.total_comments ?? 0,
    reactions: stats?.reactions ?? stats?.total_reactions ?? 0,
    notifications: stats?.notifications ?? stats?.total_notifications ?? 0,
    categories: stats?.categories ?? stats?.total_categories ?? 0,
  };

  /* 🔹 Overview Cards */
  const overviewData = [
    { name: "Users", value: unifiedStats.users },
    { name: "Blogs", value: unifiedStats.blogs },
    { name: "Comments", value: unifiedStats.comments },
    { name: "Reactions", value: unifiedStats.reactions },
    { name: "Categories", value: unifiedStats.categories },
    { name: "Notifications", value: unifiedStats.notifications },
  ];

  /* 🔹 Growth Data */
  const growthData = [
    { month: "Jan", blogs: 20 },
    { month: "Feb", blogs: 45 },
    { month: "Mar", blogs: 60 },
    { month: "Apr", blogs: 80 },
    { month: "May", blogs: 120 },
    { month: "Jun", blogs: unifiedStats.blogs },
  ];

  return (
    <div className="min-h-screen flex flex-col p-8 space-y-10 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <motion.h1
        className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* 🔸 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {overviewData.map((stat, i) => (
          <motion.div
            key={stat.name}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="text-lg font-semibold">{stat.name}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔹 Overview Analytics */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Overview Analytics
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={overviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔹 Blogs per Category */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Blogs per Category
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔹 Growth Chart */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Blog Growth Over Time
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="blogs" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔹 Most Active Users */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Most Active Users
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeUsers?.length > 0 ? (
            activeUsers.map((user, idx) => (
              <motion.div
                key={user.id || idx}
                className="p-4 bg-indigo-100 dark:bg-gray-700 rounded-lg shadow flex items-center space-x-4"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={user.profile_picture || "/default-avatar.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {user.username}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Blogs: {user.blog_count || 0} | Comments: {user.comment_count || 0}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No active users found.</p>
          )}
        </div>
      </motion.div>

      {/* 🔹 Top Trending Blogs */}
      <motion.div
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
          Top Trending Blogs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeTrendingBlogs.length > 0 ? (
            safeTrendingBlogs.map((blog, idx) => (
              <motion.div
                key={blog.id || idx}
                className="p-4 bg-purple-100 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Category: {blog?.category?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Reactions: {blog.reactions_count || 0}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No trending blogs found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;















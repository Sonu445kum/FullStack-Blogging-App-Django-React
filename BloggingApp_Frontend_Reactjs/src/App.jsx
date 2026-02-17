import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword";
import VerifyEmail from "./pages/Auth/VerifyEmails";

// Blog Pages
import BlogList from "./pages/Blogs/BlogList";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogCreate from "./pages/Blogs/BlogCreate";
import BlogEdit from "./pages/Blogs/BlogEdit";
import BlogSearch from "./pages/Blogs/BlogSearch";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import UsersManagement from "./pages/Admin/UsersManagement";
import CategoriesManagement from "./pages/Admin/CategoriesManagement";
import CommentsManagement from "./pages/Admin/CommentsManagement";
import NotificationsManagement from "./pages/Admin/NotificationsManagement";
import BlogsManagement from "./pages/Admin/BlogsManagement";
import ReactionsManagement from "./pages/Admin/ReactionsManagement"; // new

// Profile Pages
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import AddUserModal from "./pages/Admin/Users/AddUserModal";
import MyBlogs from "./pages/Blogs/MyBlogs";
import ReactionTest from "./components/ReactionTest";


// ---------------- Layout wrapper for Navbar + Footer ----------------
const Layout = ({ children }) => {
  const location = useLocation();

  const hideFooterPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/reset-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/verify-email",
  ];

  const shouldHideFooter = hideFooterPaths.includes(location.pathname.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

// ---------------- AppContent: Handles routing ----------------
const AppContent = () => {
  return (
    <Routes>
      {/* Public Pages */}

      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Blog Pages */}
      <Route path="/blogs" element={<BlogList />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/blogs/search" element={<BlogSearch />} />
      <Route path="/my-blogs" element={<MyBlogs/>} />

      {/* Auth Pages */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
      <Route path="/auth/reset-password/" element={<ResetPassword />} />
      <Route path="/reset-password/" element={<ResetPassword />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Profile Pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/auth/change-password" element={<ChangePassword />} />
        <Route path="/blogs/create" element={<BlogCreate />} />
        <Route path="/blogs/edit/:id" element={<BlogEdit />} />
      </Route>

      {/* Admin Routes with AdminLayout */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/blogs" element={<BlogsManagement />} />
          <Route path="/admin/categories" element={<CategoriesManagement />} />
          <Route path="/admin/comments" element={<CommentsManagement />} />
          <Route path="/admin/notifications" element={<NotificationsManagement />} />
          <Route path="/admin/reactions" element={<ReactionsManagement />} />
          <Route path="/admin/users/add" element={<AddUserModal />} />
        </Route>
      </Route>
    </Routes>
  );
};

// ---------------- Main App ----------------
const App = () => (
  <Router>
    <Layout>
      {/* <ReactionTest/> */}
      <AppContent />
    </Layout>
    <ToastContainer position="top-right" autoClose={3000} />
  </Router>
);

export default App;

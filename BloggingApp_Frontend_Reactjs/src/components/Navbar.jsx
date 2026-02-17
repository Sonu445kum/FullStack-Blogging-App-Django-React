
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Search,
//   Sun,
//   Moon,
//   User,
//   LogOut,
//   Settings,
//   Menu,
//   X,
// } from "lucide-react";
// import { useGetBlogsQuery } from "../api/apiSlice";
// import useDebounce from "../hooks/useDebounce";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Theme persistence
//   const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [menuOpen, setMenuOpen] = useState(false);

//   // ✅ User & Auth Info
//   const token = localStorage.getItem("token");
//   const [username, setUsername] = useState("");

//   // ✅ Load username dynamically from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUsername(parsedUser?.username || "User");
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//       }
//     }
//   }, [token]);

//   // ✅ Determine role
//   const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
//   const role = user?.is_admin ? "admin" : "user";

//   // ✅ Hide My Blogs if not logged in
//   const links = useMemo(() => {
//     const baseLinks = [
//       { name: "Home", path: "/" },
//       { name: "Blogs", path: "/blogs" },
//       { name: "About", path: "/about" },
//       { name: "Contact", path: "/contact" },
//     ];
//     if (token) baseLinks.splice(2, 0, { name: "My Blogs", path: "/my-blogs" });
//     else baseLinks.splice(2, 0, { name: "My Blogs", path: "/my-blogs" }); // still show but protected
//     return baseLinks;
//   }, [token]);

//   // ✅ Fetch blogs for search suggestions
//   const { data: blogsData } = useGetBlogsQuery(1);
//   const blogs = useMemo(() => blogsData?.results || [], [blogsData]);
//   const debouncedSearchTerm = useDebounce(searchTerm, 400);

//   // ✅ Theme toggle
//   const toggleTheme = useCallback(() => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//   }, [theme]);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark");
//   }, [theme]);

//   // ✅ Close dropdowns on route change
//   useEffect(() => {
//     setShowDropdown(false);
//     setMenuOpen(false);
//     setSuggestions([]);
//   }, [location.pathname]);

//   // ✅ Search logic
//   useEffect(() => {
//     if (!debouncedSearchTerm) return setSuggestions([]);
//     const matched = blogs
//       .filter((blog) =>
//         blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//       )
//       .slice(0, 5);
//     setSuggestions(matched);
//   }, [debouncedSearchTerm, blogs]);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/blogs/search?query=${encodeURIComponent(searchTerm)}`);
//       setSuggestions([]);
//       setMenuOpen(false);
//     }
//   };

//   const handleSuggestionClick = (title) => {
//     setSearchTerm(title);
//     setSuggestions([]);
//     navigate(`/blogs/search?query=${encodeURIComponent(title)}`);
//     setMenuOpen(false);
//   };

//   // ✅ Logout logic
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUsername("");
//     navigate("/auth/login");
//   };

//   // ✅ Protected route logic
//   const handleProtectedRoute = (path) => {
//     if (!token) {
//       navigate("/auth/login");
//     } else {
//       navigate(path);
//     }
//   };

//   return (
//     <nav className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transition-transform"
//         >
//           SonuBlogApp
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-6">
//           {links.map((link) => {
//             const isProtected = link.name === "My Blogs";
//             return isProtected ? (
//               <button
//                 key={link.name}
//                 onClick={() => handleProtectedRoute(link.path)}
//                 className="text-gray-200 hover:text-yellow-500 transition"
//               >
//                 {link.name}
//               </button>
//             ) : (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className="text-gray-200 hover:text-yellow-500 transition"
//               >
//                 {link.name}
//               </Link>
//             );
//           })}

//           {/* Search Bar */}
//           <div className="relative">
//             <form onSubmit={handleSearchSubmit}>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search blogs..."
//                 className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
//               />
//               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//             </form>

//             <AnimatePresence>
//               {suggestions.length > 0 && (
//                 <motion.ul
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10"
//                 >
//                   {suggestions.map((blog) => (
//                     <li
//                       key={blog.id}
//                       onClick={() => handleSuggestionClick(blog.title)}
//                       className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
//                     >
//                       {blog.title}
//                     </li>
//                   ))}
//                 </motion.ul>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="p-2 rounded-full bg-gray-700 hover:bg-yellow-500 hover:text-white transition"
//           >
//             {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//           </button>

//           {/* Auth Section */}
//           {token ? (
//             <div className="relative flex items-center space-x-3">
//               <span className="text-gray-300 text-sm font-medium">
//                 Welcome, <span className="text-yellow-400">{username}</span> 👋
//               </span>

//               {role === "admin" && (
//                 <motion.span
//                   initial={{ opacity: 0, y: -5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4 }}
//                   className="text-xs font-bold px-2 py-1 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 border border-yellow-500 animate-pulse"
//                 >
//                   Admin
//                 </motion.span>
//               )}

//               <button
//                 onClick={() => setShowDropdown((prev) => !prev)}
//                 className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-white hover:scale-105 transition"
//               >
//                 <User size={18} />
//               </button>

//               <AnimatePresence>
//                 {showDropdown && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="absolute right-0 top-12 w-44 bg-gray-800 rounded-lg shadow-md overflow-hidden"
//                   >
//                     {role === "admin" && (
//                       <Link
//                         to="/admin/dashboard"
//                         className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
//                       >
//                         <Settings size={16} className="mr-2" /> Dashboard
//                       </Link>
//                     )}
//                     <Link
//                       to="/profile"
//                       className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
//                     >
//                       <User size={16} className="mr-2" /> Profile
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600"
//                     >
//                       <LogOut size={16} className="mr-2" /> Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           ) : (
//             <div className="flex space-x-4">
//               <Link to="/auth/login" className="text-gray-200 hover:text-yellow-500">
//                 Login
//               </Link>
//               <Link to="/auth/register" className="text-gray-200 hover:text-yellow-500">
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu */}
//         <div className="md:hidden relative">
//           <button
//             onClick={() => setMenuOpen((prev) => !prev)}
//             className="p-2 rounded-md text-gray-200 hover:text-yellow-500 transition"
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           <AnimatePresence>
//             {menuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="absolute top-16 left-0 w-full bg-gray-800 px-6 py-4 shadow-md z-50"
//               >
//                 {links.map((link) => {
//                   const isProtected = link.name === "My Blogs";
//                   return isProtected ? (
//                     <button
//                       key={link.name}
//                       onClick={() => handleProtectedRoute(link.path)}
//                       className="block py-2 text-gray-200 hover:text-yellow-500 w-full text-left"
//                     >
//                       {link.name}
//                     </button>
//                   ) : (
//                     <Link
//                       key={link.name}
//                       to={link.path}
//                       onClick={() => setMenuOpen(false)}
//                       className="block py-2 text-gray-200 hover:text-yellow-500 w-full text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   );
//                 })}

//                 <form onSubmit={handleSearchSubmit} className="relative mt-3">
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search blogs..."
//                     className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
//                   />
//                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//                 </form>

//                 <div className="mt-4 border-t border-gray-700 pt-3">
//                   {token ? (
//                     <>
//                       <span className="block text-gray-300 mb-2">
//                         Welcome, <span className="text-yellow-400">{username}</span> 👋
//                       </span>
//                       {role === "admin" && (
//                         <Link
//                           to="/admin/dashboard"
//                           className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
//                         >
//                           Dashboard
//                         </Link>
//                       )}
//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
//                       >
//                         Profile
//                       </Link>
//                       <button
//                         onClick={() => {
//                           handleLogout();
//                           setMenuOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600"
//                       >
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <Link
//                         to="/auth/login"
//                         className="block py-2 text-gray-200 hover:text-yellow-500"
//                       >
//                         Login
//                       </Link>
//                       <Link
//                         to="/auth/register"
//                         className="block py-2 text-gray-200 hover:text-yellow-500"
//                       >
//                         Register
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </nav>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useGetBlogsQuery } from "../api/apiSlice";
import useDebounce from "../hooks/useDebounce";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Theme persistence
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ User & Auth Info
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  // ✅ Load user dynamically from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser?.username || "User");
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      setUser(null);
      setUsername("");
    }
  }, [token]);

  const role = user?.is_admin ? "admin" : "user";

  // ✅ Navigation Links (My Blogs only for logged-in users)
  const links = useMemo(() => {
    const baseLinks = [
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ];
    if (token) baseLinks.splice(2, 0, { name: "My Blogs", path: "/my-blogs", protected: true });
    return baseLinks;
  }, [token]);

  // ✅ Fetch blogs for search suggestions
  const { data: blogsData } = useGetBlogsQuery(1);
  const blogs = useMemo(() => blogsData?.results || [], [blogsData]);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // ✅ Theme toggle
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // ✅ Close dropdowns on route change
  useEffect(() => {
    setShowDropdown(false);
    setMenuOpen(false);
    setSuggestions([]);
  }, [location.pathname]);

  // ✅ Search logic
  useEffect(() => {
    if (!debouncedSearchTerm) return setSuggestions([]);
    const matched = blogs
      .filter((blog) =>
        blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .slice(0, 5);
    setSuggestions(matched);
  }, [debouncedSearchTerm, blogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/blogs/search?query=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
      setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setSuggestions([]);
    navigate(`/blogs/search?query=${encodeURIComponent(title)}`);
    setMenuOpen(false);
  };

  // ✅ Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername("");
    setUser(null);
    navigate("/auth/login");
  };

  // ✅ Protected route navigation
  const handleProtectedRoute = (path) => {
    if (!token) navigate("/auth/login");
    else navigate(path);
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transition-transform"
        >
          SonuBlogApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) =>
            link.protected ? (
              <button
                key={link.name}
                onClick={() => handleProtectedRoute(link.path)}
                className="text-gray-200 hover:text-yellow-500 transition"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-200 hover:text-yellow-500 transition"
              >
                {link.name}
              </Link>
            )
          )}

          {/* Search Bar */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10"
                >
                  {suggestions.map((blog) => (
                    <li
                      key={blog.id}
                      onClick={() => handleSuggestionClick(blog.title)}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-gray-200"
                    >
                      {blog.title}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-700 hover:bg-yellow-500 hover:text-white transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Section */}
          {token ? (
            <div className="relative flex items-center space-x-3">
              <span className="text-gray-300 text-sm font-medium">
                Welcome, <span className="text-yellow-400">{username}</span> 👋
              </span>

              {role === "admin" && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-bold px-2 py-1 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg border border-yellow-500 animate-pulse"
                >
                  Admin
                </motion.span>
              )}

              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-white hover:scale-105 transition"
              >
                <User size={18} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-12 w-44 bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    {role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
                      >
                        <Settings size={16} className="mr-2" /> Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
                    >
                      <User size={16} className="mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/auth/login" className="text-gray-200 hover:text-yellow-500">
                Login
              </Link>
              <Link to="/auth/register" className="text-gray-200 hover:text-yellow-500">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-md text-gray-200 hover:text-yellow-500 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-0 w-full bg-gray-800 px-6 py-4 shadow-md z-50"
              >
                {links.map((link) =>
                  link.protected ? (
                    <button
                      key={link.name}
                      onClick={() => {
                        handleProtectedRoute(link.path);
                        setMenuOpen(false);
                      }}
                      className="block py-2 text-gray-200 hover:text-yellow-500 w-full text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-gray-200 hover:text-yellow-500 w-full text-left"
                    >
                      {link.name}
                    </Link>
                  )
                )}

                <form onSubmit={handleSearchSubmit} className="relative mt-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none border border-gray-600 focus:ring-2 focus:ring-yellow-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </form>

                <div className="mt-4 border-t border-gray-700 pt-3">
                  {token ? (
                    <>
                      <span className="block text-gray-300 mb-2">
                        Welcome, <span className="text-yellow-400">{username}</span> 👋
                      </span>
                      {role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="block py-2 text-gray-200 hover:text-yellow-500"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth/register"
                        className="block py-2 text-gray-200 hover:text-yellow-500"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}


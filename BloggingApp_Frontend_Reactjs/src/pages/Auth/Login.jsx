// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useLoginMutation } from "../../api/apiSlice";
// import { toast } from "react-toastify";
// import Footer from "../../components/Footer";
// import { Eye, EyeOff } from "lucide-react";

// export default function Login() {
//   const navigate = useNavigate();
//   const [login] = useLoginMutation();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Simple form validation
//   const validate = () => {
//     const errs = {};
//     if (!username.trim()) errs.username = "Username is required";
//     if (!password) errs.password = "Password is required";
//     else if (password.length < 6) errs.password = "Password must be at least 6 characters";
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);

//     try {
//       const res = await login({ username, password }).unwrap();
//       const user = res.user;

//       if (!user.is_active) {
//         toast.error("Please verify your email before logging in.");
//         setLoading(false);
//         return;
//       }

//       // Save token and user info
//       localStorage.setItem("token", res.tokens.access);
//       localStorage.setItem("user", JSON.stringify(user));
      

//       toast.success("Login successful 🎉");

//       // Navigate based on role
//       if (user.is_admin) navigate("/admin/dashboard");
//       else navigate("/blogs");
//     } catch (err) {
//       const msg =
//         err?.data?.non_field_errors?.[0] ||
//         err?.data?.detail ||
//         "Login failed. Check credentials.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-grow flex justify-center items-center relative bg-gray-100">
//         <div
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1470')",
//           }}
//         >
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
//         </div>
//         <div className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl z-10 animate-fadeIn">
//           <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//             Welcome Back 👋
//           </h2>
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <div className="flex flex-col">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
//                   errors.username
//                     ? "border-red-500 focus:ring-red-400"
//                     : "focus:ring-blue-500"
//                 }`}
//               />
//               {errors.username && (
//                 <span className="text-red-500 text-sm mt-1">{errors.username}</span>
//               )}
//             </div>

//             <div className="relative flex flex-col">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
//                   errors.password
//                     ? "border-red-500 focus:ring-red-400"
//                     : "focus:ring-blue-500"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//               {errors.password && (
//                 <span className="text-red-500 text-sm mt-1">{errors.password}</span>
//               )}
//               <Link
//                 to="/auth/forgot-password"
//                 className="text-sm text-blue-600 hover:underline mt-2 self-end"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mt-2 flex justify-center items-center gap-2 transition"
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8H4z"
//                     ></path>
//                   </svg>
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>
//           <p className="mt-4 text-center text-gray-600">
//             Don’t have an account?{" "}
//             <Link
//               to="/auth/register"
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }


// new code
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  //  Validation
  const validate = () => {
    const errs = {};
    if (!usernameOrEmail.trim()) errs.usernameOrEmail = "Username or Email is required";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  //  Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Backend expects "username" field (even if it's email)
      const res = await login({
        username: usernameOrEmail,
        password,
      }).unwrap();

      const user = res.user;

      if (!user.is_active) {
        toast.error("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      // Save tokens & user info
      localStorage.setItem("token", res.tokens.access);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful 🎉");

      // Redirect user based on role
      if (user.is_admin) navigate("/admin/dashboard");
      else navigate("/blogs");
    } catch (err) {
      const msg =
        err?.data?.error ||
        err?.data?.detail ||
        "Login failed. Check username/email and password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex justify-center items-center relative bg-gray-100">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1470')",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl z-10 animate-fadeIn">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username or Email Field */}
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.usernameOrEmail
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.usernameOrEmail && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.usernameOrEmail}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative flex flex-col">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password}
                </span>
              )}
              <Link
                to="/auth/forgot-password"
                className="text-sm text-blue-600 hover:underline mt-2 self-end"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mt-2 flex justify-center items-center gap-2 transition"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register Redirect */}
          <p className="mt-4 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}


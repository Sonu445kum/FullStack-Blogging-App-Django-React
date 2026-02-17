// import React, { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   //  Load user from localStorage (if token-based auth)
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };


// new logic
import React, { createContext, useState, useEffect } from "react";

/**
 * ✅ Create a global context for user
 * This allows us to access user data in any component
 * without prop drilling.
 */
export const UserContext = createContext();

/**
 * ✅ UserProvider component wraps around the entire app
 * so that all child components can access user context.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * ✅ Load user data from localStorage (e.g., after page refresh)
   * When user logs in, we can store the info in localStorage.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  /**
   * ✅ Optionally: Whenever user changes, update localStorage
   * This ensures data stays in sync between context and storage.
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  /**
   * ✅ Provide user and setUser function globally
   */
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

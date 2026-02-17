// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { Provider } from "react-redux";
// import { store } from "./app/store";
// import "./index.css";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

// ReactDOM.createRoot(document.getElementById("root")).render(
//     <Provider store={store}>
//       <App />
//       {/* ToastContainer ko yaha rakha hai, Provider ke andar */}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </Provider>
  
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserContext"; // ✅ Added import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider> {/*  Wrap your entire app with UserProvider */}
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </UserProvider>
    </Provider>
  </React.StrictMode>
);


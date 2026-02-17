import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  //  In pages par footer hide karne ke liye paths
  const hideFooterPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar always visible */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-grow">{children}</main>

      {/* Footer hidden on auth-related pages */}
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default Layout;

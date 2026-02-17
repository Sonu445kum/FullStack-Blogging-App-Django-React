import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // <--- define user
  const isAdmin = user?.is_admin;

  return token && isAdmin ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default AdminRoute;
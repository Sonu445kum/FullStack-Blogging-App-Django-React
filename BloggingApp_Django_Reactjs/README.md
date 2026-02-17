# Fullstack Blogging Platform

A full-featured blogging platform built with **Django REST Framework (Backend)** and **React.js (Frontend)**.  
Users can read, write, comment on blogs, and admins can manage users, blogs, and categories.

---

## **Table of Contents**

1. [Project Overview](#project-overview)  
2. [Technologies Used](#technologies-used)  
3. [Features](#features)  
4. [Folder Structure](#folder-structure)  
5. [Backend Setup (Django)](#backend-setup-django)  
6. [Frontend Setup (React)](#frontend-setup-react)  
7. [API Endpoints](#api-endpoints)  
8. [Screenshots](#screenshots)  



## **Project Overview**

This project is a **fullstack blogging platform** with the following roles:

- **Public Users**: Can read blogs, search, and filter by categories.  
- **Registered Users**: Can create, edit, delete their own blogs, comment on blogs.  
- **Admin Users**: Can manage users, blogs, categories, and view platform stats.  

It demonstrates:

- **Django**: Models, serializers, views, authentication (JWT), permissions, file handling, admin.  
- **React**: State management, routing, forms, API integration, file uploads, charts (Recharts).  
- **Fullstack**: API consumption, authentication handling, protected routes, admin dashboard, comments system.  

---

## **Technologies Used**

- Backend: Python, Django, Django REST Framework, djangorestframework-simplejwt, Pillow  
- Frontend: React.js, Axios, React Router, React Toastify, React Quill, Recharts  
- Database: SQLite (default)  
- Deployment (Optional): Can be deployed on Heroku, Vercel, or AWS  

---

## **Features**

### Public:
- View list of blogs  
- View blog details with comments  
- Filter blogs by category  

### Registered Users:
- JWT Authentication (Login/Register)  
- Create new blogs with image upload and rich text content  
- Edit/Delete own blogs  
- Add/Delete own comments  
- Update profile picture  

### Admin Users:
- Manage all users, blogs, categories  
- Admin dashboard with stats: total users, total blogs, recent activity  
- Charts using Recharts  

---

## **Folder Structure**

### Backend (Django)

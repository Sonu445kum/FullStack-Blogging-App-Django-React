# BloggingApp Frontend

This repository contains the frontend of the Blogging App built using **Vite + React.js**. It works with the Django backend API of the Blogging App.

## Features

- React 18 + Vite for fast and modern frontend development
- Redux Toolkit (RTK) + RTK Query for global state & API management
- React Toastify for notifications
- Form validation using React Hook Form + Yup
- Modular, scalable, and maintainable folder structure
- Environment-based API configuration
- Fully responsive UI

## Folder Structure

BloggingApp_Frontend/
│
├─ public/
├─ src/
│   ├─ app/
│   │   ├─ store.js          # Redux store
│   │   └─ apiSlice.js       # RTK Query base API
│   │
│   ├─ features/
│   │   ├─ auth/             # Login / Signup
│   │   ├─ blog/             # Blog CRUD & API integration
│   │   └─ notifications/    # Toastify notifications
│   │
│   ├─ components/           # Reusable UI components
│   ├─ pages/                # Routes / Pages
│   ├─ hooks/                # Custom React hooks
│   ├─ utils/                # Utilities & validation schemas
│   ├─ services/             # API endpoints / helpers
│   ├─ App.jsx
│   └─ main.jsx
│
├─ .gitignore
├─ package.json
├─ vite.config.js
└─ README.md


































# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

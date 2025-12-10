// File: src/index.js (atau index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client'; // PENTING: Menggunakan React 18 API
import './index.css'; // Opsional: jika ada
import App from './App'; // Import component utama

// 1. Temukan elemen DOM dengan id 'root'
const rootElement = document.getElementById('root');

// 2. Gunakan createRoot untuk membuat root render
const root = ReactDOM.createRoot(rootElement);

// 3. Render App component di dalam root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
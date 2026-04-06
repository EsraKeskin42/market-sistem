import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ProductUpdate from './ProductUpdate';
import Reports from './Reports';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/product-update" element={<ProductUpdate />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
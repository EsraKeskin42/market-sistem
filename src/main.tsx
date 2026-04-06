import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PriceUpdate from './PriceUpdate';
import Reports from './Reports';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/price-update" element={<PriceUpdate />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
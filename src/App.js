import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Admin from './screens/Admin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

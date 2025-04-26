import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import AddTransaction from './Pages/AddTransaction';
import TransactionHistory from './Pages/TransactionHistory';
import Budgets from './Pages/Budgets';
import Reports from './Pages/Reports';
import Settings from './Pages/Settings';
import { FinanceProvider } from './Context/FinanceContext';
import './App.css'; 


function App() {
  return (
    <FinanceProvider>
      <Router>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;

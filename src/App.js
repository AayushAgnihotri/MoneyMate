import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Contact from './pages/contact';
import Dashboard from './Dashboard/Dashboard';
import FinancialReportsPage from './pages/dashboard/FinancialReports';
import Transactions from './pages/dashboard/Transactions';
import Budget from './pages/dashboard/Budget';
import Goals from './pages/dashboard/Goals';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Settings from './pages/dashboard/Settings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/transactions" element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/financial-reports" element={
                  <ProtectedRoute>
                    <FinancialReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/budget" element={
                  <ProtectedRoute>
                    <Budget />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/goals" element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                {/* Other routes */}
                <Route path="/about" element={<div>About Page (Coming Soon)</div>} />
                <Route path="/features" element={<div>Features Page (Coming Soon)</div>} />
                <Route path="/pricing" element={<div>Pricing Page (Coming Soon)</div>} />
              </Routes>
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </ThemeProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;

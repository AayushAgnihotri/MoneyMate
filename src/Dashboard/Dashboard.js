import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BillReminders from '../components/dashboard/BillReminders';
import AIInsights from '../components/dashboard/AIInsights';
import FinancialReports from '../components/dashboard/FinancialReports';
import '../components/dashboard/DashboardFeatures.css';
import './Dashboard.css';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../utils/auth';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { name: 'User' };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { name: 'User' };
    }
  });
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'You are close to exceeding your Shopping budget',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'deadline',
      message: 'Electricity bill payment due in 2 days',
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Successfully saved $100 in Emergency Fund',
      time: '1 day ago'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [metrics, setMetrics] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      const response = await axios.get('/api/expenses/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currencies = {
    USD: '$',
    INR: '₹',
    GBP: '£'
  };

  const handleCurrencyChange = useCallback((e) => {
    setCurrency(e.target.value);
  }, []);

  const handleNotificationClick = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="brand">
            <span className="text-primary">Money</span>
            <span className="text-success">Mate</span>
          </Link>
        </div>
        
        {/* Add user info section */}
        <div className="user-info">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link active">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link to="/dashboard/transactions" className="nav-link">
            <i className="fas fa-exchange-alt"></i> Transactions
          </Link>
          <Link to="/dashboard/budget" className="nav-link">
            <i className="fas fa-chart-pie"></i> Budget
          </Link>
          <Link to="/dashboard/goals" className="nav-link">
            <i className="fas fa-bullseye"></i> Goals
          </Link>
          <Link to="/dashboard/financial-reports" className="nav-link">
            <i className="fas fa-file-alt"></i> Financial Reports
          </Link>
          <Link to="/dashboard/settings" className="nav-link">
            <i className="fas fa-cog"></i> Settings
          </Link>
          <Link to="/" className="nav-link">
            <i className="fas fa-globe"></i> Go to Website
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
        <div className="sidebar-footer">
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <header className="dashboard-header">
          <div className="header-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-right">
            <div className="currency-selector">
              <select 
                value={currency} 
                onChange={handleCurrencyChange}
                className="form-select"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="notifications-wrapper">
              <div 
                className="notifications-icon"
                onClick={handleNotificationClick}
              >
                <i className="fas fa-bell"></i>
                {notifications.length > 0 && (
                  <span className="notification-badge">
                    {notifications.length}
                  </span>
                )}
              </div>
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="clear-all">Clear All</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.type}`}
                      >
                        <div className="notification-icon">
                          <i className={`fas ${
                            notification.type === 'warning' ? 'fa-exclamation-triangle' :
                            notification.type === 'deadline' ? 'fa-clock' :
                            'fa-check-circle'
                          }`}></i>
                        </div>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        <button 
                          className="dismiss-notification"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Profile" />
              <span>{user.name}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="card-info">
                <h3>Total Balance</h3>
                <p className="amount">
                  ${Number(metrics.totalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <span className={`trend ${metrics.totalBalance >= 0 ? 'positive' : 'negative'}`}>
                  {metrics.totalBalance >= 0 ? '+' : '-'}
                </span>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-arrow-down"></i>
              </div>
              <div className="card-info">
                <h3>Income</h3>
                <p className="amount">
                  ${Number(metrics.totalIncome).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <span className="trend positive">+</span>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="card-info">
                <h3>Expenses</h3>
                <p className="amount">
                  ${Number(metrics.totalExpenses).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <span className="trend negative">-</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <DashboardCharts />

          {/* AI Insights Section */}
          <AIInsights />

          {/* Bill Reminders Section */}
          <BillReminders />

          {/* Recent Transactions */}
          <div className="recent-transactions">
            <h2>Recent Transactions</h2>
            <div className="transactions-list">
              {/* Sample transactions */}
              <div className="transaction-item">
                <div className="transaction-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="transaction-info">
                  <h4>Grocery Shopping</h4>
                  <p>Today, 2:30 PM</p>
                </div>
                <div className="transaction-amount negative">
                  -$85.20
                </div>
              </div>
              <div className="transaction-item">
                <div className="transaction-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="transaction-info">
                  <h4>Salary Deposit</h4>
                  <p>Yesterday, 9:00 AM</p>
                </div>
                <div className="transaction-amount positive">
                  +$3,500.00
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

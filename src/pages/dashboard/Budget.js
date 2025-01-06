import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../hooks/useCurrency';
import BudgetModal from '../../components/budget/BudgetModal';
import BudgetChart from '../../components/budget/BudgetChart';
import BudgetProgress from '../../components/budget/BudgetProgress';
import './Budget.css';
import '../../styles/dashboard-pages.css';

const Budget = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { selectedCurrency, formatAmount } = useCurrency();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/budget', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (Array.isArray(response.data)) {
        setBudgets(response.data);
      } else {
        setBudgets([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to load budgets');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (newBudget) => {
    try {
      const token = localStorage.getItem('token');
      
      if (selectedCategory) {
        const budget = budgets.find(b => b.category === selectedCategory);
        if (budget) {
          await axios.put(
            `http://localhost:8080/api/budget/${budget.id}`,
            {
              category: selectedCategory,
              amount: parseFloat(newBudget.amount),
              spentAmount: budget.spentAmount || 0,
              status: 'ACTIVE',
              description: newBudget.description || `Budget for ${selectedCategory}`,
              startDate: new Date().toISOString().split('T')[0],
              period: 'MONTHLY'
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }
      } else {
        await axios.post(
          'http://localhost:8080/api/budget',
          {
            category: newBudget.category,
            amount: parseFloat(newBudget.amount),
            spentAmount: 0,
            status: 'ACTIVE',
            description: newBudget.description || `Budget for ${newBudget.category}`,
            startDate: new Date().toISOString().split('T')[0],
            period: 'MONTHLY'
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      await fetchBudgets();
      setShowBudgetModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving budget:', error);
      setError(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  if (loading) return <div>Loading budgets...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalBudget = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spentAmount || 0), 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="budget-page">
      <div className="page-header">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="header-top">
            <div className="header-title">
              <h1>Budget Management</h1>
              <p>Track, analyze, and optimize your spending with our powerful budgeting tools</p>
            </div>
            <div className="header-actions">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search budgets by category..."
                  onChange={(e) => {/* Add search functionality */}}
                />
              </div>
              <button 
                className="secondary-button"
                onClick={() => fetchBudgets()}
                title="Refresh budgets"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
              <button 
                className="primary-button"
                onClick={() => setShowBudgetModal(true)}
              >
                <i className="fas fa-plus"></i>
                <span>Create Budget</span>
              </button>
            </div>
          </div>
          <nav className="header-nav">
            <Link to="/dashboard" className="nav-link">
              <i className="fas fa-home"></i> Dashboard
            </Link>
            <Link to="/dashboard/transactions" className="nav-link">
              <i className="fas fa-exchange-alt"></i> Transactions
            </Link>
            <Link to="/dashboard/budget" className="nav-link active">
              <i className="fas fa-wallet"></i> Budget
            </Link>
            <Link to="/dashboard/goals" className="nav-link">
              <i className="fas fa-bullseye"></i> Goals
            </Link>
            <Link to="/dashboard/reports" className="nav-link">
              <i className="fas fa-chart-bar"></i> Reports
            </Link>
            <Link to="/dashboard/settings" className="nav-link">
              <i className="fas fa-cog"></i> Settings
            </Link>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="budget-overview">
          <div className="budget-card total">
            <h2>Total Budget</h2>
            <div className="budget-amount">
              <span className="label">Budget: </span>
              <span className="value">{formatAmount(totalBudget)}</span>
            </div>
            <div className="budget-amount">
              <span className="label">Spent: </span>
              <span className="value">{formatAmount(totalSpent)}</span>
            </div>
            <div className={`budget-amount remaining ${getBudgetStatus(totalSpent, totalBudget)}`}>
              <span className="label">Remaining: </span>
              <span className="value">{formatAmount(remainingBudget)}</span>
            </div>
            <BudgetProgress spent={totalSpent} budget={totalBudget} />
          </div>

          <div className="budget-card chart">
            <h2>Budget Distribution</h2>
            <BudgetChart 
              budgets={budgets.reduce((acc, budget) => ({
                ...acc,
                [budget.category]: budget.amount
              }), {})}
              expenses={budgets.reduce((acc, budget) => ({
                ...acc,
                [budget.category]: budget.spentAmount
              }), {})}
              currency={selectedCurrency}
            />
          </div>
        </div>

        <div className="category-budgets">
          <h2>Category Budgets</h2>
          <div className="categories-grid">
            {budgets.map((budget) => (
              <div key={budget.id} className="category-card">
                <div className="category-header">
                  <h3>{budget.category}</h3>
                  <button 
                    className="btn-icon"
                    onClick={() => {
                      setSelectedCategory(budget.category);
                      setShowBudgetModal(true);
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
                <div className="budget-details">
                  <div className="amount-row">
                    <span>Budget:</span>
                    <span>{formatAmount(budget.amount)}</span>
                  </div>
                  <div className="amount-row">
                    <span>Spent:</span>
                    <span>{formatAmount(budget.spentAmount)}</span>
                  </div>
                </div>
                <BudgetProgress 
                  spent={budget.spentAmount} 
                  budget={budget.amount}
                  showPercentage
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBudgetModal && (
        <BudgetModal
          onClose={() => {
            setShowBudgetModal(false);
            setSelectedCategory(null);
          }}
          onSave={handleSaveBudget}
          category={selectedCategory}
          currentBudget={selectedCategory ? 
            budgets.find(b => b.category === selectedCategory)?.amount : 0}
          currency={selectedCurrency}
        />
      )}
    </div>
  );
};

export default Budget; 
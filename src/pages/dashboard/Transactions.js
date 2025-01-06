import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../hooks/useCurrency';
import TransactionModal from '../../components/transactions/TransactionModal';
import { useNavigate } from 'react-router-dom';
import './Transactions.css';

const Transactions = () => {
  const { darkMode } = useTheme();
  const { formatAmount } = useCurrency();
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('/api/expenses');
      
      if (response.data) {
        setTransactions(response.data);
      } else {
        setError('No transactions found');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.response?.status === 401) {
        navigate('/login'); // Redirect to login if unauthorized
      } else {
        setError('Failed to load transactions. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/api/expenses/${id}`);
        await fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'income') return transaction.type === 'INCOME';
      if (filter === 'expense') return transaction.type === 'EXPENSE';
      return true;
    })
    .filter(transaction =>
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const calculateTotal = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  if (error) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`transactions-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="transactions-container">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card income">
            <div className="stat-icon">
              <i className="fas fa-arrow-down"></i>
            </div>
            <div className="stat-info">
              <h3>Total Income</h3>
              <p>{formatAmount(calculateTotal('INCOME'))}</p>
            </div>
          </div>
          <div className="stat-card expense">
            <div className="stat-icon">
              <i className="fas fa-arrow-up"></i>
            </div>
            <div className="stat-info">
              <h3>Total Expenses</h3>
              <p>{formatAmount(calculateTotal('EXPENSE'))}</p>
            </div>
          </div>
          <div className="stat-card balance">
            <div className="stat-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="stat-info">
              <h3>Net Balance</h3>
              <p>{formatAmount(calculateTotal('INCOME') - calculateTotal('EXPENSE'))}</p>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="transactions-header">
          <div className="header-left">
            <h1>Transactions</h1>
            <p>Manage your income and expenses</p>
          </div>
          <button 
            className="add-transaction-btn"
            onClick={handleAddTransaction}
          >
            <i className="fas fa-plus"></i>
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filters Section */}
        <div className="transactions-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <i className="fas fa-list"></i> All
            </button>
            <button
              className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
              onClick={() => setFilter('income')}
            >
              <i className="fas fa-arrow-down"></i> Income
            </button>
            <button
              className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
              onClick={() => setFilter('expense')}
            >
              <i className="fas fa-arrow-up"></i> Expenses
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="transactions-list">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="no-transactions">
              <i className="fas fa-receipt"></i>
              <h3>No transactions found</h3>
              <p>Start by adding your first transaction</p>
              <button 
                className="add-transaction-btn"
                onClick={handleAddTransaction}
              >
                <i className="fas fa-plus"></i>
                <span>Add Transaction</span>
              </button>
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className={`transaction-card ${transaction.type.toLowerCase()}`}
              >
                <div className="transaction-icon">
                  <i className={`fas ${
                    transaction.type === 'INCOME' ? 'fa-arrow-down' : 'fa-arrow-up'
                  }`}></i>
                </div>
                <div className="transaction-details">
                  <h3>{transaction.description}</h3>
                  <div className="transaction-meta">
                    <span className="category">
                      <i className="fas fa-tag"></i> {transaction.category}
                    </span>
                    <span className="date">
                      <i className="fas fa-calendar"></i>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    <span className="payment">
                      <i className="fas fa-credit-card"></i>
                      {transaction.paymentMethod}
                    </span>
                  </div>
                  {transaction.notes && (
                    <p className="notes">
                      <i className="fas fa-sticky-note"></i> {transaction.notes}
                    </p>
                  )}
                </div>
                <div className="transaction-amount">
                  <h3 className={transaction.type.toLowerCase()}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </h3>
                </div>
                <div className="transaction-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditTransaction(transaction)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowModal(false);
            setError(null);
          }}
          onSave={async () => {
            try {
              await fetchTransactions();
              setShowModal(false);
              setError(null);
            } catch (err) {
              setError('Failed to save transaction. Please try again.');
            }
          }}
        />
      )}
    </div>
  );
};

export default Transactions; 
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './BudgetModal.css';

const BudgetModal = ({ onClose, onSave, category, currentBudget, currency }) => {
  const { darkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentBudget) {
      setAmount(currentBudget.toString());
    }
  }, [currentBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const budgetAmount = parseFloat(amount);
    
    if (!budgetAmount || budgetAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onSave({
      category,
      amount: budgetAmount
    });
  };

  return (
    <div className={`modal-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{category ? `Set Budget for ${category}` : 'Set Total Budget'}</h2>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Budget Amount ({currency.symbol})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal; 
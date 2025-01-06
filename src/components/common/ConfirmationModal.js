import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  item,
  type = 'danger', // 'danger' | 'warning' | 'info'
  currency
}) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={`confirmation-modal-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`confirmation-modal ${type}`}>
        <div className="confirmation-header">
          <div className="icon-wrapper">
            {type === 'danger' && <i className="fas fa-exclamation-triangle"></i>}
            {type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
            {type === 'info' && <i className="fas fa-info-circle"></i>}
          </div>
          <h3>{title}</h3>
        </div>
        
        <div className="confirmation-content">
          <p>{message}</p>
          {item && (
            <div className="item-details">
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Amount:</strong> {currency.symbol}{Math.abs(item.amount).toFixed(2)}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="confirmation-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`btn btn-${type}`}
            onClick={onConfirm}
          >
            Delete Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 
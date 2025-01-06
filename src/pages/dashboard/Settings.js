import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import axios from '../../utils/axiosConfig';
import './Settings.css';

const Settings = () => {
  const { selectedCurrency, updateCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    // Add more currencies as needed
  ];

  const handleCurrencyChange = async (currencyCode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to update currency to:', currencyCode);
      
      // First update the server
      const response = await axios.post('/api/settings/currency', { currency: currencyCode });
      console.log('Server response:', response.data);
      
      // Then update the local state
      const updated = await updateCurrency(currencyCode);
      if (!updated) {
        throw new Error('Failed to update local currency state');
      }
      
      console.log('Successfully updated currency');
      
    } catch (error) {
      console.error('Currency update failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      setError(error.response?.data?.error || 'Failed to update currency settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences</p>
        </div>

        <div className="settings-section">
          <h2>Currency Settings</h2>
          <p>Choose your preferred currency for all transactions</p>
          
          <div className="currency-grid">
            {currencies.map((currency) => (
              <div
                key={currency.code}
                className={`currency-card ${selectedCurrency === currency.code ? 'active' : ''}`}
                onClick={() => handleCurrencyChange(currency.code)}
              >
                <div className="currency-symbol">{currency.symbol}</div>
                <div className="currency-info">
                  <h3>{currency.code}</h3>
                  <p>{currency.name}</p>
                </div>
                {selectedCurrency === currency.code && (
                  <div className="currency-selected">
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Updating settings...</p>
        </div>
      )}
    </div>
  );
};

export default Settings; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrencyPreference();
  }, []);

  const loadCurrencyPreference = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/settings/currency');
      if (response.data?.currency) {
        setSelectedCurrency(response.data.currency);
      }
    } catch (error) {
      console.error('Error loading currency preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrency = async (currency) => {
    try {
      setSelectedCurrency(currency);
      return true;
    } catch (error) {
      console.error('Error updating currency state:', error);
      return false;
    }
  };

  const formatAmount = (amount) => {
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: selectedCurrency,
      });
      return formatter.format(amount);
    } catch (error) {
      console.error('Error formatting amount:', error);
      return `${selectedCurrency} ${amount}`;
    }
  };

  const value = {
    selectedCurrency,
    updateCurrency,
    formatAmount,
    isLoading
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 
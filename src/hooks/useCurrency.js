import { useState, useEffect } from 'react';

export const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' }
];

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    return savedCurrency ? JSON.parse(savedCurrency) : currencies[0];
  });

  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency));
  }, [selectedCurrency]);

  const handleCurrencyChange = (e) => {
    const currency = currencies.find(c => c.code === e.target.value);
    setSelectedCurrency(currency);
  };

  const formatAmount = (amount) => {
    return `${selectedCurrency.symbol}${Math.abs(amount).toFixed(2)}`;
  };

  return {
    selectedCurrency,
    handleCurrencyChange,
    formatAmount,
    currencies
  };
}; 
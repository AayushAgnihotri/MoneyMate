import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import axios from '../../utils/axiosConfig';
import './TransactionModal.css';

const TransactionModal = ({ transaction, onClose, onSave }) => {
    const { formatAmount } = useCurrency();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        paymentMethod: '',
        type: 'EXPENSE',
        date: new Date().toISOString().slice(0, 16),
        notes: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || '',
                amount: transaction.amount || '',
                category: transaction.category || '',
                paymentMethod: transaction.paymentMethod || '',
                type: transaction.type || 'EXPENSE',
                date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                notes: transaction.notes || ''
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const dateTime = new Date(formData.date);
            
            const payload = {
                description: formData.description,
                amount: parseFloat(formData.amount),
                category: formData.category,
                paymentMethod: formData.paymentMethod,
                type: formData.type,
                date: dateTime.toISOString(),
                notes: formData.notes || ''
            };

            console.log('Sending payload:', payload);

            if (transaction) {
                await axios.put(`/api/expenses/${transaction.id}`, payload);
            } else {
                await axios.post('/api/expenses', payload);
            }

            onSave();
        } catch (error) {
            console.error('Error saving transaction:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to save transaction. Please try again.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="Enter amount"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select payment method</option>
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add notes (optional)"
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {transaction ? 'Update' : 'Add'} Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal; 
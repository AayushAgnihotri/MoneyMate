import React, { useState } from 'react';
import '../styles/TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        type: 'EXPENSE',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add Transaction</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select 
                            name="type" 
                            className="form-select"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            className="form-input"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            name="category"
                            className="form-input"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input
                            type="text"
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Payment Method</label>
                        <select 
                            name="paymentMethod" 
                            className="form-select"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="">Select Method</option>
                            <option value="CASH">Cash</option>
                            <option value="CARD">Card</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal; 
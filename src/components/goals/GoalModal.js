import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import './GoalModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBullseye,
    faPiggyBank,
    faCalendar,
    faMoneyBill,
    faList,
    faFlag
} from '@fortawesome/free-solid-svg-icons';
import Notification from '../notifications/Notification';

const GoalModal = ({ goal, onClose, onSave }) => {
    const { formatAmount } = useCurrency();
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        monthlySaving: '',
        category: '',
        priority: 'Medium'
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (goal) {
            setFormData({
                name: goal.name,
                targetAmount: goal.targetAmount,
                currentAmount: goal.currentAmount,
                deadline: goal.deadline,
                monthlySaving: goal.monthlySaving,
                category: goal.category,
                priority: goal.priority
            });
        }
    }, [goal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount),
            monthlySaving: parseFloat(formData.monthlySaving)
        });
        setNotification({
            message: goal ? 'Goal updated successfully!' : 'Goal created successfully!',
            type: 'success'
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{goal ? 'Edit Goal' : 'Create New Goal'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Goal Name</label>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faBullseye} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Emergency Fund"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Target Amount</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faPiggyBank} />
                                <input
                                    type="number"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Current Amount</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <input
                                    type="number"
                                    name="currentAmount"
                                    value={formData.currentAmount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Target Date</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faCalendar} />
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Monthly Saving</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <input
                                    type="number"
                                    name="monthlySaving"
                                    value={formData.monthlySaving}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faList} />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Savings">Savings</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Education">Education</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <div className="input-group">
                                <FontAwesomeIcon icon={faFlag} />
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {goal ? 'Update Goal' : 'Create Goal'}
                        </button>
                    </div>
                </form>
                {notification.message && (
                    <Notification message={notification.message} type={notification.type} />
                )}
            </div>
        </div>
    );
};

export default GoalModal; 
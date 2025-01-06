import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import GoalModal from '../../components/goals/GoalModal';
import GoalProgress from '../../components/goals/GoalProgress';
import '../../styles/dashboard-pages.css';
import './Goals.css';
import axios from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const Goals = () => {
  const { selectedCurrency, formatAmount } = useCurrency();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('financialGoals');
    return savedGoals ? JSON.parse(savedGoals) : [
      {
        id: 1,
        name: "Emergency Fund",
        targetAmount: 10000,
        currentAmount: 6500,
        deadline: "2024-12-31",
        monthlySaving: 500,
        category: "Savings",
        priority: "High",
        createdAt: "2024-01-01"
      },
      {
        id: 2,
        name: "Vacation Fund",
        targetAmount: 3000,
        currentAmount: 1200,
        deadline: "2024-08-15",
        monthlySaving: 300,
        category: "Travel",
        priority: "Medium",
        createdAt: "2024-02-01"
      }
    ];
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/goals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Goals response:', response.data); // Debug log
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load goals';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSaveGoal = async (goalData) => {
    try {
      if (selectedGoal) {
        const response = await axios.put(`/api/goals/${selectedGoal.id}`, goalData);
        setGoals(prev => prev.map(g => g.id === response.data.id ? response.data : g));
        toast.success('Goal updated successfully');
      } else {
        const response = await axios.post('/api/goals', goalData);
        setGoals(prev => [...prev, response.data]);
        toast.success('Goal created successfully');
      }
      setShowGoalModal(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`/api/goals/${goalId}`);
        setGoals(prev => prev.filter(g => g.id !== goalId));
        toast.success('Goal deleted successfully');
      } catch (error) {
        console.error('Error deleting goal:', error);
        toast.error('Failed to delete goal');
      }
    }
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const getGoalStatus = (goal) => {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const createdDate = new Date(goal.createdAt);
    const totalDays = (deadline - createdDate) / (1000 * 60 * 60 * 24);
    const daysElapsed = (today - createdDate) / (1000 * 60 * 60 * 24);
    const expectedProgress = (daysElapsed / totalDays) * 100;
    const actualProgress = calculateProgress(goal.currentAmount, goal.targetAmount);

    return {
      isOnTrack: actualProgress >= expectedProgress,
      remainingAmount: goal.targetAmount - goal.currentAmount,
      daysLeft: Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)),
      suggestedMonthlySaving: (goal.targetAmount - goal.currentAmount) / 
        (Math.ceil((deadline - today) / (1000 * 60 * 60 * 24 * 30)))
    };
  };

  const sortedGoals = [...goals].sort((a, b) => {
    const aStatus = getGoalStatus(a);
    const bStatus = getGoalStatus(b);
    return aStatus.daysLeft - bStatus.daysLeft;
  });

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
          <button onClick={fetchGoals} className="retry-button">
            <i className="fas fa-sync"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Financial Goals</h1>
          <p className="text-muted">Set and track your financial targets</p>
        </div>
        <button className="action-button" onClick={() => setShowGoalModal(true)}>
          <i className="fas fa-plus"></i> Add Goal
        </button>
      </div>

      <div className="goals-grid">
        {sortedGoals.map(goal => {
          const status = getGoalStatus(goal);
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div className="goal-title">
                  <h3>{goal.name}</h3>
                  <span className={`priority-badge ${goal.priority.toLowerCase()}`}>
                    {goal.priority}
                  </span>
                </div>
                <div className="goal-actions">
                  <button 
                    className="btn-icon"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowGoalModal(true);
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn-icon delete"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="goal-progress">
                <div className="progress-stats">
                  <span>{formatAmount(goal.currentAmount)} / {formatAmount(goal.targetAmount)}</span>
                  <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${status.isOnTrack ? 'on-track' : 'behind'}`}
                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="goal-details">
                <div className="amount-details">
                  <div className="detail-row">
                    <span>Remaining:</span>
                    <span>{formatAmount(status.remainingAmount)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Monthly Save:</span>
                    <span>{formatAmount(status.suggestedMonthlySaving)}</span>
                  </div>
                </div>
                <div className="timeline-details">
                  <div className="detail-row">
                    <span>Days Left:</span>
                    <span>{status.daysLeft}</span>
                  </div>
                  <div className="detail-row">
                    <span>Status:</span>
                    <span className={status.isOnTrack ? 'on-track' : 'behind'}>
                      {status.isOnTrack ? 'On Track' : 'Behind'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showGoalModal && (
        <GoalModal
          onClose={() => {
            setShowGoalModal(false);
            setSelectedGoal(null);
          }}
          onSave={handleSaveGoal}
          goal={selectedGoal}
        />
      )}
    </div>
  );
};

export default Goals; 
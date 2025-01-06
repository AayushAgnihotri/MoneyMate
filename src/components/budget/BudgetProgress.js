import React from 'react';
import './BudgetProgress.css';

const BudgetProgress = ({ spent, budget, showPercentage = false }) => {
  const progress = Math.min((spent / budget) * 100, 100);
  
  const getProgressColor = () => {
    if (progress >= 100) return 'exceeded';
    if (progress >= 80) return 'warning';
    if (progress >= 60) return 'attention';
    return 'normal';
  };

  return (
    <div className="budget-progress-container">
      {showPercentage && (
        <div className={`progress-label ${getProgressColor()}`}>
          {progress.toFixed(1)}%
        </div>
      )}
      <div className="progress-track">
        <div 
          className={`progress-bar ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        >
          <div className="progress-glow"></div>
        </div>
        <div className="threshold-markers">
          <div className="threshold" style={{ left: '60%' }}>
            <div className="threshold-line"></div>
          </div>
          <div className="threshold" style={{ left: '80%' }}>
            <div className="threshold-line"></div>
          </div>
          <div className="threshold" style={{ left: '100%' }}>
            <div className="threshold-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress; 
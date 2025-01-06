import React from 'react';


const GoalProgress = ({ current, target, daysLeft, isOnTrack }) => {
  const progress = Math.min((current / target) * 100, 100);
  
  const getProgressColor = () => {
    if (progress >= 100) return 'completed';
    if (progress >= 75) return 'near-goal';
    if (progress >= 50) return 'half-way';
    if (progress >= 25) return 'started';
    return 'initial';
  };

  const getStatusIcon = () => {
    if (progress >= 100) return 'fas fa-check-circle';
    if (isOnTrack) return 'fas fa-thumbs-up';
    return 'fas fa-exclamation-circle';
  };

  return (
    <div className="goal-progress-container">
      <div className="progress-header">
        <div className="progress-percentage">
          <span className={getProgressColor()}>{progress.toFixed(1)}%</span>
          <i className={`status-icon ${getStatusIcon()} ${isOnTrack ? 'on-track' : 'off-track'}`}></i>
        </div>
        <div className="days-left">
          <i className="far fa-clock"></i>
          <span>{daysLeft} days left</span>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        >
          <div className="progress-glow"></div>
        </div>
        
        <div className="milestone-markers">
          <div className="milestone" style={{ left: '25%' }}>
            <div className="milestone-dot"></div>
            <span>25%</span>
          </div>
          <div className="milestone" style={{ left: '50%' }}>
            <div className="milestone-dot"></div>
            <span>50%</span>
          </div>
          <div className="milestone" style={{ left: '75%' }}>
            <div className="milestone-dot"></div>
            <span>75%</span>
          </div>
          <div className="milestone" style={{ left: '100%' }}>
            <div className="milestone-dot"></div>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress; 
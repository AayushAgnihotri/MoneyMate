import React from 'react';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
    return (
        <div className="dashboard-header">
            <div className="header-items">
                <Link to="/dashboard" className="header-item">
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                </Link>
                <Link to="/settings" className="header-item">
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHeader; 